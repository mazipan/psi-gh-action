const github = require('@actions/github')
const exec = require('@actions/exec')
const fs = require('fs')
const { getAvailableReports } = require('../utils')
const { CONSTANT } = require('../constants')
const { blue } = require('../logger')

exports.pushGitChanges = async function pushGitChanges (data, token, branch) {
  blue('> Trying to push_back to the repository...')
  const context = github.context
  const remoteRepo = `https://${context.actor}:${token}@github.com/${context.repo.owner}/${context.repo.repo}.git`

  fs.writeFileSync(CONSTANT.LAST_UPDATE_FILE, `${new Date().toISOString()}`)
  fs.writeFileSync(CONSTANT.REPORT_FILE, `${JSON.stringify(data, null, 2)}`)

  const files = getAvailableReports()

  const newAllReportContents = {
    latest: CONSTANT.TODAY_REPORT_FILE,
    all: files
  }

  fs.writeFileSync(CONSTANT.ALL_REPORT_FILE, `${JSON.stringify(newAllReportContents, null, 2)}`)

  await exec.exec('git config --local user.email "actions@github.com"')
  await exec.exec('git config --local user.name "Github Actions"')
  await exec.exec(`git add ${CONSTANT.LAST_UPDATE_FILE} ${CONSTANT.REPORT_FILE} ${CONSTANT.ALL_REPORT_FILE}`)
  await exec.exec('git commit -m "chore(psi-gh-action): generated report file"')
  await exec.exec(`git push "${remoteRepo}" HEAD:${branch} --follow-tags --force`)
}

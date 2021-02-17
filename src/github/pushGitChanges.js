const github = require('@actions/github')
const exec = require('@actions/exec')
const fs = require('fs')
const { getAvailableReports } = require('../utils')
const { CONSTANT } = require('../constants')
const { red, blue, newline } = require('../logger')

exports.pushGitChanges = async function pushGitChanges ({ data, token, branch, max }) {
  blue(`> Trying to push all changes to "${branch}" branch...`)
  const context = github.context
  const remoteRepo = `https://${context.actor}:${token}@github.com/${context.repo.owner}/${context.repo.repo}.git`

  fs.writeFileSync(CONSTANT.LAST_UPDATE_FILE, `${new Date().toISOString()}`)
  fs.writeFileSync(CONSTANT.REPORT_FILE, `${JSON.stringify(data, null, 2)}`)

  const files = getAvailableReports()

  let newAllReportContents = {
    latest: CONSTANT.TODAY_REPORT_FILE,
    all: files
  }

  const removedReports = []
  if (files.length > max) {
    // collect the "should removed data"
    for (let indexReport = 0; indexReport < files.length; indexReport++) {
      if (indexReport >= max) {
        removedReports.push(`${CONSTANT.REPORT_DIR}/${files[indexReport]}`)
      }
    }

    if (removedReports.length > 0) {
      for (const reportNeedToBeRemoved of removedReports) {
        try {
          if (fs.existsSync(reportNeedToBeRemoved)) {
            fs.unlinkSync(`${reportNeedToBeRemoved}`)
          }
        } catch (error) {
          red(error)
        }
      }

      // remove the removedReports from ALL_REPORT_FILE
      newAllReportContents = {
        latest: CONSTANT.TODAY_REPORT_FILE,
        all: getAvailableReports()
      }
    }
  }

  fs.writeFileSync(CONSTANT.ALL_REPORT_FILE, `${JSON.stringify(newAllReportContents, null, 2)}`)

  await exec.exec('git config --local user.email "actions@github.com"')
  await exec.exec('git config --local user.name "Github Actions"')
  await exec.exec(`git add ${CONSTANT.LAST_UPDATE_FILE} ${CONSTANT.REPORT_FILE} ${CONSTANT.ALL_REPORT_FILE} ${removedReports.join(' ')}`)
  await exec.exec('git commit -m "chore(psi-gh-action): ✨ generated report file"')
  await exec.exec(`git push "${remoteRepo}" HEAD:${branch} --follow-tags --force`)
  newline()
}

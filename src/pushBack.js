const github = require('@actions/github')
const exec = require('@actions/exec')
const io = require('@actions/io')
const fs = require('fs')
const { formatDate } = require('./utils')

const TODAY = formatDate(new Date());
const REPORT_DIR = 'psi-reports'
const LAST_UPDATE_FILE = `${REPORT_DIR}/LAST_UPDATED.txt`
const REPORT_FILE = `${REPORT_DIR}/report-${TODAY}.json`
const ALL_REPORT_FILE = `${REPORT_DIR}/available-reports.json`

exports.pushBack = async function pushBack(data, token, branch) {
  const context = github.context
  const remote_repo = `https://${context.actor}:${token}@github.com/${context.repo.owner}/${context.repo.repo}.git`

  io.mkdirP(REPORT_DIR)
  await fs.promises.writeFile(LAST_UPDATE_FILE, `${new Date().toISOString()}`)
  await fs.promises.writeFile(REPORT_FILE, `${JSON.stringify(data, null, 2)}`)

  const files = fs.readdirSync(REPORT_DIR).filter((file) => (file !== 'LAST_UPDATED.txt' && file !== 'available-reports.json')).reverse()
  const newAllReportContents = {
    latest: `report-${TODAY}.json`,
    all: files,
  }
  await fs.promises.writeFile(ALL_REPORT_FILE, `${JSON.stringify(newAllReportContents, null, 2)}`)

  await exec.exec(`git config --local user.email "actions@github.com"`)
  await exec.exec(`git config --local user.name "Github Actions"`)
  await exec.exec(`git add ${LAST_UPDATE_FILE}`)
  await exec.exec(`git add ${REPORT_FILE}`)
  await exec.exec(`git add ${ALL_REPORT_FILE}`)
  await exec.exec(`git commit -m "chore(psi-gh-action): report file"`)

  const cmd = `git push "${remote_repo}" HEAD:${branch} --follow-tags --force`
  await exec.exec(`${cmd}`)
}

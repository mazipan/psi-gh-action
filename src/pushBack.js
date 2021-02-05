const github = require('@actions/github')
const exec = require('@actions/exec')
const fs = require('fs')
const { info } = require('./logger')

exports.pushBack = async function pushBack(data, token, branch) {
  const context = github.context
  const remote_repo = `https://${context.actor}:${token}@github.com/${context.repo.owner}/${context.repo.repo}.git`

  await fs.promises.writeFile('LAST_UPDATED.txt', `${new Date().toISOString()}`)
  info(await exec.exec(`ls`))

  info(await exec.exec(`git status`))
  await exec.exec(`git config --local user.email "actions@github.com"`)
  await exec.exec(`git config --local user.name "Github Actions"`)
  await exec.exec(`git add LAST_UPDATED.txt`)
  await exec.exec(`git commit -m "chore(psi-gh-action): report file"`)

  const cmd = `git push "${remote_repo}" HEAD:${branch} --follow-tags --force`
  await exec.exec(`${cmd}`)
}

const github = require('@actions/github')
const core = require('@actions/core')

exports.setCommitStatus = async function setCommitStatus (token) {
  const context = github.context
  const actionUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`

  const octokit = github.getOctokit(token)

  try {
    core.info(`> Adding commit status on: ${context.sha}`)
    await octokit.repos.createCommitStatus({
      owner: context.repo.owner,
      repo: context.repo.repo,
      target_url: actionUrl,
      sha: context.sha,
      state: 'success',
      description: 'Success status by "psi-github-action"'
    })
  } catch (error) {
    core.info(error)
  }
}

const github = require('@actions/github')
const core = require('@actions/core')

exports.getListComments = async function getListComments (token) {
  const context = github.context
  const octokit = github.getOctokit(token)
  try {
    core.info(`> Get list of comments on commit: ${context.sha}`)
    const comments = await octokit.repos.listCommentsForCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha: context.sha,
      page: 1
    })
    return comments.data
  } catch (error) {
    core.info(error)
    return []
  }
}

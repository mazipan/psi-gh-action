const github = require('@actions/github')
const core = require('@actions/core')

exports.deleteComments = async function deleteComments (token, comments) {
  const context = github.context
  const octokit = github.getOctokit(token)
  try {
    for (const comment of comments) {
      core.info(`> Deleting comment: ${comment.id}`)
      await octokit.repos.deleteCommitComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: comment.id
      })
    }
  } catch (error) {
    core.info(error)
  }
}

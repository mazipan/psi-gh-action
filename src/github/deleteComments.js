const github = require('@actions/github')
const { blue, red } = require('../logger')

exports.deleteComments = async function deleteComments (token, comments) {
  const context = github.context
  const octokit = github.getOctokit(token)
  try {
    const commentsByBot = comments.filter(comment => comment.user.login === 'github-actions[bot]')
    for (const comment of commentsByBot) {
      blue(`> Deleting comment: ${comment.id}`)
      await octokit.rest.repos.deleteCommitComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: comment.id
      })
    }
  } catch (error) {
    red(error)
  }
}

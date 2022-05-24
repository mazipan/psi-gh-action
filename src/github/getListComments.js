const github = require('@actions/github')
const { blue, red } = require('../logger')

exports.getListComments = async function getListComments (token) {
  const context = github.context
  const octokit = github.getOctokit(token)
  try {
    blue(`> Get list of comments on commit: ${context.sha}`)
    const comments = await octokit.rest.repos.listCommentsForCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha: context.sha,
      page: 1
    })
    return comments.data
  } catch (error) {
    red(error)
    return []
  }
}

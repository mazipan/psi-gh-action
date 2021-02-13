const core = require('@actions/core')

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
exports.getInputList = function getInputList(arg, separator = '\n') {
  const input = core.getInput(arg)
  if (!input) return []
  return input
    .split(separator)
    .map((url) => url.trim())
    .filter(Boolean)
}

/**
 * Format date to YYYY-MM-DD
 *
 * @param {Date} date
 */
exports.formatDate = function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}


/**
 * Format date to YYYY-MM-DD
 *
 * @param {Date} date
 */
exports.setPrecision = function setPrecision(value, precision = 2) {
  return parseFloat(value.toFixed(precision))
}

exports.createSuccessStatus = async function createSuccessStatus({ octokit, context, url, hash, desc = 'Success status by "psi-github-action"' }) {
  try {
    await octokit.repos.createCommitStatus({
      owner: context.repo.owner,
      repo: context.repo.repo,
      target_url: url,
      sha: hash,
      state: 'success',
      description: desc
    })
  } catch (error) {
    console.error(error)
  }
}

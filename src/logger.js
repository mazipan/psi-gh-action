const core = require('@actions/core')

/**
 * Console info
 *
 * @param {string} message
 */
exports.info = function info(message) {
  core.info(`${message}`)
}

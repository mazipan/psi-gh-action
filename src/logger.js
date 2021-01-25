const core = require('@actions/core')

/**
 * Console info
 *
 * @param {string} message
 * @returns void
 */
exports.info = function info(message) {
  core.info(`${message}`)
}

/**
 * Start the console group
 *
 * @param {string} message
 * @returns void
 */
exports.startGroup = function startGroup(message) {
  core.startGroup(`${message}`)
}

/**
 * End the console group
 *
 * @returns void
 */
exports.endGroup = function endGroup() {
  core.endGroup()
}

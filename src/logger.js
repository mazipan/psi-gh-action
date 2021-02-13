const core = require('@actions/core')
const c = require('ansi-colors');

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
 * Console success
 *
 * @param {string} message
 * @returns void
 */
exports.success = function success(message) {
  core.info(c.greenBright(`${message}`))
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

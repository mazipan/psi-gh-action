const core = require('@actions/core')

/**
 * Console debug
 *
 * @param {string} message
 */
exports.debug = function debug(message) {
  core.debug(`[DEBUG] ${message}`)
}

/**
 * Console info
 *
 * @param {string} message
 */
exports.info = function info(message) {
  core.info(`[INFO] ${message}`)
}

const core = require('@actions/core')

/**
 * Console info
 *
 * @param {string} message
 */
exports.info = function info(message) {
  core.info(`${message}`)
}

/**
 * Console warn
 *
 * @param {string} message
 */
exports.warn = function warn(message) {
  core.warn(`${message}`)
}
/**
 * Console info
 *
 * @param {string} message
 */
exports.startGroup = function startGroup(message) {
  core.startGroup(`${message}`)
}


/**
 * Console info
 */
exports.endGroup = function endGroup() {
  core.endGroup()
}

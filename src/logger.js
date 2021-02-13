const core = require('@actions/core')
const chalk = require('chalk');

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
 * Console info using green color
 *
 * @param {string} message
 * @returns void
 */
exports.success = function success(message) {
  core.info(chalk.green(`${message}`))
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

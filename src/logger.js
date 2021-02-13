const core = require('@actions/core')

function green (message) {
  core.info(`\u001b[32m${message}\u001b[0m`)
}

function yellow (message) {
  core.info(`\u001b[33m${message}\u001b[0m`)
}

function red (message) {
  core.info(`\u001b[31m${message}\u001b[0m`)
}

function blue (message) {
  core.info(`\u001b[36m${message}\u001b[0m`)
}

function magenta (message) {
  core.info(`\u001b[35m${message}\u001b[0m`)
}

function newline () {
  core.info('')
}

exports.green = green
exports.yellow = yellow
exports.red = red
exports.blue = blue
exports.magenta = magenta
exports.newline = newline

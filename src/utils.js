const core = require('@actions/core')
const spawn = require('child_process').spawn

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
exports.getInputList = function getInputList(arg, separator = '\n') {
  const input = core.getInput(arg)
  if (!input) return []
  return input.split(separator).map((url) => url.trim()).filter(Boolean)
}

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
exports.exec = function exec(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const app = spawn(cmd, args, { stdio: 'inherit' })
    app.on('close', (code) => {
      if (code !== 0) {
        err = new Error(`Invalid status code: ${code}`)
        err.code = code
        return reject(err)
      }
      return resolve(code)
    })
    app.on('error', reject)
  })
}

const { execSync } = require('child_process')
const { blue, red } = require('../logger')

exports.setActionSummary = async function setActionSummary ({ commentBody }) {
  try {
    blue('> Creating Action summary...')
    execSync(`echo '${commentBody}' >> $GITHUB_STEP_SUMMARY`)
  } catch (error) {
    red(error)
  }
}

const core = require('@actions/core')
const github = require('@actions/github')
const { getInputList } = require('./src/utils')
const { runLh } = require('./src/runLh')
const { debug, info } = require('./src/logger')

async function main() {
  info('Action starting...')

  const urls = getInputList('urls')
  const devices = getInputList('devices')
  const runs = core.getInput('runs')

  // Debug all config sent by user
  debug(`Config urls: ${urls}`)
  debug(`Config devices: ${devices}`)
  debug(`Config runs: ${runs}`)

  for (const url of urls) {
    await runLh(url, 'mobile')
  }
}

main()
  .catch((err) => {
    core.setFailed(err.message)
    process.exit(1)
  })
  .then(() => {
    info(`Completed in ${process.uptime()}s.`)
    process.exit()
  })

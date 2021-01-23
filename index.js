const core = require('@actions/core')
// const github = require('@actions/github')
const { getInputList } = require('./src/utils')
const { debug, info } = require('./src/logger')

async function main() {
  info('Action starting...')

  const urls = getInputList('urls')
  const devices = getInputList('devices')
  const runs = core.getInput('runs')

  // Debug all config sent by user except the api key
  debug(`Config urls: ${urls}`)
  debug(`Config devices: ${devices}`)
  debug(`Config runs: ${runs}`)

  for (const url of urls) {
    await runLh(url, 'mobile', core.getInput('api_key'))
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

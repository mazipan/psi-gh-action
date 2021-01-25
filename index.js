const core = require('@actions/core')
const { getInputList } = require('./src/utils')
const { info } = require('./src/logger')
const { callPageSpeed } = require('./src/callPageSpeed')

async function main() {
  info('🐯 "psi-github-action" starting...')
  info('')

  const urls = getInputList('urls')
  const devices = getInputList('devices')
  const runs = core.getInput('runs')

  for (const url of urls) {
    for (const device of devices) {
      for (let index = 0; index < runs; index++) {
        await callPageSpeed(url, device, core.getInput('api_key'))
      }
    }
  }
}

main()
  .catch((err) => {
    core.setFailed(err.message)
    process.exit(1)
  })
  .then(() => {
    info(`✅ Completed in ${process.uptime()}s.`)
    process.exit()
  })

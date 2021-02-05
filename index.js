const core = require('@actions/core')

const { getInputList } = require('./src/utils')
const { info } = require('./src/logger')
const { callPageSpeed } = require('./src/callPageSpeed')
const { pushBack } = require('./src/pushBack')

async function main() {
  info('🐯 "psi-github-action" starting...')
  info('')

  const urls = getInputList('urls')
  const devices = getInputList('devices')
  const runs = core.getInput('runs')
  const isPushBack = core.getInput('push_back')
  const token = core.getInput('token')
  const branch = core.getInput('branch')

  let allResponse = []
  for (const url of urls) {
    for (const device of devices) {
      for (let index = 0; index < runs; index++) {
        const response = await callPageSpeed(url, device, core.getInput('api_key'))
        allResponse = allResponse.concat([], [response])
      }
    }
  }

  const finalResponse = {
    timestamp: new Date(),
    reports: allResponse
  }

  if (isPushBack) {
    pushBack(finalResponse, token, branch)
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

const core = require('@actions/core')

const { getInputList } = require('./src/utils')
const { info } = require('./src/logger')
const { callPageSpeed } = require('./src/callPageSpeed')
const { pushBack } = require('./src/pushBack')

async function main() {
  info('🐯 "psi-github-action" starting to collect report...')
  info('')

  const urls = getInputList('urls')
  const devices = getInputList('devices') || 'mobile'
  const runs = core.getInput('runs') || 1
  const token = core.getInput('token')

  if (!token) {
    core.setFailed('"token" is required, please add your PSI API KEY')
  }

  let allResponse = []
  let stringComments = '';
  for (const url of urls) {
    stringComments += `## 👉 URL    : ${url}\n`
    for (const device of devices) {
      stringComments += `### 👉 Device : ${device}\n`
      for (let index = 0; index < runs; index++) {
        const response = await callPageSpeed(url.trim(), device.trim(), core.getInput('api_key').trim())
        allResponse = allResponse.concat([], [response])
        stringComments += `
 **Core Web Vitals**
 First Input Delay        : ${fid}
 Largest Contentful Paint : ${lcp}
 Cumulative Layout Shift  : ${cls}

 **Other Timings**
 First Contentful Paint   : ${fcp}
 First CPU Idle           : ${fci}
 Total Blocking Time      : ${tbt}
 Time to Interactive      : ${tti}
 Speed Index              : ${si}

 **Resources**
 Total Resources Count    : ${req}
 Total Resources Size     : ${size}
  `
      }
    }
  }

  const finalResponse = {
    timestamp: new Date(),
    reports: allResponse
  }

  const isPushBack = core.getInput('push_back')
  if (isPushBack) {
    const branch = core.getInput('branch')
    await pushBack(finalResponse, stringComments, token, branch)
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

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
    stringComments += `## Report for ${url}\n`
    for (const device of devices) {
      stringComments += `### ${device === 'mobile' ? '📱' : '💻'} Device : ${device}\n`
      for (let index = 0; index < runs; index++) {
        const response = await callPageSpeed(url.trim(), device.trim(), core.getInput('api_key').trim())
        allResponse = allResponse.concat([], [response])
        stringComments += `
 **⚡️ Performace Score**
 Performance: **${perf * 100}**

 **🚀 Core Web Vitals**
 First Input Delay        : **${response.fid}**
 Largest Contentful Paint : **${response.lcp}**
 Cumulative Layout Shift  : **${response.cls}**

 **⏱ Other Timings**
 First Contentful Paint   : **${response.fcp}**
 First CPU Idle           : **${response.fci}**
 Total Blocking Time      : **${response.tbt}**
 Time to Interactive      : **${response.tti}**
 Speed Index              : **${response.si}**

 **📦 Resources**
 Total Resources Count    : **${response.req}**
 Total Resources Size     : **${response.size}**
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

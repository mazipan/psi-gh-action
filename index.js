const core = require('@actions/core')

const { getInputList } = require('./src/utils')
const { info, success } = require('./src/logger')
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

  // collect as array, so we can use for of
  const arrRuns = []
  for (let index = 0; index < runs; index++) {
    arrRuns.push(index)
  }

  let allResponse = []
  let stringComments = '';
  for (const url of urls) {
    stringComments += `### Report for ${url}\n`
    for (const device of devices) {
      stringComments += `<details>`
      stringComments += `<summary><b>${device === 'mobile' ? '📱' : '💻'} Device : ${device}</b></summary>`
      for (const _runIdx of arrRuns) {
        const response = await callPageSpeed(url.trim(), device.trim(), core.getInput('api_key').trim())
        allResponse = allResponse.concat([], [response])
        stringComments += `<b>⚡️ Performace Score</b>
 <p>Performance              : <b>${response.perf * 100}</b></p>
 <b>🚀 Core Web Vitals</b>
 <p>First Input Delay        : <b>${response.fid}ms</b></p>
 <p>Largest Contentful Paint : <b>${response.lcp}ms</b></p>
 <p>Cumulative Layout Shift  : <b>${response.cls}</b></p>
 <b>⏱ Other Timings</b>
 <p>First Contentful Paint   : <b>${response.fcp}ms</b></p>
 <p>First CPU Idle           : <b>${response.fci}ms</b></p>
 <p>Total Blocking Time      : <b>${response.tbt}ms</b></p>
 <p>Time to Interactive      : <b>${response.tti}ms</b></p>
 <p>Speed Index              : <b>${response.si}ms</b></p>
 <b>📦 Resources</b>
 <p>Total Resources Count    : <b>${response.req}</b></p>
 <p>Total Resources Size     : <b>${response.size}</b></p>`
      }
      stringComments += `</details>`
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
    success(`✅ Completed in ${process.uptime()}s.`)
    process.exit()
  })

const core = require('@actions/core')

const { getInputList } = require('./utils')
const { callPageSpeed } = require('./callPageSpeed')
const { pushBack } = require('./pushBack')

async function main () {
  core.info('[92m🐯 "psi-github-action" starting to collect report...![39m')
  core.info('')

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
  let stringComments = ''
  for (const url of urls) {
    stringComments += `<h3>PSI Report for ${url}</h3>`
    for (const device of devices) {
      stringComments += '<details>'
      stringComments += `<summary><h4>${
        device === 'mobile' ? '📱' : '💻'
      } Device : ${device}</h4></summary>`
      // eslint-disable-next-line no-unused-vars
      for (const _runIdx of arrRuns) {
        const response = await callPageSpeed(
          url.trim(),
          device.trim(),
          core.getInput('api_key').trim()
        )
        allResponse = allResponse.concat([], [response])
        stringComments += `<p><b>⚡️ Performace Score</b></p>
 Performance              : <b>${response.perf * 100}</b></br>
 <p><b>🚀 Core Web Vitals</b></p>
 First Input Delay        : <b>${response.fid}ms</b></br>
 Largest Contentful Paint : <b>${response.lcp}ms</b></br>
 Cumulative Layout Shift  : <b>${response.cls}</b></br>
 <p><b>⏱ Other Timings</b></p>
 First Contentful Paint   : <b>${response.fcp}ms</b></br>
 First CPU Idle           : <b>${response.fci}ms</b></br>
 Total Blocking Time      : <b>${response.tbt}ms</b></br>
 Time to Interactive      : <b>${response.tti}ms</b></br>
 Speed Index              : <b>${response.si}ms</b></br>
 <p><b>📦 Resources</b></p>
 Total Resources Count    : <b>${response.req}</b></br>
 Total Resources Size     : <b>${response.size}</b></br>`
      }
      stringComments += '</details>'
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
    core.info(`✅ Completed in ${process.uptime()}s.`)
    process.exit()
  })

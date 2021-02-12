const fetch = require('node-fetch')
const get = require('lodash/get')
const { info, startGroup, endGroup } = require('./logger')

exports.callPageSpeed = async function callPageSpeed(url, device = 'mobile', apiKey) {
  info(`👉 URL    : ${url}`)
  info(`👉 Device : ${device}`)
  const URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=${device}&datetime${new Date().getTime()}`

  const resp = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  const result = await resp.json()
  const loadingExperience = get(result, 'loadingExperience', {})
  const lighthouseResult = get(result, 'lighthouseResult', {})

  const fieldData = get(loadingExperience, 'metrics', {})

  const categories = get(lighthouseResult, 'categories', {})
  const audits = get(lighthouseResult, 'audits', {})

  const fid = get(fieldData, 'FIRST_INPUT_DELAY_MS.percentile', 0)

  const fcp = get(audits, 'first-contentful-paint.numericValue', 0)
  const lcp = get(audits, 'largest-contentful-paint.numericValue', 0)
  const cls = get(audits, 'cumulative-layout-shift.numericValue', 0)
  const fci = get(audits, 'first-cpu-idle.numericValue', 0)
  const tbt = get(audits, 'total-blocking-time.numericValue', 0)
  const tti = get(audits, 'interactive.numericValue', 0)
  const si = get(audits, 'speed-index.numericValue', 0)

  const perf = get(categories, 'performance.score', 0)

  const totalResourcesArr = get(audits, 'resource-summary.details.items', [])
  const totalResources = totalResourcesArr.length > 0 ? totalResourcesArr[0] : {}

  const req = get(totalResources, 'requestCount', 0)
  const size = get(totalResources, 'size', 0) || get(totalResources, 'transferSize', 0) || 0

  const response = {
    url,
    device,

    perf,

    fid,
    lcp,
    cls,

    fcp,
    fci,
    tbt,
    tti,
    si,

    req,
    size
  }

  startGroup(`Performace Score`)
  info(`Performance: ${perf}`)
  endGroup()

  startGroup(`Core Web Vitals`)
  info(`First Input Delay        : ${fid}`)
  info(`Largest Contentful Paint : ${lcp}`)
  info(`Cumulative Layout Shift  : ${cls}`)
  endGroup()

  startGroup(`Other Timings`)
  info(`First Contentful Paint   : ${fcp}`)
  info(`First CPU Idle           : ${fci}`)
  info(`Total Blocking Time      : ${tbt}`)
  info(`Time to Interactive      : ${tti}`)
  info(`Speed Index              : ${si}`)
  endGroup()

  startGroup(`Resources`)
  info(`Total Resources Count    : ${req}`)
  info(`Total Resources Size     : ${size}`)
  endGroup()

  info('')
  return response
}

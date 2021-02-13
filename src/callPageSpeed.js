const fetch = require('node-fetch')
const get = require('lodash/get')
const { info, startGroup, endGroup } = require('./logger')
const { setPrecision } = require('./util')

exports.callPageSpeed = async function callPageSpeed(url, device = 'mobile', apiKey) {
  info(`👉 URL    : ${url}`)
  info(`👉 Device : ${device}`)
  const URLObject = new URL(url);

  const URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=${device}&datetime=${new Date().getTime()}`

  const resp = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // To duplicate all additional request from real browser
      Referer: url,
      Origin: URLObject.origin,
      Host: URLObject.host,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:86.0) Gecko/20100101 Firefox/86.0'
    }
  })

  const result = await resp.json()
  const loadingExperience = get(result, 'loadingExperience', {})
  const lighthouseResult = get(result, 'lighthouseResult', {})

  const fieldData = get(loadingExperience, 'metrics', {})

  const categories = get(lighthouseResult, 'categories', {})
  const audits = get(lighthouseResult, 'audits', {})

  const perf = get(categories, 'performance.score', 0)

  const fid = setPrecision(get(fieldData, 'FIRST_INPUT_DELAY_MS.percentile', 0), 2)
  const fcp = setPrecision(get(audits, 'first-contentful-paint.numericValue', 0), 2)
  const lcp = setPrecision(get(audits, 'largest-contentful-paint.numericValue', 0), 2)

  const cls = setPrecision(get(audits, 'cumulative-layout-shift.numericValue', 0), 5)
  const fci = setPrecision(get(audits, 'first-cpu-idle.numericValue', 0), 2)
  const tbt = setPrecision(get(audits, 'total-blocking-time.numericValue', 0), 2)
  const tti = setPrecision(get(audits, 'interactive.numericValue', 0), 2)
  const si = setPrecision(get(audits, 'speed-index.numericValue', 0), 2)

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

  startGroup(`⚡️ Performace Score`)
  info(`Performance: ${perf * 100}`)
  endGroup()

  startGroup(`🚀 Core Web Vitals`)
  info(`First Input Delay        : ${fid}ms`)
  info(`Largest Contentful Paint : ${lcp}ms`)
  info(`Cumulative Layout Shift  : ${cls}`)
  endGroup()

  startGroup(`⏱ Other Timings`)
  info(`First Contentful Paint   : ${fcp}ms`)
  info(`First CPU Idle           : ${fci}ms`)
  info(`Total Blocking Time      : ${tbt}ms`)
  info(`Time to Interactive      : ${tti}ms`)
  info(`Speed Index              : ${si}ms`)
  endGroup()

  startGroup(`📦 Resources`)
  info(`Total Resources Count    : ${req}`)
  info(`Total Resources Size     : ${size}`)
  endGroup()

  info('')
  return response
}

const fetch = require('node-fetch')
const core = require('@actions/core')
const get = require('lodash/get')

const { setPrecision } = require('./utils')

exports.callPageSpeed = async function callPageSpeed (url, device = 'mobile', apiKey) {
  core.info(`👉 URL    : ${url}`)
  core.info(`👉 Device : ${device}`)

  const API_URL = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=${device}&datetime=${new Date().getTime()}`

  const resp = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // To duplicate all additional request from real browser
      Referer: url,
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

  core.startGroup('⚡️ Performace Score')
  core.info(`Performance: ${perf * 100}`)
  core.endGroup()

  core.startGroup('🚀 Core Web Vitals')
  core.info(`First Input Delay        : ${fid}ms`)
  core.info(`Largest Contentful Paint : ${lcp}ms`)
  core.info(`Cumulative Layout Shift  : ${cls}`)
  core.endGroup()

  core.startGroup('⏱ Other Timings')
  core.info(`First Contentful Paint   : ${fcp}ms`)
  core.info(`First CPU Idle           : ${fci}ms`)
  core.info(`Total Blocking Time      : ${tbt}ms`)
  core.info(`Time to Interactive      : ${tti}ms`)
  core.info(`Speed Index              : ${si}ms`)
  core.endGroup()

  core.startGroup('📦 Resources')
  core.info(`Total Resources Count    : ${req}`)
  core.info(`Total Resources Size     : ${size}`)
  core.endGroup()

  core.info('')
  return response
}

const chromeLauncher = require('chrome-launcher')
const lighthouse = require('lighthouse')
const get = require('lodash/get')

exports.runLh = async function runLh(url, device) {
  const chrome = await chromeLauncher.launch({
    port: 9222,
    logLevel: 'silent',
    chromeFlags: ['--headless', '--disable-gpu']
  })

  const defaultOptions = {
    logLevel: 'error',
    output: 'json',
    formFactor: device,
    onlyCategories: ['performance'],
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'first-contentful-paint',
      'total-blocking-time',
      'speed-index',
      'first-cpu-idle',
      'interactive'
    ],
    port: chrome.port
  }

  const runnerResult = await lighthouse(url, defaultOptions)

  const lighthouseResult = runnerResult.lhr

  console.log('Report is done for', runnerResult.lhr.finalUrl)
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100)

  const categories = get(lighthouseResult, 'categories', {})
  const audits = get(lighthouseResult, 'audits', {})

  const fcp = get(audits, 'first-contentful-paint.numericValue', 0)
  const lcp = get(audits, 'largest-contentful-paint.numericValue', 0)
  const cls = get(audits, 'cumulative-layout-shift.numericValue', 0)
  const fci = get(audits, 'first-cpu-idle.numericValue', 0)
  const tbt = get(audits, 'total-blocking-time.numericValue', 0)
  const tti = get(audits, 'interactive.numericValue', 0)
  const si = get(audits, 'speed-index.numericValue', 0)

  const perf = get(categories, 'performance.score', 0)

  await chrome.kill()

  const response = {
    perf,

    fcp,
    lcp,
    cls,
    fci,
    tbt,
    tti,
    si
  }

  return response
}

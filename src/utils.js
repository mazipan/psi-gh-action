const core = require('@actions/core')
const fs = require('fs')
const { CONSTANT } = require('./constants')
const { magenta, newline } = require('./logger')

/**
 * Wrapper for core.getInput for a list input.
 *
 * @param {string} arg
 */
function getInputList (arg, separator = '\n') {
  const input = core.getInput(arg)
  if (!input) return []
  return input
    .split(separator)
    .map((url) => url.trim())
    .filter(Boolean)
}

/**
 * set comma precision
 *
 * @param {number} value
 * @param {number} precision
 */
function setPrecision (value, precision = 2) {
  return parseFloat(value.toFixed(precision))
}

/**
 * Get available reports
 *
 */
function getAvailableReports () {
  if (fs.existsSync(CONSTANT.REPORT_DIR)) {
    const files = fs
      .readdirSync(CONSTANT.REPORT_DIR)
      .filter((file) => file !== 'LAST_UPDATED.txt' && file !== 'available-reports.json')
      .reverse()

    return files || []
  }

  return []
}

/**
 * Check is report already generated
 *
 */
async function isHaveTodayReport () {
  if (fs.existsSync(CONSTANT.REPORT_FILE)) {
    return true
  }
  return false
}

/**
 * Get the data from today report
 *
 */
async function getTodayReportData () {
  if (await isHaveTodayReport()) {
    const content = fs.readFileSync(CONSTANT.REPORT_FILE, { encoding: 'utf8' })
    return JSON.parse(content)
  }

  return null
}

function formatThousand (n, fixed = 0) {
  return n
    .toFixed(fixed)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
/**
 * Check is report already generated
 *
 */
function generateCommentString (response) {
  let stringComments = ''
  response.reports.forEach((report) => {
    stringComments += `<h2>${
      report.device === 'mobile' ? '📱  Mobile Device' : '💻  Desktop Device'
    }</h2>`
    stringComments += `<p>Page: <a href="${report.url}" target="_blank" rel="noopenner noreferer">${report.url}</a></p>
    <table>
     <thead>
      <tr>
        <th rowspan="2" colspan="2">Perf</th>
        <th colspan="3">Core Web Vitals</th>
        <th colspan="5">Timings</th>
        <th colspan="2">Resources</th>
      </tr>
      <tr>
        <th>FID</th>
        <th>LCP</th>
        <th>CLS</th>
        <th>FCP</th>
        <th>FCI</th>
        <th>TBT</th>
        <th>TTI</th>
        <th>SI</th>
        <th>Resources Count</th>
        <th>Resources Size</th>
      </tr>
     </thead>
     <tbody>
      <tr>
        <td>${(report.perf * 100) < 49 ? '🔴' : (report.perf * 100) < 89 ? '🟠' : '🟢'}</td>
        <td>${report.perf * 100}/100</td>
        <td>${formatThousand(report.fid)}ms</td>
        <td>${formatThousand(report.lcp)}ms</td>
        <td>${report.cls.toFixed(3)}</td>
        <td>${formatThousand(report.fcp)}ms</td>
        <td>${formatThousand(report.fci)}ms</td>
        <td>${formatThousand(report.tbt)}ms</td>
        <td>${formatThousand(report.tti)}ms</td>
        <td>${formatThousand(report.si)}ms</td>
        <td>${report.req}ms</td>
        <td>${formatThousand(report.size / 1000)}kB</td>
      </tr>
     </tbody>
    </table>
    `
  })

  return stringComments
}

/**
 * Check is report already generated
 *
 */
function logDataToConsole (response) {
  response.reports.forEach((report) => {
    magenta(`👉 URL    : ${report.url}`)
    magenta(`👉 Device : ${report.device}`)

    core.startGroup('⚡️ Performance Score')
    core.info(`Performance: ${report.perf * 100}/100`)
    core.endGroup()

    core.startGroup('🚀 Core Web Vitals')
    core.info(`First Input Delay        : ${formatThousand(report.fid)} ms`)
    core.info(`Largest Contentful Paint : ${formatThousand(report.lcp)} ms`)
    core.info(`Cumulative Layout Shift  : ${report.cls.toFixed(3)}`)
    core.endGroup()

    core.startGroup('⏱ Other Timings')
    core.info(`First Contentful Paint   : ${formatThousand(report.fcp)} ms`)
    core.info(`First CPU Idle           : ${formatThousand(report.fci)} ms`)
    core.info(`Total Blocking Time      : ${formatThousand(report.tbt)} ms`)
    core.info(`Time to Interactive      : ${formatThousand(report.tti)} ms`)
    core.info(`Speed Index              : ${formatThousand(report.si)} ms`)
    core.endGroup()

    core.startGroup('📦 Resources')
    core.info(`Total Resources Count    : ${report.req}`)
    core.info(`Total Resources Size     : ${formatThousand(report.size / 1000)} kB`)
    core.endGroup()

    newline()
  })
}

/**
 * Check is report have zero performance score
 *
 */
function isContainsZeroPerformance (response) {
  let isContainsZero = false
  for (let index = 0; index < response.reports.length; index++) {
    const report = response.reports[index]
    if (!isContainsZero && report.perf === 0) {
      isContainsZero = true
      break
    }
  }

  return isContainsZero
}

exports.getInputList = getInputList
exports.setPrecision = setPrecision
exports.getAvailableReports = getAvailableReports
exports.getTodayReportData = getTodayReportData
exports.isHaveTodayReport = isHaveTodayReport
exports.generateCommentString = generateCommentString
exports.logDataToConsole = logDataToConsole
exports.isContainsZeroPerformance = isContainsZeroPerformance

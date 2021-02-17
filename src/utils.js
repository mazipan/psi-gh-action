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
  return n.toFixed(fixed).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
/**
 * Check is report already generated
 *
 */
function generateCommentString (response) {
  let stringComments = ''
  response.reports.forEach((report) => {
    stringComments += `<h3>PSI Report for <a href="${report.url}" alt="${report.url}" target="_blank" rel="noopenner noreferer">${report.url}</a></h3>`
    stringComments += '<details>'
    stringComments += `<summary><b>${
      report.device === 'mobile' ? '📱  Mobile Device' : '💻  Desktop Device'
    }</b></summary>`
    stringComments += `</br></br><b>⚡️ Performance Score</b></br>
    Performance              : <b>${report.perf * 100}</b></br>
    </br><b>🚀 Core Web Vitals</b></br>
    First Input Delay        : <b>${formatThousand(report.fid)}ms</b></br>
    Largest Contentful Paint : <b>${formatThousand(report.lcp)}ms</b></br>
    Cumulative Layout Shift  : <b>${(report.cls).toFixed(3)}</b></br>
    </br><b>⏱ Other Timings</b></br>
    First Contentful Paint   : <b>${formatThousand(report.fcp)}ms</b></br>
    First CPU Idle           : <b>${formatThousand(report.fci)}ms</b></br>
    Total Blocking Time      : <b>${formatThousand(report.tbt)}ms</b></br>
    Time to Interactive      : <b>${formatThousand(report.tti)}ms</b></br>
    Speed Index              : <b>${formatThousand(report.si)}ms</b></br>
    </br><b>📦 Resources</b></br>
    Total Resources Count    : <b>${report.req}</b></br>
    Total Resources Size     : <b>${formatThousand(report.size / 1000)}kB</b></br></details>`
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
    core.info(`Performance: ${report.perf * 100}`)
    core.endGroup()

    core.startGroup('🚀 Core Web Vitals')
    core.info(`First Input Delay        : ${formatThousand(report.fid)}ms`)
    core.info(`Largest Contentful Paint : ${formatThousand(report.lcp)}ms`)
    core.info(`Cumulative Layout Shift  : ${(report.cls).toFixed(3)}`)
    core.endGroup()

    core.startGroup('⏱ Other Timings')
    core.info(`First Contentful Paint   : ${formatThousand(report.fcp)}ms`)
    core.info(`First CPU Idle           : ${formatThousand(report.fci)}ms`)
    core.info(`Total Blocking Time      : ${formatThousand(report.tbt)}ms`)
    core.info(`Time to Interactive      : ${formatThousand(report.tti)}ms`)
    core.info(`Speed Index              : ${formatThousand(report.si)}ms`)
    core.endGroup()

    core.startGroup('📦 Resources')
    core.info(`Total Resources Count    : ${report.req}`)
    core.info(`Total Resources Size     : ${formatThousand(report.size / 1000)}kB`)
    core.endGroup()

    newline()
  })
}

exports.getInputList = getInputList
exports.setPrecision = setPrecision
exports.getAvailableReports = getAvailableReports
exports.getTodayReportData = getTodayReportData
exports.isHaveTodayReport = isHaveTodayReport
exports.generateCommentString = generateCommentString
exports.logDataToConsole = logDataToConsole

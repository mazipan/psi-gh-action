const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')
const CONSTANT = require('./constants')

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
 * Format date to YYYY-MM-DD
 *
 * @param {Date} date
 */
function formatDate (date) {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
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
function isHaveTodayReport () {
  exec.exec('ls').then(() => {})
  core.info('==============================')
  exec.exec('ls psi-reports/').then(() => {})
  core.info(`File ${CONSTANT.REPORT_FILE}`)
  if (fs.existsSync(CONSTANT.REPORT_FILE)) {
    return true
  }
  return false
}

/**
 * Get the data from today report
 *
 */
function getTodayReportData () {
  if (isHaveTodayReport()) {
    const content = fs.readFileSync(CONSTANT.REPORT_FILE, { encoding: 'utf8' })
    return JSON.parse(content)
  }

  return null
}

/**
 * Check is report already generated
 *
 */
function generateCommentString (response) {
  let stringComments = ''
  response.reports.forEach(report => {
    stringComments += `<h3>PSI Report for ${report.url}</h3>`
    stringComments += '<details>'
    stringComments += `<summary><h4>${
      report.device === 'mobile' ? '📱' : '💻'
    } Device : ${report.device}</h4></summary>`
    stringComments += `<p><b>⚡️ Performace Score</b></p>
    Performance              : <b>${report.perf * 100}</b></br>
    <p><b>🚀 Core Web Vitals</b></p>
    First Input Delay        : <b>${report.fid}ms</b></br>
    Largest Contentful Paint : <b>${report.lcp}ms</b></br>
    Cumulative Layout Shift  : <b>${report.cls}</b></br>
    <p><b>⏱ Other Timings</b></p>
    First Contentful Paint   : <b>${report.fcp}ms</b></br>
    First CPU Idle           : <b>${report.fci}ms</b></br>
    Total Blocking Time      : <b>${report.tbt}ms</b></br>
    Time to Interactive      : <b>${report.tti}ms</b></br>
    Speed Index              : <b>${report.si}ms</b></br>
    <p><b>📦 Resources</b></p>
    Total Resources Count    : <b>${report.req}</b></br>
    Total Resources Size     : <b>${report.size}</b></br></details>`
  })

  return stringComments
}

exports.getInputList = getInputList
exports.formatDate = formatDate
exports.setPrecision = setPrecision
exports.getAvailableReports = getAvailableReports
exports.getTodayReportData = getTodayReportData
exports.isHaveTodayReport = isHaveTodayReport
exports.generateCommentString = generateCommentString

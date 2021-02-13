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

const TODAY_DATE = new Date()
const TODAY = formatDate(TODAY_DATE)
const TODAY_REPORT_FILE = `report-${TODAY}.json`
const REPORT_DIR = 'psi-reports'
const LAST_UPDATE_FILE = `${REPORT_DIR}/LAST_UPDATED.txt`
const REPORT_FILE = `${REPORT_DIR}/${TODAY_REPORT_FILE}`
const ALL_REPORT_FILE = `${REPORT_DIR}/available-reports.json`

exports.CONSTANT = {
  TODAY_DATE,
  TODAY,
  TODAY_REPORT_FILE,
  REPORT_DIR,
  LAST_UPDATE_FILE,
  REPORT_FILE,
  ALL_REPORT_FILE
}

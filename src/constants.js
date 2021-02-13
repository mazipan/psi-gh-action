const { formatDate } = require('./utils')

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

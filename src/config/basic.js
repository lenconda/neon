const APP_SEED_URL = process.env.APP_SEED_URL || 'http://www.example.com'
const APP_MAX_DEPTH = (process.env.APP_MAX_DEPTH &&
  parseInt(process.env.APP_MAX_DEPTH)) || 100
const APP_LOG_DIR = process.env.APP_LOG_DIR ||
  path.join(__dirname, '../logs/')

// app basic configuration
module.exports.APP_SEED_URL = APP_SEED_URL
module.exports.APP_MAX_DEPTH = APP_MAX_DEPTH
module.exports.APP_LOG_DIR = APP_LOG_DIR

module.exports = {
  APP_SEED_URL,
  APP_MAX_DEPTH,
  APP_LOG_DIR }

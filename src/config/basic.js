const ConfigParser = require('configparser')
const path = require('path')

const config = new ConfigParser()
config.read(path.join(__dirname, '../../config.ini'))

const APP_SEED_URL = process.env.APP_SEED_URL ||
  config.get('basic', 'seed_url') ||
  'http://www.example.com'
const APP_MAX_DEPTH = (process.env.APP_MAX_DEPTH &&
  parseInt(process.env.APP_MAX_DEPTH)) ||
  (config.get('basic', 'max_depth') &&
    config.get('basic', 'max_depth')) ||
  100
const APP_LOG_DIR = process.env.APP_LOG_DIR ||
  config.get('basic', 'log_dir') ||
  path.join(__dirname, '../logs/')

// app basic configuration
module.exports.APP_SEED_URL = APP_SEED_URL
module.exports.APP_MAX_DEPTH = APP_MAX_DEPTH
module.exports.APP_LOG_DIR = APP_LOG_DIR

module.exports = {
  APP_SEED_URL,
  APP_MAX_DEPTH,
  APP_LOG_DIR }

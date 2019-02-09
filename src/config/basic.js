const ConfigParser = require('configparser')
const path = require('path')

const config = new ConfigParser()
config.read(path.join(__dirname, '../../config.ini'))

const APP_LOG_DIR = process.env.LOG_DIR ||
  config.get('basic', 'log_dir') ||
  path.join(__dirname, '../logs/')

// app basic configuration
module.exports.APP_LOG_DIR = APP_LOG_DIR

module.exports = {
  APP_LOG_DIR }

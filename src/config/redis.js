const ConfigParser = require('configparser')
const path = require('path')

const config = new ConfigParser()
config.read(path.join(__dirname, '../../config.ini'))

const RDS_HOST = process.env.RDS_HOST ||
  config.get('redis', 'host') || 'localhost'
const RDS_PORT = process.env.RDS_PORT ||
  (config.get('redis', 'port') &&
    parseInt(config.get('redis', 'port'))) || 6379
const RDS_WAIT_QUEUE = process.env.RDS_WAIT_QUEUE ||
  config.get('redis', 'wait_queue') ||
  'neon_wait'
const RDS_RESULT_QUEUE = process.env.RDS_RESULT_QUEUE ||
  config.get('redis', 'result_queue') ||
  'neon_results'

module.exports.RDS_HOST = RDS_HOST
module.exports.RDS_PORT = RDS_PORT
module.exports.RDS_WAIT_QUEUE = RDS_WAIT_QUEUE
module.exports.RDS_RESULT_QUEUE = RDS_RESULT_QUEUE

module.exports = {
  RDS_HOST,
  RDS_PORT,
  RDS_WAIT_QUEUE,
  RDS_RESULT_QUEUE }

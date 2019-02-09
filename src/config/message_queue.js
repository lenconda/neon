const ConfigParser = require('configparser')
const path = require('path')

const config = new ConfigParser()
config.read(path.join(__dirname, '../../config.ini'))

const MQ_HOST = process.env.MQ_HOST ||
  config.get('rabbitmq', 'host') || '127.0.0.1'
const MQ_PORT = (process.env.MQ_PORT && parseInt(process.env.MQ_PORT)) ||
  (config.get('rabbitmq', 'host') &&
    parseInt(config.get('rabbitmq', 'host'))) || 5672
const MQ_LOGIN = process.env.MQ_LOGIN ||
  config.get('rabbitmq', 'login') || 'guest'
const MQ_PASSWORD = process.env.MQ_PASSWORD ||
  config.get('rabbitmq', 'password') || 'guest'
const MQ_TIMEOUT = (process.env.MQ_TIMEOUT && parseInt(process.env.MQ_TIMEOUT)) ||
  (config.get('rabbitmq', 'timeout') &&
    parseInt(config.get('rabbitmq', 'timeout'))) || 10000
const MQ_QUEUE = process.env.MQ_QUEUE ||
  config.get('rabbitmq', 'queue') || 'nitroproxy'

// RabbitMQ configurations
module.exports.MQ_HOST = MQ_HOST
module.exports.MQ_PORT = MQ_PORT
module.exports.MQ_LOGIN = MQ_LOGIN
module.exports.MQ_PASSWORD = MQ_PASSWORD
module.exports.MQ_TIMEOUT = MQ_TIMEOUT
module.exports.MQ_QUEUE = MQ_QUEUE

module.exports = {
  MQ_HOST,
  MQ_PORT,
  MQ_LOGIN,
  MQ_PASSWORD,
  MQ_TIMEOUT,
  MQ_QUEUE }

const MQ_HOST = process.env.MQ_HOST || 'rabbitmq'
const MQ_PORT = (process.env.MQ_PORT && parseInt(process.env.MQ_PORT)) ||
  5672
const MQ_LOGIN = process.env.MQ_LOGIN || 'guest'
const MQ_PASSWORD = process.env.MQ_PASSWORD || 'guest'
const MQ_TIMEOUT = (process.env.MQ_TIMEOUT &&
  parseInt(process.env.MQ_TIMEOUT)) || 10000
const MQ_QUEUE = process.env.MQ_QUEUE || 'neon'

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

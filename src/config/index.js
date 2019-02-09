const MESSAGE_QUEUE = require('./message_queue')
const BASIC = require('./basic')
const MONGO = require('./mongo')
const REDIS = require('./redis')

const configs = {
  ...MESSAGE_QUEUE,
  ...BASIC,
  ...MONGO,
  ...REDIS }

module.exports = configs

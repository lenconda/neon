const ua = require('modern-random-ua')

const MESSAGE_QUEUE = require('./message_queue')
const BASIC = require('./basic')
const MONGO = require('./mongo')

let HEADERS = {
  'Accept': 'text/html',
  'User-Agent': ua.generate()
}

const configs = {
  ...MESSAGE_QUEUE,
  ...BASIC,
  ...MONGO }

module.exports = configs
module.exports.HEADERS = HEADERS

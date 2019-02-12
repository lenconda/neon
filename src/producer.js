const amqp = require('amqp')
const {
  MQ_HOST,
  MQ_PORT,
  MQ_LOGIN,
  MQ_PASSWORD,
  MQ_TIMEOUT,
  MQ_QUEUE } = require('./config')
const getLogger = require('./utils/logger')
const events = require('events')
const emitter = new events.EventEmitter()

const _connection = Symbol('connection')
const logger = getLogger(__filename)

class Producer {

  /**
   * @constructor
   * @param {Array<any>} queue
   */
  constructor () {
    this[_connection] = amqp.createConnection({
      host: MQ_HOST,
      port: MQ_PORT,
      login: MQ_LOGIN,
      password: MQ_PASSWORD,
      connectionTimeout: MQ_TIMEOUT,
    }, {reconnect: false})
    this[_connection]
      .on('ready', () => {
        emitter.on('publish', message => {
          this[_connection].publish(MQ_QUEUE, message, { contentEncoding: 'utf-8' })
          logger.info(`published ${encodeURI(message)} to ${MQ_QUEUE} at ${MQ_HOST}:${MQ_PORT}`)
        })
      })
  }

  /**
   *
   * publish a message to message queue
   *
   * @param {string} message
   */
  publish (message) {
    emitter.emit('publish', message)
  }

  /**
   * destroy producer
   */
  destroy () {
    this[_connection].disconnect()
  }

}

module.exports = Producer

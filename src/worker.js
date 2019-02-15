const amqp = require('amqp')
const {
  MQ_HOST,
  MQ_PORT,
  MQ_LOGIN,
  MQ_PASSWORD,
  MQ_TIMEOUT,
  MQ_QUEUE } = require('./config')
const getLogger = require('./utils/logger')
const Crawler = require('./crawler')

const _connection = Symbol('connection')
const _consume = Symbol('consume')
const _crawler = Symbol('crawler')
const logger = getLogger(__filename)

class Worker {

  /**
   * @constructor
   */
  constructor () {
    this[_connection] = amqp.createConnection({
      host: MQ_HOST,
      port: MQ_PORT,
      login: MQ_LOGIN,
      password: MQ_PASSWORD,
      connectionTimeout: MQ_TIMEOUT,
    }, { reconnect: false })
    this[_crawler] = new Crawler()
  }

  /**
   *
   * fetch task from RabbitMQ
   *
   * @private
   */
  [_consume] () {
    this[_connection]
      .queue(MQ_QUEUE, queue => {
        queue.subscribe(message => {
          try {
            let url = encodeURI(encodeURI(unescape(message.data)))
            logger.info(`[PID: ${process.pid}] consume '${url}' from ${MQ_QUEUE} at ${MQ_HOST}:${MQ_PORT}`)
            this[_crawler].crawl(url)
          } catch (e) {
            logger.error(e.toString())
          }
        })
      })
  }

  /**
   *
   * start the consumer
   *
   * @private
   */
  start () {
    logger.info(`start worker with PID: ${process.pid}`)
    this[_connection].on('ready', () => {
      this[_consume]()
    })
  }

  /**
   *
   * stop the consumer
   *
   * @private
   */
  stop () {
    this[_connection].disconnect()
  }

}

module.exports = Worker

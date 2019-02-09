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
    })
    logger.info(`start worker at ${Date.parse(new Date())} with PID: ${process.pid}`)
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
            let url = unescape(message)
            logger.info(`[PID: ${this.pid}] consume '${url}' from ${MQ_QUEUE} at ${MQ_HOST}:${MQ_PORT}`)
            let crawler = new Crawler()
            crawler.crawl(url)
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

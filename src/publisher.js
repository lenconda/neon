const cheerio = require('cheerio')
const fs = require('fs')
const axios = require('axios')
const {
  HEADERS,
  APP_SEED_URL,
  APP_MAX_DEPTH,
  RDS_WAIT_QUEUE,
  RDS_RESULT_QUEUE } = require('./config')
const Producer = require('./producer')
const getLogger = require('./utils/logger')
const RedisQueue = require('./utils/redis_queue')
const timer = require('./utils/timer')
const URLParser = require('./utils/url_parser')

const logger = getLogger(__filename)
axios.defaults.timeout = 60000
axios.defaults.headers = HEADERS

const _wait_queue = Symbol('symbolQueue')
const _results_queue = Symbol('resultsQueue')
const _producer = Symbol('producer')
const _seed_url = Symbol('seedUrl')
const _max_depth = Symbol('maxDepth')
const _current_depth = Symbol('currentDepth')
const _bfs_traverse = Symbol('bfsTraverse')

class Publisher {

  /**
   * @constructor
   */
  constructor () {
    let wait_queue = fs.readFileSync('./.neon/app/wait.queue', { encoding: 'utf-8' })
    let results_queue = fs.readFileSync('./.neon/app/results.queue', { encoding: 'utf-8' })
    this[_wait_queue] = JSON.parse(wait_queue)
    this[_results_queue] = JSON.parse(results_queue)
    this[_producer] = new Producer()
    this[_seed_url] = APP_SEED_URL
    this[_max_depth] = APP_MAX_DEPTH
    this[_current_depth] = 1
    process.on('SIGINT', () => {
      fs.writeFileSync('./.neon/app/wait.queue',
        JSON.stringify(this[_wait_queue]), { encoding: 'utf-8' })
      fs.writeFileSync('./.neon/app/results.queue',
        JSON.stringify(this[_results_queue]), { encoding: 'utf-8' })
      process.exit(0)
    })
  }

  /**
   *
   * BFS traverse
   *
   * @async
   * @return {Promise<void>}
   */
  async [_bfs_traverse] () {
    while (this[_max_depth] === -1 ||
      (this[_current_depth] < this[_max_depth])) {
      try {
        await timer.delay(1000)
        // let { length } = await this[_wait_queue].content()
        for (let i = 0; i < this[_wait_queue].length; i++) {
          let currentUrl = this[_wait_queue].shift()
          logger.info(`start BFS from ${currentUrl}`)
          await timer.delay(1000)
          let { data } = await axios.get(currentUrl)
          let $ = cheerio.load(data)
          let links = $('a[href!=""]')
            .toArray()
            .map((value, index) => value.attribs['href'])
            .filter((value, index) => new URLParser(value).isLegalURL())
            .filter((value, index) => new URLParser(value).isInnerURL())
          for (let link of links) {
            let item = new URLParser(link)
            let prefixedUrl = decodeURI(decodeURI(item.prefixURL(currentUrl)))
            if (!this[_results_queue].includes(prefixedUrl) &&
              !this[_wait_queue].includes(prefixedUrl)) {
              this[_producer].publish(prefixedUrl)
              await timer.delay(1000)
              this[_results_queue].push(encodeURI(encodeURI(prefixedUrl)))
              this[_wait_queue].push(encodeURI(encodeURI(prefixedUrl)))
            }
          }
        }
        this[_current_depth] += 1
      } catch (e) {
        logger.error(e.toString())
        continue
      }
    }
  }

  /**
   *
   * start the publisher
   *
   * @async
   * @return {Promise<void>}
   */
  async start () {
    logger.info(`start publisher with PID: ${process.pid}`)
    await this[_bfs_traverse]()
    logger.info(`finish process`)
  }

}

module.exports = Publisher

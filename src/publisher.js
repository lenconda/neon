const cheerio = require('cheerio')
const axios = require('axios')
const { HEADERS,
  SEED_URL,
  MAX_DEPTH } = require('./config')
const getLogger = require('./utils/logger')
const RedisQueue = require('./utils/redis_queue')
const timer = require('./utils/timer')
const URLParser = require('./utils/url_parser')

const logger = getLogger(__filename)
axios.defaults.timeout = 60000
axios.defaults.headers = HEADERS

const _wait_queue = Symbol('symbolQueue')
const _results_queue = Symbol('resultsQueue')
const _seed_url = Symbol('seedUrl')
const _max_depth = Symbol('maxDepth')
const _current_depth = Symbol('currentDepth')
const _bfs_traverse = Symbol('bfsTraverse')

class Publisher {

  /**
   * @constructor
   */
  constructor () {
    this[_wait_queue] = new RedisQueue('nitro_wait')
    this[_results_queue] = new RedisQueue('nitro_results')
    this[_seed_url] = SEED_URL
    this[_max_depth] = MAX_DEPTH
    this[_current_depth] = 1
  }

  /**
   *
   * BFS traverse
   *
   * @return {Promise<void>}
   */
  async [_bfs_traverse] () {
    while (this[_current_depth] < this[_max_depth]) {
      try {
        for (let i = 0; i < this[_wait_queue].content().length; i++) {
          let currentUrl = await this[_wait_queue].dequeue()
          await timer.delay(1000)
          let { data } = await axios.get(currentUrl)
          let $ = cheerio.load(data)
          let links = $('a[href!=""]')
            .toArray()
            .map((value, index) => value.attribs['href'])
            .filter((value, index) => new URLParser(value).isLegalURL())
            .filter((value, index) => new URLParser(value).isInnerURL())
          for (let link in links) {
            let prefixedUrl = new URLParser(link).prefixURL()
            if (!(await this[_results_queue].hasElement())) {
              this[_results_queue].enqueue(prefixedUrl)
              this[_wait_queue].enqueue(prefixedUrl)
              logger.info(`get: ${prefixedUrl}`)
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
   * enqueue seed url
   *
   * @return {Promise<any>}
   */
  async init () {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info(`init publisher with PID: ${process.pid}`)
        await this[_wait_queue].enqueue(this[_seed_url])
        await timer.delay(1000)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   *
   * start the publisher
   *
   * @return {Promise<void>}
   */
  async start () {
    logger.info(`start publisher with PID: ${process.pid}`)
    await this[_bfs_traverse]()
    logger.info(`finish process`)
    process.exit(0)
  }

}

module.exports = Publisher

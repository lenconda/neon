const axios = require('axios')
const cheerio = require('cheerio')
const { HEADERS } = require('./config')
const getLogger = require('')
const uuid = require('uuid/v3')
const InsertItemDataModel = require('./database/models/insert_item')
const MongoDBConnection = require('./database/connection')

axios.defaults.timeout = 60000
const logger = getLogger(__filename)

const _connection = Symbol('connection')
const _insert_to_database = Symbol('insertToDatabase')

class Crawler {

  /**
   * @constructor
   */
  constructor () {
    this[_connection] = new MongoDBConnection()
    this[_connection].connect()
  }

  /**
   *
   * insert item into MongoDB
   *
   * @param {string} item
   * @private
   */
  [_insert_to_database] (item) {
    try {
      logger.info(`get ${item.filename} at ${item.url}`)
      InsertItemDataModel.insertMany([item])
    } catch (e) {
      logger.error(e.toString())
    }
  }

  /**
   *
   * request the url and find file links
   *
   * @async
   * @param {string} url
   * @return {Promise<void>}
   */
  async crawl (url) {
    try {
      let headers = HEADERS
      let { data } = await axios.get(url, { headers })
      let $ = cheerio.load(data)
      let content = $('body').text().replace(/\s+/g, '') || null
      let insertedItems = $('a[href!=""]')
        .toArray()
        .filter((value, index) =>
          /^.*?\.(pdf|docx|doc|rtf|mobi|azw3|epub)$/.test(value))
        .map((value, index) => {
          return {
            uuid: uuid(value, uuid.URL),
            url: value,
            filename: decodeURI(url).split('/').pop(),
            content,
            created_at: Date.parse(new Date())
          }
        })
      InsertItemDataModel
        .insertMany(insertedItems)
      this[_connection].disconnect()
    } catch (e) {
      logger.error(e.toString())
      this[_connection].disconnect()
    }
  }

}

module.exports = Crawler

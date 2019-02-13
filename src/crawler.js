const axios = require('axios')
const cheerio = require('cheerio')
const { HEADERS } = require('./config')
const getLogger = require('./utils/logger')
const uuid = require('uuid/v3')
const InsertItemDataModel = require('./database/models/insert_item')
const MongoDBConnection = require('./database/connection')

axios.defaults.timeout = 60000
axios.defaults.headers = HEADERS
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
   * @param {string} items
   * @private
   */
  [_insert_to_database] (items) {
    try {
      InsertItemDataModel.insertMany(items, (err, res) => {
        if (err) logger.error(err.toString())
        else logger.info(`inserted ${res.length} files`)
      })
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
      let { data } = await axios.get(url)
      let $ = cheerio.load(data)
      let content = $('body').text().replace(/\s+/g, '') || null
      let insertedItems = $('a[href!=""]')
        .toArray()
        .map((value, index) => value.attribs['href'])
        .filter((value, index) =>
          /^.*?\.(pdf|docx|doc|rtf|mobi|azw3|epub)$/.test(value))
        .map((value, index) => {
          return {
            uuid: uuid(value, uuid.URL),
            url: value,
            filename: decodeURI(value).split('/').pop(),
            content,
            created_at: Date.parse(new Date())
          }
        })
      if (insertedItems.length > 0) this[_insert_to_database](insertedItems)
    } catch (e) {
      logger.error(e.toString())
    }
  }

}

module.exports = Crawler

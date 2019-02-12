const mongoose = require('mongoose')
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME } = require('../config')
const getLogger = require('../utils/logger')

const logger = getLogger(__filename)

const _uri = Symbol('uri')
const _database = Symbol('database')

class MongoDBConnection {

  /**
   * @constructor
   */
  constructor () {
    let authorize = (DB_USER && DB_PASSWORD) ?
      `${DB_USER}:${DB_PASSWORD}@` : ''
    this[_uri] = `mongodb://${authorize}${DB_HOST}:${DB_PORT}/${DB_NAME}`
    this[_database]
  }

  /**
   * connect to MongoDB
   */
  connect () {
    this[_database] =
      mongoose
        .connect(this[_uri], { useNewUrlParser: true,
          useCreateIndex: true })
        .catch(err => logger.error(err.message))
  }

  /**
   * disconnect from MongoDB
   */
  disconnect () {
    mongoose.disconnect()
  }

}

module.exports = MongoDBConnection

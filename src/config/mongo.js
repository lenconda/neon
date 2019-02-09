const ConfigParser = require('configparser')
const path = require('path')

const config = new ConfigParser()
config.read(path.join(__dirname, '../../config.ini'))

const DB_HOST = process.env.DB_HOST ||
  config.get('database', 'host') || 'localhost'
const DB_PORT = (process.env.DB_PORT && parseInt(process.env.DB_PORT)) ||
  (config.get('database', 'port') &&
    parseInt(config.get('database', 'port'))) || 27017
const DB_USER = process.env.DB_USER ||
  config.get('database', 'user') || null
const DB_PASSWORD = process.env.DB_PASSWORD ||
  config.get('database', 'password') || null
const DB_NAME = process.env.DB_NAME ||
  config.get('database', 'name') || 'neon'

// MongoDB configurations
module.exports.DB_HOST = DB_HOST
module.exports.DB_PORT = DB_PORT
module.exports.DB_USER = DB_USER
module.exports.DB_PASSWORD = DB_PASSWORD
module.exports.DB_NAME = DB_NAME

module.exports = {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME }

const DB_HOST = process.env.DB_HOST || 'mongo'
const DB_PORT = (process.env.DB_PORT && parseInt(process.env.DB_PORT))
  || 27017
const DB_USER = process.env.DB_USER || null
const DB_PASSWORD = process.env.DB_PASSWORD || null
const DB_NAME = process.env.DB_NAME || 'neon'

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

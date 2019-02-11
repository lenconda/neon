const RDS_HOST = process.env.RDS_HOST || 'redis'
const RDS_PORT = (process.env.RDS_PORT &&
  parseInt(process.env.RDS_PORT)) || 6379
const RDS_WAIT_QUEUE = process.env.RDS_WAIT_QUEUE || 'neon_wait'
const RDS_RESULT_QUEUE = process.env.RDS_RESULT_QUEUE || 'neon_results'

module.exports.RDS_HOST = RDS_HOST
module.exports.RDS_PORT = RDS_PORT
module.exports.RDS_WAIT_QUEUE = RDS_WAIT_QUEUE
module.exports.RDS_RESULT_QUEUE = RDS_RESULT_QUEUE

module.exports = {
  RDS_HOST,
  RDS_PORT,
  RDS_WAIT_QUEUE,
  RDS_RESULT_QUEUE }

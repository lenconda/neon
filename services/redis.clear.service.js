const redis = require('redis')
const {
  RDS_HOST,
  RDS_PORT,
  RDS_WAIT_QUEUE,
  RDS_RESULT_QUEUE }  = require('../src/config')
const getLogger = require('../src/utils/logger')
const logger = getLogger(__filename)

const db = redis.createClient({
  host: RDS_HOST,
  port: RDS_PORT
})

const del = async name => {
  return new Promise(resolve => {
    db.del(name, () => {
      logger.info(`deleted ${name}`)
      resolve()
    })
  })
}

const clear = async () => {
  await del(RDS_WAIT_QUEUE)
  await del(RDS_RESULT_QUEUE)
  await del(`${RDS_WAIT_QUEUE}_set`)
  await del(`${RDS_RESULT_QUEUE}_set`)
  db.quit()
}

clear()

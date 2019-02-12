const RedisQueue = require('../src/utils/redis_queue')
const {
  APP_SEED_URL,
  RDS_WAIT_QUEUE } = require('../src/config')
const getLogger = require('../src/utils/logger')

const logger = getLogger(__filename)

/**
 *
 * init publisher
 *
 * @async
 * @return {Promise<void>}
 */
const init = async () => {
  let queue = new RedisQueue(RDS_WAIT_QUEUE)
  await queue.enqueue(APP_SEED_URL)
  logger.info(`init publisher queue with PID: ${process.pid}`)
  queue.quit()
}

init()

const fs = require('fs')
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
const init = () => {
  fs.writeFileSync('../.neon/app/wait.queue',
    JSON.stringify([APP_SEED_URL]))
  logger.info(`init publisher queue with PID: ${process.pid}`)
}

init()

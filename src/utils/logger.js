const loggers = require('log4js')
const { APP_LOG_DIR } = require('../../config')
const { getRelativePath } = require('./directories')

/**
 *
 * get logger
 *
 * @param {string} filePath
 * @return {Logger}
 */
module.exports = filePath => {

  loggers.configure({
    appenders: {
      ruleConsole: {
        type: 'console'
      },
      ruleFile: {
        type: 'dateFile',
        filename: `${APP_LOG_DIR}/neon`,
        pattern: 'yyyy-MM-dd.log',
        maxLogSize: 1000 * 1024 * 1024,
        numBackups: 3,
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: {
        appenders: ['ruleConsole', 'ruleFile'],
        level: 'info'
      }
    }
  })

  return loggers.getLogger(getRelativePath(filePath))

}

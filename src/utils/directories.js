const path = require('path')

/**
 *
 * get relative path
 *
 * @param {string} filePath
 * @return {string} relativePath
 */
module.exports.getRelativePath = filePath => {
  let basePath = path.resolve(__dirname, '../../')
  let relativePath = path.relative(basePath, filePath)
  return relativePath
}

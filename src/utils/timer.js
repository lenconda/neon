/**
 *
 * get delay with async
 *
 * @async
 * @param {number} ms
 * @return {Promise<*>}
 */
const delay = async ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, ms)
  })
}

module.exports.delay = delay

const redis = require('redis')
const { RDS_HOST, RDS_PORT }  = require('../config')

const _db = Symbol('db')
const _queue_name = Symbol('queueName')

class RedisQueue {

  /**
   * @constructor
   * @param {string} name
   */
  constructor (name) {
    this[_db] = redis.createClient({
      host: RDS_HOST,
      port: RDS_PORT
    })
    this[_queue_name] = name
  }

  /**
   *
   * return true if element not exists
   *
   * @async
   * @param {string} elem
   * @return {Promise<boolean>}
   */
  async hasElement (elem) {
    return new Promise((resolve, reject) => {
      this[_db].sadd(`${this[_queue_name]}_set`, elem, (err, res) => {
        if (err) reject(err.toString())
        if (res) resolve(true)
        else resolve(false)
      })
    })
  }

  /**
   *
   * enqueue function
   *
   * @async
   * @param {string} elem
   * @return {Promise<string>>}
   */
  async enqueue (elem) {
    return new Promise(async (resolve, reject) => {
      let exist = await this.hasElement(elem)
      if (exist) {
        this[_db].rpush(this[_queue_name], elem, (err, res) => {
          if (err) {
            reject(err)
            this.quit()
          } else {
            resolve(elem)
            this.quit()
          }
        })
      } else {
        resolve(elem)
        this.quit()
      }
    })
  }

  /**
   *
   * dequeue function
   *
   * @async
   * @return {Promise<string>}
   */
  async dequeue () {
    return new Promise((resolve, reject) => {
      this[_db].blpop(this[_queue_name], 0, (err, res) => {
        if (err) {
          reject(err)
          this.quit()
        } else {
          resolve(res)
          this.quit()
        }
      })
    })
  }

  /**
   *
   * get queue content
   *
   * @return {Promise<string[]>}
   */
  async content () {
    return new Promise((resolve, reject) => {
      this[_db].lrange(this[_queue_name], 0, -1, (err, res) => {
        if (err) {
          reject(err)
          this.quit()
        } else {
          resolve(res)
          this.quit()
        }
      })
    })
  }

  /**
   * disconnect from Redis server
   */
  quit () {
    this[_db].quit()
  }

}

module.exports = RedisQueue

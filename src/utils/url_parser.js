const { URL } = require('url')
const normalizeUrl = require('normalize-url')
const { APP_SEED_URL } = require('../config')

const _current_url = Symbol('currentUrl')

class URLParser {

  /**
   * @constructor
   * @param {string} url
   */
  constructor (url) {
    this[_current_url] = url
  }

  /**
   *
   * determine if the url is legal or not
   *
   * @return {boolean}
   */
  isLegalURL () {
    let url = this[_current_url]
    let strRegex = '^((https|http|ftp|rtsp|mms)?://)'
      + '?(([0-9a-z_!~*"().&=+$%-]+: )?[0-9a-z_!~*"().&=+$%-]+@)?'
      + '(([0-9]{1,3}\.){3}[0-9]{1,3}'
      + '|'
      + '([0-9a-z_!~*"()-]+\.)*'
      + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.'
      + '[a-z]{2,6})'
      + '(:[0-9]{1,4})?'
      + '((/?)|'
      + '(/[0-9a-z_!~*"().;?:@&=+$,%#-]+)+/?)$'
    let re = new RegExp(strRegex)
    return re.test(url)
  }

  /**
   *
   * determine if the url is an inner url
   *
   * @return {boolean}
   */
  isInnerURL () {
    let url = this[_current_url]
    let protocolTest = /^http:\/\/|^https:\/\//
    if (protocolTest.test(url)) {
      let seedUrlObj = new URL(normalizeUrl(APP_SEED_URL))
      let urlObj = new URL(normalizeUrl(url))
      if (seedUrlObj.origin === urlObj.origin) return true
      else return false
    } else {
      if (this.isLegalURL() || url[0] === '/') return true
      else return false
    }
  }

  /**
   *
   * return a prefixed url
   *
   * @param {string} parentUrl
   * @return {string}
   */
  prefixURL (parentUrl) {
    let url = this[_current_url]
    let seedUrlObj = new URL(normalizeUrl(APP_SEED_URL))
    let parentUrlObj = new URL(normalizeUrl(parentUrl))
    let protocolTest = /^http:\/\/|^https:\/\//
    if (protocolTest.test(url)) {
      return url
    } else {
      if (url[0] === '/') {
        return `${seedUrlObj.origin}${url}`
      } else {
        return `${seedUrlObj.origin}${parentUrlObj.pathname}/${url}`
      }
    }
  }

}

module.exports = URLParser

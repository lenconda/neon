const Crawler = require('./crawler')
const Worker = require('./worker')
const Producer = require('./producer')
const Publisher = require('./publisher')

const CrawlerInstance = new Crawler()
const WorkerInstance = new Worker()
const ProducerInstance = new Producer()
const PublisherInstance = new Publisher()

module.exports.CrawlerInstance = CrawlerInstance
module.exports.WorkerInstance = WorkerInstance
module.exports.ProducerInstance = ProducerInstance
module.exports.PublisherInstance = PublisherInstance

module.exports = {
  Crawler,
  Worker,
  Producer,
  Publisher
}

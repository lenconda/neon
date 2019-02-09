const mongoose = require('mongoose')

const insertItemData = new mongoose.Schema({
  uuid: { type: String, index: true, required: true },
  url: { type: String, required: true },
  filename: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: String, required: true }}, { timestamp: true })

const InsertItemDataModel =
  mongoose.model('datas', insertItemData)

module.exports = InsertItemDataModel

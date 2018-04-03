const router = require('koa-router')()

const mongoose = require('mongoose')
mongoose.connect('mongodb://readwrite:readwrite@localhost:27017/test')
const db = mongoose.connection

const Schema = mongoose.Schema
var ListSchema = new Schema({
  username: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})
var List = mongoose.model('list',ListSchema)

router.get('/list', async (ctx, next) => {
  var res = await List.find({})
  ctx.body = res
})

module.exports = router
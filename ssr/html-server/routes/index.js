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
var listSchema = mongoose.model('list',ListSchema)

router.get('/', async (ctx, next) => {
  var res = await listSchema.find({})
  await ctx.render('index', {
    list: res
  })
})



module.exports = router
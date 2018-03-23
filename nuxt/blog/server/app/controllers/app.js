const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
// const assert = require('assert')
const url = 'mongodb://localhost:27017/test';


exports.login = async (ctx,next)=>{
  var username = ctx.query.username
  var password = ctx.query.password
  if (!username||!password) {
    ctx.body = {
      code: 1,
      content: null,
      message: '参数缺失'
    }
    return next
  }
  var client = await MongoClient.connect(url)
  var collection = client.db('test').collection('user')

  var where = {
    username: username,
    password: password
  }
  var res = await collection.findOne(where)
  if (res) {
    ctx.body = {
      code: 0,
      content: res._id,
      message: '登录成功'
    }
  }else{
    ctx.body = {
      code: 1,
      content: null,
      message: '用户名或密码错误'
    }
  }
  client.close()
}
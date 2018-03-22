const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = 'mongodb://localhost:27017/test';

function MongoConnect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
      if (err) reject(err)
      resolve(client)
    })
  })
}

exports.add = async (ctx, next) => {
  var client = await MongoConnect()
  var db = client.db('test')
  db.collection('menu').insertOne({
    id: '1',
    name: 'HOME',
    pv: 0,
    uv: 0
  }, function (err, res) {
    assert.equal(err, null,'数据插入失败')
    client.close()
  });
  ctx.body = 'success'
}

exports.delete = async (ctx, next) => {
  ctx.body = 'this is a menu delete response'
}

exports.update = async (ctx, next) => {
  ctx.body = 'this is a menu update response'
}

exports.list = async (ctx, next) => {
  ctx.body = 'this is a menu list response'
}
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
// const assert = require('assert')
const url = 'mongodb://localhost:27017/test';


exports.add = async (ctx, next) => {
  var name = ctx.query.name
  if (!name) {
    ctx.body = {
      code: 1,
      content: null,
      message: '参数缺失'
    }
    return next
  }
  var client = await MongoClient.connect(url)
  var collection = client.db('test').collection('menu')

  var where = {
    name: name
  }
  var searchRes = await collection.findOne(where)
  if (searchRes) {
    ctx.body = {
      code: 2,
      content: null,
      message: '该名称已存在'
    }
    return next
  }
  var set = {
    name: name,
    pv: 0,
    uv: 0
  }
  var res = await collection.insertOne(set);
  if (res) {
    ctx.body = {
      code: 0,
      content: res.insertedId,
      message: '添加成功'
    }
  }
  client.close()
}

exports.delete = async (ctx, next) => {
  var id = ctx.query.id;
  if (!id) {
    ctx.body = {
      code: 1,
      content: null,
      message: '参数缺失'
    }
    return next
  }
  var client = await MongoClient.connect(url)
  var collection = client.db('test').collection('menu')

  var res = await collection.removeOne({
    _id: ObjectId(id)
  })
  if (res.result.n) {
    ctx.body = {
      code: 0,
      content: null,
      message: '删除成功'
    }
  } else if (res.result.n === 0) {
    ctx.body = {
      code: 2,
      content: null,
      message: 'id不存在'
    }
  } else {
    ctx.body = {
      code: 3,
      content: null,
      message: '系统异常'
    }
  }
  client.close()
}
exports.update = async (ctx, next) => {
  var id = ctx.query.id;
  var name = ctx.query.name;
  if (!id || !name) {
    ctx.body = {
      code: 1,
      content: null,
      message: '参数缺失'
    }
    return next
  }
  var client = await MongoClient.connect(url)
  var collection = client.db('test').collection('menu')

  var where = {
    _id: ObjectId(id)
  }
  var set = {
    $set: {
      name: name
    }
  }
  var res = await collection.updateOne(where, set)
  if (res.result.n) {
    ctx.body = {
      code: 0,
      content: null,
      message: '修改成功'
    }
  } else if (res.result.n === 0) {
    ctx.body = {
      code: 2,
      content: null,
      message: 'id不存在'
    }
  } else {
    ctx.body = {
      code: 3,
      content: null,
      message: '系统异常'
    }
  }
  client.close()
}

exports.list = async (ctx, next) => {
  var client = await MongoClient.connect(url)
  var collection = client.db('test').collection('menu')

  var res = await collection.find({}).toArray()
  if (res) {
    ctx.body = {
      code: 0,
      content: res,
      message: '获取成功'
    }
  } else {
    ctx.body = {
      code: 1,
      content: null,
      message: '系统异常'
    }
  }
  client.close()
}
var Mock = require('mockjs')

Mock.mock('/commnetList',{
  'code': 0,
  'content|1-10': [{
    id: /\d{1,10}/,
    user: Mock.Random.name(),
    content: Mock.Random.paragraph(1)
  }],
  'message': ''
})


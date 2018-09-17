const router = require('koa-router')()

const request = require('request')

function getBase64(image){
  return new Promise((resolve, reject) => {
    request({
      url:image,
      encoding: "base64",
    }, (err, res, base64) => {
      if (err) {
        reject(err)
        return 
      }
      resolve(base64)
    })
  })
}

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'tools',
    list: [{
      name: 'imageToBase64',
      path: '/imageToBase64'
    }]
  })
})

router.get('/imageToBase64', async (ctx, next) => {
  let req_query = ctx.request.query
  let src = req_query.src
  let origin = ctx.request.header.referer
  let isCros = src.indexOf(origin)===-1
  // ctx.set('Content-Type', 'image/png')
  if (src&&isCros) {
    let base64 = await getBase64(src)
    ctx.body = `data:image/png;base64,${base64}`
  } else {
    ctx.body = src
  }
})



// var http = require('http');
// var url = 'http://p0.meituan.net/tuanpic/3df525af5a3f7fe04077567d2a6caf794904.png'; //一张网络图片



// http.get(url, function (res) {　　
//   var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
//   　　
//   var size = 0;　　 //保存缓冲数据的总长度

//   　　
//   res.on('data', function (chunk) {　　　　
//     chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，

//     　　　　　　　　　　　　　　　　 //node会把接收到的数据片段逐段的保存在缓冲区（Buffer），

//     　　　　　　　　　　　　　　　　 //这些数据片段会形成一个个缓冲对象（即Buffer对象），

//     　　　　　　　　　　　　　　　　 //而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），

//     　　　　　　　　　　　　　　　　 //如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，

//     　　　　　　　　　　　　　　　　 //直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，

//     　　　　　　　　　　　　　　　　 //利用下面的node.js内置的Buffer.concat()方法进行拼接

//     　　　　　　　　　　　　　
//     size += chunk.length;　　 //累加缓冲数据的长度
//     　　
//   });

//   　　

//   　　
//   res.on('end', function (err) {

//     　　　　
//     var data = Buffer.concat(chunks, size);　　 //Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data

//     　　　　
//     // console.log(Buffer.isBuffer(data));　　　　 //可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象

//     　　　　

//     　　　　
//     var base64Img = data.toString('base64');　　 //将Buffer对象转换为字符串并以base64编码格式显示

//     　　　　
//     // console.log(base64Img);　　 //进入终端terminal,然后进入index.js所在的目录，

//     　　　　　　　　　　　　　　　　　　　 //在终端中输入node index.js

//     　　　　　　　　　　　　　　　　　　　 //打印出来的就是图片的base64编码格式，格式如下　　　　

//     　　
//   });

// });




module.exports = router
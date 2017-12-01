const express = require('express')
const fs = require('fs')
const path = require('path')
const http = require('http')
const app = express()

// app.use(express.static('./static'))
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
// 获取
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/list.json', function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
})
// 添加
app.get('/add', function (req, res) {
  if(!req.query.name){
    res.send({
      "code": 1,
      "message": '名称不能为空'
    });
    return;
  }
  // 读取已有列表
  fs.readFile(__dirname + '/list.json', function (err, data) {
    var list = JSON.parse(data.toString());
    // 判断是否已存在
    let isRepeat = false;
    list.forEach(item => {
      if (item.name === req.query.name) {
        isRepeat = true;
      }
    });
    if (isRepeat) {
      res.send({
        "code": 1,
        "message": `${req.query.name} 已存在！`
      });
      return false
    }
    // 不存在则 写入新列表
    list.push(req.query);
    fs.writeFile(__dirname + '/list.json', JSON.stringify(list), function (err) {
      if (err) {
        res.send({
          "code": 1,
          "message": "保存失败！"
        });
      } else {
        // 创建对应json文件
        fs.writeFile(__dirname + '/json/' + req.query.name + '.json', JSON.stringify({
          code: 0,
          message: null
        }), function (err) {
          res.send({
            "code": 0,
            "message": "保存成功！"
          });
        })
      }
    })
  })
})
// 上传
/* app.post('/upload', function (req, res) {
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = __dirname + '/json/'; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 20 * 1024 * 1024; //文件大小
  form.parse(req, function (err, fields, files) {
    if(path.extname(files[0].name) != '.json'){
      fs.unlink(files[0].path,function(err){
        if(err){console.log(err);return}
        // console.log('删除成功');
      })
      res.send({
        "code": 1,
        "message": "文件类型必须为json"
      });
      return
    }
    if (err) {
      console.log(err);
      res.send({
        "code": 1,
        "message": "保存失败！"
      });
      return
    }
    fs.rename(files[0].path, __dirname + '/json/' + files[0].name, function (err) {
      if (err) {
        console.log(err);
      } else {
        // 创建对应list的对象
        fs.readFile(__dirname + '/list.json', function (err, data) {
          var list = JSON.parse(data.toString());
          let isRepeat = false;
          list.forEach(item => {
            if (item.name === path.basename(files[0].name,'.json')) {
              isRepeat = true;
            }
          });
          if (isRepeat) {
            res.send({
              "code": 1,
              "message": `${path.basename(files[0].name,'.json')} 已存在！`
            });
            return false
          }
          list.push({name:path.basename(files[0].name,'.json'),des:""});
          fs.writeFile(__dirname + '/list.json', JSON.stringify(list), function (err) {
            
            res.send({
              "code": 0,
              "message": "上传成功！"
            });
          });
        });
      }
    });
  });
}) */
app.post('/upload', function (req, res) {
  // req 是 http.IncomingMessage 的实例，这是一个 Readable Stream
  // res 是 http.ServerResponse 的实例，这是一个 Writable Stream

  let body = '';
  // 接收数据为 utf8 字符串，
  // 如果没有设置字符编码，将接收到 Buffer 对象。
  req.setEncoding('utf8');

  // 如果监听了 'data' 事件，Readable streams 触发 'data' 事件 
  req.on('data', (chunk) => {
    body += chunk;
  });

  // end 事件表明整个 body 都接收完毕了 
  req.on('end', () => {
    // console.log(body);
    var filename = /filename="(\w*\.\w*)"/ig.exec(body);
    filename = filename[1];
    if (path.extname(filename) != '.json') {
      res.send({
        code: 1,
        message: '必须为json文件！'
      });
      return false;
    }
    // console.log(body);
    body = body.replace(/------[a-z0-9]*(--)?/gi, '');
    body = body.replace(/[a-z0-9":;\.-\s=\/]*/i, '');
    // console.log(body);
    fs.readdir(__dirname + '/json', function (err, files) {
      var isRepeat = false;
      files.forEach(file => {
        if (file == filename) {
          isRepeat = true;
        }
      });
      if (isRepeat) {
        res.send({
          code: 1,
          message: '存在同名文件！'
        });
      } else {
        fs.writeFile(__dirname + '/json/' + filename, body, function (err) {
          if (err) {
            res.send({
              code: 1,
              message: '上传失败'
            });
          } else {
            fs.readFile(__dirname + '/list.json', function (err, data) {
              var list = JSON.parse(data.toString());
              list.push({name:path.basename(filename,'.json'),des:""});
              fs.writeFile(__dirname + '/list.json', JSON.stringify(list), function (err) {
                res.send({
                  "code": 0,
                  "message": "上传成功！"
                });
              });
            });
          }
        });
      }
    });
  });
})
app.all('*', function (req, res) {
  res.send('404')
})
app.listen(8888)
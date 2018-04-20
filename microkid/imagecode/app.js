var express = require('express');
var app = express();
var svgCaptcha = require('svg-captcha');
var fs = require('fs')

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

app.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create({
    // 翻转颜色  
    inverse: false,
    // 字体大小  
    fontSize: 36,
    // 噪声线条数  
    noise: 2,
    // 宽度  
    width: 80,
    // 高度  
    height: 30,
  });
  fs.appendFile(__dirname + '/log.txt', new Date().toISOString() + '----' + getClientIp(req) + '----' + captcha.text.toLowerCase() + '\n', function () {})
  res.setHeader('Content-Type', 'image/svg+xml');
  res.write(String(captcha.data));
  res.end();
})
app.listen(3000);
console.log('listen on http://localhost:3000/captcha');
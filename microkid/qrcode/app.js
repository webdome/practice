var express = require('express');
var app = express();
var qr_image = require('qr-image');
var fs = require('fs')

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

app.get('/qrcode', function (req, res) {
  var url = req.query.url;
  fs.appendFile(__dirname + '/log.txt', new Date().toISOString() + '----' + getClientIp(req) + '----' + url + '\n', function () {})
  var temp_qrcode = qr_image.image(url);
  res.type('png');
  temp_qrcode.pipe(res);
})
app.listen(3000);
console.log('listen on http://localhost:3000/qrcode?url=123');
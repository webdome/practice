// 静态服务器
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('./mime.json');

http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname == '/') pathname += 'index.html';
  fs.readFile('./static' + pathname, function(err, data) {
    if (err) {
      fs.readFile('./static/404.html', function(err, data) {
        res.writeHead(404, { 'Content-type': "text/html" });
        res.end(data);
      });
    } else {
      var extname = path.extname(pathname);
      res.writeHead(200, { 'Content-type': mime[extname] });
      res.end(data);
    }
  });
}).listen(3000, '192.168.1.9');

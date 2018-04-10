var Koa = require('koa');
var app = new Koa()
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);
io.on('connection', function(){ 
  console.log('connection');
  socket.on('message', function(data) {
    console.log(data);
      //触发客户端事件c_hi
      socket.emit('message','hello too!')
  })
});
server.listen(3000);
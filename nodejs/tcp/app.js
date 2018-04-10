const net = require('net')

var server = net.createServer(scoket=>{
  scoket.on('data',function(data){
    
  })
  scoket.on('end',function(data){
    
  })
  scoket.write('hello')
})

server.listen(8124)
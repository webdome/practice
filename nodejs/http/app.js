const http = require('http')
http.createServer((req,res)=>{
  res.writeHead(200)
  res.end('hello')
}).listen(3001)
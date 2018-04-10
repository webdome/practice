const http = require('http')
var hello = ''

for (let i = 0; i < 1024*10; i++) {
  hello += 'a'
}

// hello = new Buffer(hello)

http.createServer((req,res)=>{
  res.writeHead(200)
  res.end(hello)
}).listen(8001)

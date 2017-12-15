const fs = require('fs')
var realPath = function (path) {
  return __dirname + path
}
var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
var asyncFileReader = async function (fileName) {
  var result = await readFile(fileName)
  console.log(result.toString());
}

asyncFileReader(realPath('/test.html'))
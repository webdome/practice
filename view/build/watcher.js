var chokidar = require('chokidar');
var path = require('path');

var build = require('./build.js');

var log = console.log.bind(console);

var watcher = chokidar.watch(path.resolve(__dirname, '../src/vue/*.vue'), {
  persistent: true,
  // fsevents: true
  // followSymlinks: false,
  // useFsEvents: false,
  // usePolling: false
})

watcher
  // .on('add', path => log(`${path}`))
  .on('change', (path) => {
    // log(path)
    log('------------------  building  ------------------')
    build(path)
  })
  // .on('unlink', path => log(`File ${path} has been removed`))
  // .on('addDir', path => log(`Directory ${path} has been added`))
  // .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  // .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('------------------  watch success  ------------------'))
// .on('raw', (event, path, details) => {
//     log('Raw event info:', event, path, details);
// });
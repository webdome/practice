require('./index.scss')
require('./b.js')
// import "babel-polyfill"
import('./c.js').then(function (page) {
    // 渲染页面
    console.log(page);
});

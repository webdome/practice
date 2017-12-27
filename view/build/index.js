const fs = require('fs')
const beautify = require('js-beautify');

var vue = fs.readFileSync(__dirname+'/app.vue').toString()

// console.log(vue);

var html = /<template>((?:.|\r\n)*?)<\/template>/gi.exec(vue)
var js =  /<script>((?:.|\r\n)*?)<\/script>/gi.exec(vue)
var css = /<style>((?:.|\r\n)*?)<\/style>/gi.exec(vue)

if(html) html = html[1]
if(js) js = js[1]
if(css) css = css[1]

/**
 * html
 */
// console.log(html)
// {{}} :
var html = html.split('{{').join('<%= ').split('}}').join(' %>')
var vBind = /<[a-z]+\s+.*(:[a-z]+="[0-9a-z$_]+")>/gi
html.replace(vBind,(match, content)=>{
    var rc = content.replace(':','').replace('"','\'<%= ').replace('"',' %>\'')
    html = html.replace(content,rc)
})

try {
    fs.mkdirSync(__dirname+'/dist')
} catch (error) {}

// 写入
fs.writeFileSync(__dirname+'/dist/app.html',html)
/**
 * js
 */
console.log(js);
// el
var el = 'el: "#app",'
// data
var data = js.slice(js.lastIndexOf('{'),js.indexOf('}')+1)

// 组装
var newjs = beautify.js_beautify(`new view({
    ${el}
    data:${data}
})`)
// 写入
fs.writeFileSync(__dirname+'/dist/app.js',newjs)





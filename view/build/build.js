const fs = require('fs')
const path = require('path')
const beautify = require('js-beautify')
const nanoid = require('nanoid')
const log = console.log.bind(console)


/**
 * {{}} : v-show v-if 
 * @param {*目标文件夹} target 
 */
function build(target) {
  const TARGET_PATH = path.resolve(target, '../')
  // log(TARGET_PATH);

  var vue = fs.readFileSync(TARGET_PATH + '/app.vue').toString()

  // log(vue);

  var html = /<template>((?:.|\r\n)*?)<\/template>/gi.exec(vue)
  var js = /<script>((?:.|\r\n)*?)<\/script>/gi.exec(vue)
  var css = /<style>((?:.|\r\n)*?)<\/style>/gi.exec(vue)

  if (html) html = html[1]
  if (js) js = js[1]
  if (css) css = css[1]

  /**
   * html
   */
  // log(html)
  // {{}}
  const mustache = /{{(.*)}}/gi
  html.replace(mustache, (match, $1) => {
    html = html.replace(match, `<%= ${$1} %>`)
  })
  // v-bind :
  const vBind = /(v-bind)?:([a-z0-9-]+=)['"]([0-9a-z$_]+)['"]/gi
  html.replace(vBind, (match, $1, $2, $3) => {
    html = html.replace(match, `${$2}"<%= ${$3} %>"`)
  })
  // v-show
  const vShow = /v-show=['"]([0-9a-z$_]+)['"]/gi
  html.replace(vShow, (match, $1) => {
    html = html.replace(match, `style="display:<%= ${$1} ? 'block' : 'none' %>;"`)
  })
  // v-if
  const vIf = /<[a-z]+\s.*(v-if=['"]([0-9a-z$_]+)['"])\s*.*\/?>(.*<\/[a-z]+>)?/gi
  html.replace(vIf, (match, $1, $2) => {
    html = html.replace(match, `<% if(${$2}){ %>${match.replace($1,'')}<% } %>`)
  })
  // v-on @
  const vOn = /((v-on:)|@)([a-z]+)=['"](.*)['"]/gi
  var eventList = [] // 存起来一会解析为events
  html.replace(vOn, (match, $1, $2, $3, $4) => {
    let elId = 'el' + nanoid(5)
    eventList.push({
      el: '#' + elId,
      event: $3,
      func: $4.trim()
    })
    html = html.replace(match, `id="${elId}"`)
  })


  var newhtml = beautify.html_beautify(html)

  /**
   * css
   */
  // log(css)
  var newcss = beautify.css_beautify(css)

  /**
   * js
   */
  log(js)
  // el
  var el = 'el: "#app"'
  // template
  var template = 'template: require("./app.html")'
  // data
  const sData = /data\(\)\s*{\n*\s*return\s*({\n*\s*[\s\S]*});?\n*\s*},\n*\s*/gi
  var data
  js.replace(sData, (match, $1) => {
    data = $1
  })
  
  // events
  var events = '{'
  eventList.forEach((value, index, array) => {
    events += `"${value.event} ${value.el}"($this,event){$this.${value.func}();},`
  })
  events += '}'
  // 组装
  var newjs = beautify.js_beautify(`
    require('./app.scss')
    new view({
      ${el},
      ${template},
      data:${data},
      events:${events}
    })`)

  /**
   * 创建文件夹 写入html scss js 文件
   */
  try {
    fs.mkdirSync(`${TARGET_PATH}/dist`)
    log(`生成${TARGET_PATH}/dist目录`)
  } catch (error) {}

  fs.writeFileSync(`${TARGET_PATH}/dist/app.html`, newhtml)
  fs.writeFileSync(`${TARGET_PATH}/dist/app.js`, newjs)
  fs.writeFileSync(`${TARGET_PATH}/dist/app.scss`, newcss)
  log(`${target} => build success`)
}


build(path.resolve(__dirname, '../src/vue/dist'))


module.exports = build
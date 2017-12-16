var $ = require('jquery');
// var _ = require('art-template/lib/template-web');
var _ = require('underscore')
// var ajax = require('./ajax');

function view(options) {
  if(!options){
    throw new TypeError('Failed to construct "view": 1 argument required, but only 0 present');
  }
  var _this = this;
  
  this.$options = options || {};
  this.$el = $(options.el);

  this.$isMounted = false;
  this.$created = options.created || function(){};
  this.$mounted = options.mounted || function(){};
  this.$updated = options.updated || function(){};

  // this.$get = ajax.get;
  // this.$post = ajax.post;

  this.$render = ()=> {
    var compiled = _.template(this.$options.template);
    var html = compiled(this.$options.data);
    // var html = _.render(this.$options.template, this.$options.data);
    this.$el.html(html);
  }

  this.$checkDate = ()=> {
    for (var key in this.$options.data) {
      this.$options.data[key] = this[key];
    }
  }

  this.$eventsInit = ()=> {
    for (var key in this.$options.events) {
      var fn = this.$options.events[key];
      var type = key.split(" ")[0];
      var elem = key.split(" ")[1];
      $(this.$el).on(type, elem, (function (fn) {
        return function (event) {
          fn.call(_this, event);
        }
      })(fn));
    }
  }

  this.$dataInit = ()=> {
    for (let key in this.$options.data) {
      this[key] = this.$options.data[key];
    }
  }

  this.$methodsInit = ()=> {
    for (let key in this.$options.methods) {
      if (this[key]) {
        throw new SyntaxError('Identifier ' + key + ' has already been declared');
      }
      this[key] = this.$options.methods[key];
    }
  }

  this.$DOMObserver = () => {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var mutationObserverSupport = !!MutationObserver;
    if (mutationObserverSupport) {
      // Firefox(14+)、Chrome(26+)、Opera(15+)、IE(11+)、Safari(6.1+)
      var observer = new MutationObserver((records) => {
        // console.log(records);
        // console.log('DOM is updated');
        this.$updated();
      });
      var app = document.querySelector('#app');
      var options = {
        'childList': true
        // 'arrtibutes': true,
        // 'characterData': true,
        // 'subtree': true
      };
      observer.observe(app, options);
    } else {
      setTimeout(() => {
        this.$updated();
      }, 0);
    }
  }


  this.$repaint = ()=> {
    this.$checkDate();
    this.$render();
    // DOM更新完成
    setTimeout(() => {
      this.$updated();
    }, 0);
  }

  // 开始创建
  this.$created();
  // 初始化数据 方法 事件
  this.$dataInit();
  this.$methodsInit();
  this.$eventsInit();
  // DOM装载
  this.$render();
  // DOM装载完成
  setTimeout(() => {
    this.$isMounted = true;
    this.$mounted();
  }, 0);
  
}
window.$ = $;
window.view = view;
module.exports = view
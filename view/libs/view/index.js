var $ = require('jquery');
// var _ = require('art-template/lib/template-web');
var _ = require('underscore')
// var ajax = require('./ajax');

function view(options) {
  if (!options) {
    throw new TypeError('Failed to construct "view": 1 argument required, but only 0 present');
  }

  var _this = this;

  this.$options = options || {};
  this.$el = $(options.el);

  // this.$isMounted = false;
  this.$created = options.created || function () {};
  this.$mounted = options.mounted || function () {};
  this.$updated = options.updated || function () {};

  // this.$get = ajax.get;
  // this.$post = ajax.post;

  // $.extend(this.$options.data, this.$options.listen)


  this.$render = () => {
    var compiled = _.template(this.$options.template);
    var html = compiled(this.$options.data);
    // var html = _.render(this.$options.template, this.$options.data);
    this.$el.html(html);
  }

  // 提取input绑定的值 实现v到M的绑定
  this.$extractInputEvent = () => {
    var template = this.$options.template;
    var inputEventMap = {};
    var target = template.match(/value=["']<%=[\s0-9a-z_$]*%>["']/gi);
    // console.log(target);

    $.each(target, function (i, value) {
      var data = /<%=(.*)%>/gi.exec(value)
      if (data) {
        var data = data[1].trim();
        inputEventMap[data] = data;
        template = template.replace(value, value + ' data-model="' + data + '"')
      }
    })
    this.$options.template = template;
    // 绑定输入
    for (let key in inputEventMap) {
      $(this.$el).on('input', `[data-model="${inputEventMap[key]}"]`, function (event) {
        _this[key] = this.value;
      })
    }
  }
  // 计算属性 目前只有首次计算 以及repaint时更新
  this.$extractComputed = () => {
    // console.log(this.$options.computed);
    for (let key in this.$options.computed) {
      // console.log(key);
      // console.log(this.$options.data[key]);
      if (this.$options.data[key]) {
        throw new SyntaxError('Identifier ' + key + ' has already been declared');
      } else {
        this.$options.data[key] = this.$options.computed[key].call(this);
        this[key] = this.$options.data[key];
      }
    }
  }

  this.$computed = ()=>{
    for (let key in this.$options.computed) {
      this.$options.data[key] = this.$options.computed[key].call(this);
      this[key] = this.$options.data[key];
    }
  }


  this.$checkDate = () => {
    for (let key in this.$options.data) {
      this.$options.data[key] = this[key];
    }
  }

  this.$eventsInit = () => {
    for (let key in this.$options.events) {
      let fn = this.$options.events[key];
      let type = key.split(" ")[0];
      let elem = key.split(" ")[1];
      $(this.$el).on(type, elem, (function (fn) {
        return function (event) {
          fn.call(_this, $(elem), event);
        }
      })(fn));
    }
  }

  this.$dataInit = () => {
    for (let key in this.$options.data) {
      this[key] = this.$options.data[key];
    }
  }

  this.$methodsInit = () => {
    for (let key in this.$options.methods) {
      if (this[key]) {
        throw new SyntaxError('Identifier ' + key + ' has already been declared');
      }
      this[key] = this.$options.methods[key];
    }
  }

  /* this.$DOMObserver = () => {
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
  } */


  this.$repaint = () => {
    this.$computed();
    this.$checkDate();
    this.$render();
    // DOM更新完成
    setTimeout(() => {
      this.$updated();
    }, 0);
  }

  // 开始创建 回调
  this.$created();
  // 初始化数据 方法 事件
  this.$dataInit();
  this.$methodsInit();
  this.$eventsInit();
  this.$extractComputed();
  this.$extractInputEvent();
  // DOM装载
  this.$render();
  // DOM装载完成
  setTimeout(() => {
    // this.$isMounted = true;
    this.$mounted();
  }, 0);

}
window.$ = $;
window.view = view;
module.exports = view
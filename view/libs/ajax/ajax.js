require('es6-promise').polyfill();
// http.js

// note：xhr的兼容写法
// function XHR() {
//   if (window.XMLHttpRequest) return new XMLHttpRequest();
//   if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
//   return 'Not support XMLHttpRequest!';
// }

// 判断是否为纯对象，比如这种格式 {'name': 'jason'} 是纯对象，函数、数组等则不是
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

// 查询字符串中每个参数的名称和值都必须使用 encodeURIComponent() 进行编码，然后才能放到 URL 的末尾；
// 所有名-值对儿都必须由和号 ( & ) 分隔
function addURLParam(url, name, value) {
  url += (url.indexOf('?') == -1 ? '?' : '&');
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
  return url;
}

/**
 * Converts an object to x-www-form-urlencoded serialization.
 * http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
 * @param  {Object} obj
 * @return {String}
 */
function serialize(obj) {
  var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

  for (name in obj) {
    value = obj[name];

    if (value instanceof Array) {
      for (i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += serialize(innerObj) + '&';
      }
    }
    else if (value instanceof Object) {
      for (subName in value) {
        subValue = value[subName];
        fullSubName = name + '[' + subName + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += serialize(innerObj) + '&';
      }
    }
    else if (value !== undefined && value !== null)
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  }

  return query.length ? query.substr(0, query.length - 1) : query;
}

function ajax(type, url, data, contentType) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    if (type.toUpperCase() === 'GET' && data) {
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          url = addURLParam(url, key, data[key]);
        }
      }
    }

    /** post传输，当传FormData类型的数据时，不需要设置Content-Type
     *  当数据格式为纯对象时
     *  默认设置'Content-Type'为'application/x-www-form-urlencoded'，对数据进行序列化
     *  如果'Content-Type'设置为'application/json'，数据直接传json字符串
     **/
    if (type.toUpperCase() === 'POST' && isPlainObject(data)) {
      if (!contentType || contentType === 'application/x-www-form-urlencoded') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        data = serialize(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        data = JSON.stringify(data);
      }
    }

    xhr.open(type, url, true);

    xhr.onload = function() {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        var res = JSON.parse(xhr.response);
        resolve(res);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      reject('链接超时！')
    };
    xhr.onerror = function() {
      reject('网络错误！');
    };
    xhr.onabort = function() {
      reject('请求取消！');
    };

    xhr.send(type.toUpperCase() === 'GET' ? null : data); // 如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的
  });
}

module.exports =  {
  get: function(url, data) {
    return ajax('GET', url, data);
  },
  post: function(url, data, contentType) {
    return ajax('POST', url, data, contentType);
  }
}
/*
  二版预览 网站内的预览功能分离实现了
 */
// var serviceUrl = 'http://106.3.37.173:8080/love/'; //服务器
// var serviceUrl = 'http://192.168.1.6:8080/love/'; // 春
// var serviceUrl = 'http://192.168.1.13:8080/love/'; //斌
// var imageUrl = 'http://106.3.37.173:81/image/';
// var mapUrl = 'http://106.3.37.173:81/map/';
var serviceUrl = 'http://www.easyinto.com/love/'; //服务器
var imageUrl = 'http://www.easyinto.cn/image/';
var mapUrl = 'http://www.easyinto.cn/map/';
var userUrl = 'http://www.easyinto.cn/userPh/';
var advertUrl = 'http://www.easyinto.cn/advert/';
var gift_id = /gift_id=(\d+)/g.exec(window.location.href);
var gn_id = /gn_id=(\d+)/g.exec(window.location.href);
var act_id;
var code = /code=(\w+)/g.exec(window.location.href);
var state = /state=(.+)/g.exec(window.location.href);
var fromId;
var toId;
var canbeopen = false;
var curLat;
var curLng;
var user_id;
var musicSrc;
// 微信公众号打开普通作品可评论
var wxUserMsg = window.sessionStorage.getItem('userMsg');
if (wxUserMsg) {
  user_id = JSON.parse(wxUserMsg).id;
}
var loop = true;
var isPhone;
var target;
// 在全局范围内创建主动画控制器与子动画控制器
var myAC_main1 = new animateControl("main1_ani_");
// replace 查看的swiper
var photoSwiper;
// // 摇一摇集合
var shakeObj = {};
var frontCover, giftName, giftDes, giftCover, flipMode, flipDirection, giftMsg;
var aniObj = [];
var aniTimer;
// 页面除第一页所有图片集合即需要延迟加载的所有图片
var delayImages = [];
// 获取设备信息
// 判断PC端还是移动端
if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
  isPhone = 1;
  target = $('#giftPreview_phone');
  $('#giftPreview_phone').show();
  // 移动端 放大音乐按钮
  $('#audio span').addClass("phone");
  $('.operating').addClass("phone");
  // 设置meta:vp
  setScale();
} else {
  isPhone = 0;
  target = $('#giftPreview');
  $('.ysch').hide();
  $('.bjsc').show();
  // 生成作品预览二维码
  $('#qrcode').qrcode({
    size: 200,
    ecLevel: "H",
    background: "#ffffff",
    mode: 4,
    mPosX: 0.5,
    mPosY: 0.5,
    mSize: 0.3,
    image: $('#qrimage')[0],
    text: window.location.href
  });
}
/*开始加载loading*/
(function() {
  var loading_container = '<div id="loading_container" style="position:absolute;top:0;left:0;z-index:1000;width:100%;height:100%;padding:0;margin:0;text-align:center;background-color:#ffffff;"><div id="loading_circle_pos">';
  loading_container += '<div id="loading_circle">';
  loading_container += '<span id="outer"><span id="inner"></span></span>';
  loading_container += 'Loading';
  loading_container += '<div id="loading_slow">网速有点慢，请继续等待或 <a href="#" id="loading_refresh">重载</a> 网页</div>';
  loading_container += '</div>';
  loading_container += '</div></div>';
  $(target).prepend(loading_container);
  setTimeout(function() {
    $("#loading_slow").fadeIn(500);
  }, 20000);
  $("#loading_refresh").click(function() {
    location.reload();
    return !1;
  });
})()
// 获取 gift_id gn_id code state 根据有无执行不同情况 普通 买单 推广  
if (gift_id) { // 普通作品
  gift_id = gift_id[1];
  getData({
    "gid": gift_id
  }, 'giftsService.do', 'getGiftDetailAdvert', 'gift_preview', isPhone);
  // 作品浏览计数  添加传播途径  QQ  Qzone  MicroMessenger Weibo  Windows  Macintosh
  if (navigator) {
    // alert(navigator.userAgent);
    var transmission;
    if (navigator.userAgent.match(/Mobile/ig)) {
      if (navigator.userAgent.match(/MicroMessenger/ig)) {
        transmission = 'mobile-MicroMessenger';
      } else if (navigator.userAgent.match(/Qzone/ig)) {
        transmission = 'mobile-Qzone';
      } else if (navigator.userAgent.match(/QQ/ig)) {
        transmission = 'mobile-QQ';
      } else if (navigator.userAgent.match(/Weibo/ig)) {
        transmission = 'mobile-Weibo';
      }
    } else {
      if (navigator.userAgent.match(/Windows/ig)) {
        transmission = 'PC-Windows';
      } else if (navigator.userAgent.match(/Macintosh/ig)) {
        transmission = 'PC-Macintosh';
      }
    }
    getData({
      "gId": gift_id,
      "transmission": transmission
    }, 'statisticalService.do', 'SaveUseTotalCount', 'one_draft_count');
  }
} else if (gn_id) { // 买单活动
  gn_id = gn_id[1];
  loop = false;
  getData({
    "gnId": gn_id
  }, 'giftsService.do', 'getGiftDetailAdvert', 'gift_preview', isPhone);
} else if (code && state) { // 买单活动分享出来的/推广活动
  var code = code[1]; // code分为两种情况 微信code和app标记
  var state = state[1]; // 编码后的对象形式 需要decode再eval转对象 可能是gnId或actId
  state = decodeURIComponent(state);
  state = eval("a=" + state);
  loop = false;
  if (state.gnId) { // 买单活动
    gn_id = state.gnId;
    var mycode = window.location.search;
    if (mycode) {
      mycode = mycode.split("&")[0].split("=")[1];
    }
    getData({
      'code': mycode
    }, 'userService.do', 'wxPublicLogin', 'wxPublicLoginPay');
  } else if (state.actId) { // 推广活动
    act_id = state.actId;
    fromId = state.fromId ? state.fromId : "";
    if (code == "app") { // app端
      getData({
        "actId": act_id,
        "fromId": fromId
      }, 'giftsService.do', 'getGiftDetailAdvert', 'gift_preview', isPhone);
    } else { // 微信端 需要从微信登录获取拆的人的userid 从地址栏获取分享人userid
      var mycode = window.location.search;
      if (mycode) {
        mycode = mycode.split("&")[0].split("=")[1];
      }
      getData({
        'code': mycode
      }, 'userService.do', 'wxPublicLogin', 'wxPublicLoginAct');
    }
  }

}

// 设置meta:vp
function setScale() {
  // console.log(window.top !== window);
  if (window.top !== window) {
    return;
  }
  var pageScale = 1;
  var width = document.documentElement.clientWidth || 640;
  var height = document.documentElement.clientHeight || 1008;
  if (width / height >= 640 / 1008) {
    pageScale = height / 1008;
  } else {
    pageScale = width / 640;
  }
  var content = 'width=device-width, initial-scale=' + pageScale + ', maximum-scale=' + pageScale + ',minimum-scale=' + pageScale + ', user-scalable=no';
  document.getElementById('viewport').setAttribute('content', content);
  // alert(content);
}

// webview 调取播放   app只调用一次页可能不调用(资源已准备)
function mediaPlay(canplay) {
  if (canplay || canplay == 1) {
    $('#audio span').css('animation', 'rota 10s linear infinite');
    $('#audio audio').attr('data-cur', '1');
  } else {
    $('#audio span').css('animation', 'none');
    $('#audio audio').attr('data-cur', '0');
  }
}
// ios 页面跳转时暂停/播放音乐
function musicPlay(canplay) {
  if (canplay || canplay == 1) {
    $('#audio span').css('animation', 'rota 10s linear infinite');
    $('#audio audio')[0].play();
  } else {
    $('#audio span').css('animation', 'none');
    $('#audio audio')[0].pause();
  }
}
// app调取播放暂停
function requestMediaPlay() {
  window.rudianMediaControl.onMediaPlay();
  $('#audio span').css('animation', 'rota 10s linear infinite');
  $('#audio audio').attr('data-cur', '1');
}

function requestMediaPause() {
  window.rudianMediaControl.onMediaPause();
  $('#audio span').css('animation', 'none');
  $('#audio audio').attr('data-cur', '0');
}

// app分享获取信息
function requestGiftMessage() {
  // if (giftName && giftDes && giftCover) {
  var parameter = {
    "title": giftName,
    "description": giftDes,
    "shareico": giftCover,
    "url": "http://www.easyinto.com/love/rudian/giftShow.html?gift_id=" + gift_id + "&fromId=",
  };
  parameter = JSON.stringify(parameter);
  window.ExtendShareObject.extendShareWithDic(parameter);
  // } else {
  // requestGiftMessage();
  // }
}

// 在文档结构加载完成之后，载入swiper幻灯片，并初始化所有的动画控制器
function callback() {
  if (act_id && !window.ExtendShareObject) {
    // 推广活动判断是否在范围内决定canbeopen
    judgePosition();
  }
  // 如果没有广告
  if ($('.swiper-container-add .swiper-wrapper').is(':empty')) {
    $('.swiper-container-add').css('height', '250px');
  }
  // 如果是左右翻页 将箭头置于右侧
  if (flipDirection == "horizontal") {
    $('.swiper-button-next').addClass('swiper-button-next-h');
  }
  // 如果存在摇一摇才加载摇动事件
  if ($('.swiper-slide .shake').length) {
    // 启动摇动事件
    var myShakeEvent = new Shake({
      threshold: 15
    });
    myShakeEvent.start();
    // 监听摇动事件
    window.addEventListener('shake', doshakeEvent, false);
    // 监听摇动事件的回调函数
    function doshakeEvent() {
      var ele = $('.swiper-slide-active .shake');
      if (ele.length) {
        var key = ele.attr('data-id');
        var src = mapUrl + shakeObj[key].src;
        var speed = shakeObj[key].speed;
        var size = shakeObj[key].size;
        ele.snowfall('clear');
        ele.snowfall({
          image: src,
          flakeCount: speed,
          minSize: 15, // 固定
          maxSize: size
        });
        setTimeout(function() {
          ele.snowfall('clear');
          ele.hide();
        }, 10000);
      }
    }
  }
  // 如果存在擦一擦声明一个回调函数
  if ($('.swiper-slide .wipe').length) {
    function completeFunction() {
      $('.' + $(this.canvas[0]).parent().attr('class')).fadeOut(200);
    }
  }
  // 进度条的变化回调
  function progressBar(swiper) {
    // 进度条变化
    var index = swiper.activeIndex - 1;
    $('.slide_progress>ul>li').css('background-color', '#fff');
    // 修正swiper loop="true"情况下前后添加的页
    if (index == $('.slide_progress>ul>li').length) {
      $('.slide_progress>ul>li:eq(0)').css('background-color', '#2eb3e8');
    } else if (index == -1) {
      $('.slide_progress>ul>li').css('background-color', '#2eb3e8');
    } else {
      $('.slide_progress>ul>li:lt(' + (index + 1) + ')').css('background-color', '#2eb3e8');
    }
  }
  // 控制图片加载完再生成擦一擦
  var erasercount = false;
  if (flipMode == "cover") {
    var mySwiper = new Swiper('.swiper-container-all', {
      direction: 'vertical',
      // grabCursor: true,
      loop: loop,
      nextButton: '.swiper-button-next',
      // paginationClickable: true,
      // mousewheelControl: true,
      watchSlidesProgress: true,
      onInit: function(swiper) {
        // 初始化动画 开始播放动画
        myAC_main1.init(swiperAnimateParam_main1, swiper);
        if (window.parent.location.href.match('giftShow') == null) {
          myAC_main1.play();
        }
        swiper.myactive = 0;
      },
      onSlideChangeStart: function(swiper) {
        // 进度条
        progressBar(swiper);
        // 清除摇一摇
        if ($('.swiper-slide .shake').length) {
          $('.swiper-slide .shake').snowfall('clear');
          $('.swiper-slide .shake').hide();
        }
      },
      onSlideChangeEnd: function(swiper) {
        // 播放动画
        myAC_main1.play();
        // 摇一摇初始10s
        if ($('.swiper-slide-active .shake').length) {
          $('.swiper-slide-active .shake').show();
          doshakeEvent();
        }
        // 录音
        if ($('.swiper-slide-prev .recording').length) {
          $('.swiper-slide-prev .recording').removeClass("cur").children("audio")[0].pause();
          $('.swiper-slide-prev .recording').children("audio")[0].currentTime = 0;
        }
        if ($('.swiper-slide-next .recording').length) {
          $('.swiper-slide-next .recording').removeClass("cur").children("audio")[0].pause();
          $('.swiper-slide-next .recording').children("audio")[0].currentTime = 0;
        }
        // 视频
        if ($('.swiper-slide-active video').length) {
          $('.swiper-slide-active video')[0].play();
        }
        if ($('.swiper-slide-prev video').length) {
          $('.swiper-slide-prev video')[0].pause();
        }
        if ($('.swiper-slide-next video').length) {
          $('.swiper-slide-next video')[0].pause();
        }
        // 启动擦一擦
        // console.log(erasercount);
        if ($('.swiper-slide-active .wipe').length && erasercount) {
          $('.swiper-slide-active .wipe').eraser({
            completeRatio: 0.6,
            completeFunction: completeFunction
          });
        }
      },
      onProgress: function(swiper) {
        for (var i = 0; i < swiper.slides.length; i++) {
          var slide = swiper.slides[i];
          var progress = slide.progress;
          var translate, boxShadow;
          translate = progress * swiper.height * 0.8;
          scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
          boxShadowOpacity = 0;
          slide.style.boxShadow = '0px 0px 10px rgba(0,0,0,' + boxShadowOpacity + ')';
          if (i == swiper.myactive) {
            es = slide.style;
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + (translate) + 'px,0) scale(' + scale + ')';
            es.zIndex = 0;
          } else {
            es = slide.style;
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';
            es.zIndex = 1;
          }
        }
      },
      onTransitionEnd: function(swiper, speed) {
        for (var i = 0; i < swiper.slides.length; i++) {
          //  es = swiper.slides[i].style;
          //  es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = '';
          //  swiper.slides[i].style.zIndex = Math.abs(swiper.slides[i].progress);
        }
        swiper.myactive = swiper.activeIndex;
      },
      onSetTransition: function(swiper, speed) {
        for (var i = 0; i < swiper.slides.length; i++) {
          //if (i == swiper.myactive) {
          es = swiper.slides[i].style;
          es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
          //}
        }
      }
    });
  } else {
    // swiper启动
    var mySwiper = new Swiper('.swiper-container-all', {
      effect: flipMode,
      direction: flipDirection,
      // grabCursor: true,
      loop: loop,
      // mousewheelControl : true,  // 鼠标滚轮控制
      // autoplay : 5000,  // 自动播放
      nextButton: '.swiper-button-next',
      onInit: function(swiper) {
        // 初始化动画 开始播放动画
        myAC_main1.init(swiperAnimateParam_main1, swiper);
        if (window.parent.location.href.match('giftShow') == null) {
          myAC_main1.play();
        }
      },
      onSlideChangeStart: function(swiper) {
        // 进度条
        progressBar(swiper);
        // 清除摇一摇
        if ($('.swiper-slide .shake').length) {
          $('.swiper-slide .shake').snowfall('clear');
          $('.swiper-slide .shake').hide();
        }
        var index = swiper.activeIndex;
        if (gift_id == 6683 && index != 1) { //第一页自动翻页是在第一页图片加载完成后
          // console.log(aniObj[index - 1]+1);
          clearTimeout(aniTimer);
          aniTimer = setTimeout(function() {
            mySwiper.slideNext();
          }, (aniObj[index - 1] + 1) * 1000);
        }
      },
      onSlideChangeEnd: function(swiper) {
        // 播放动画
        myAC_main1.play();
        // 摇一摇初始10s
        if ($('.swiper-slide-active .shake').length) {
          $('.swiper-slide-active .shake').show();
          doshakeEvent();
        }
        // 录音
        if ($('.swiper-slide-prev .recording').length) {
          $('.swiper-slide-prev .recording').removeClass("cur").children("audio")[0].pause();
          $('.swiper-slide-prev .recording').children("audio")[0].currentTime = 0;
        }
        if ($('.swiper-slide-next .recording').length) {
          $('.swiper-slide-next .recording').removeClass("cur").children("audio")[0].pause();
          $('.swiper-slide-next .recording').children("audio")[0].currentTime = 0;
        }
        // 视频
        if ($('.swiper-slide-active video').length) {
          $('.swiper-slide-active video')[0].play();
        }
        if ($('.swiper-slide-prev video').length) {
          $('.swiper-slide-prev video')[0].pause();
        }
        if ($('.swiper-slide-next video').length) {
          $('.swiper-slide-next video')[0].pause();
        }
        // 启动擦一擦
        // console.log(erasercount);
        if ($('.swiper-slide-active .wipe').length && erasercount) {
          $('.swiper-slide-active .wipe').eraser({
            completeRatio: 0.6,
            completeFunction: completeFunction
          });
        }
      }
    });
  }
  // 广告swiper
  /*var addswiper = new Swiper('.swiper-container-add', {
    pagination: '.swiper-pagination-add',
    paginationClickable: true,
    // spaceBetween: 50
    autoplay: 2000, // 自动播放
    autoplayDisableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay
    loop: true,
    onSlideChangeStart: function(swiper) {
      $('.addtitle').text($('.swiper-container-add .swiper-slide-active').attr('data-title'));
    },
  });*/
  // mySwiper.enableKeyboardControl();  // 键盘控制翻页
  // 所有图片加载完成 删除Loading效果 
  var imgNum = $('.swiper-slide-active img').length;
  var allProgress = imgNum;
  if (imgNum != 0) {
    $('.swiper-slide-active img').load(function() {
      $('.load_progress').stop().animate({
        "width": (allProgress - imgNum) * 10 + "%"
      });
      if (!--imgNum) {
        $('.load_progress').stop().animate({
          "width": "100%"
        }, function() {
          $('.load_progress').hide();
        });
        $("#loading_container").fadeOut(500, function() {
          $(this).remove();
          myAC_main1.play(); // 开启myAC_main1主动画控制器中动画的播放
        });
        // 图片加载完成再生产擦一擦
        if ($('.swiper-slide-active .wipe').length) {
          $('.swiper-slide-active .wipe').eraser({
            completeRatio: 0.6,
            completeFunction: completeFunction
          });
        }
        erasercount = true;
        if (gift_id == 6683) {
          aniTimer = setTimeout(function() {
            mySwiper.slideNext();
          }, (aniObj[0] + 1) * 1000);
        }
        // 第一页图片加载完成后再加载后续页面图片
        $.each($('.delayImage'), function(index, val) {
          $(val).attr('src', delayImages[index]);
        });
      }
    });
    // 防止图片加载失败 一直在loading页面
    $('.swiper-slide-active img').error(function() {
      if (!--imgNum) {
        $("#loading_container").fadeOut(500, function() {
          $(this).remove();
          myAC_main1.play(); // 开启myAC_main1主动画控制器中动画的播放
        });
        // 第一页图片加载完成后再加载后续页面图片
        $.each($('.delayImage'), function(index, val) {
          $(val).attr('src', delayImages[index]);
        });
      }
    });
  } else {
    $("#loading_container").fadeOut(500, function() {
      $(this).remove();
      myAC_main1.play(); // 开启myAC_main1主动画控制器中动画的播放
    });
  }
  // PC前后切换页面按钮
  if (isPhone == 0) {
    $('.anl').click(function() {
      mySwiper.slidePrev();
    });
    $('.anr').click(function() {
      mySwiper.slideNext();
    });
  }
  // 点击replace图片 渲染弹层
  $('.replace').on('click', function(e) {
    e.stopPropagation();
    var photos = $('.swiper-slide-active .replace');
    var boxis = target.find(".photoShow .swiper-wrapper");
    $.each(photos, function(key, value) {
      $('<div class="swiper-slide"><div class="picbox swiper-zoom-container"><img src="' + $(value).attr('src') + '"/></div></div>').appendTo(boxis);
    });
    $('.photoShow').fadeIn("200");
    if (isPhone == 0) {
      photoSwiper = new Swiper('.swiper-container-p', {
        loop: false,
        zoom: true,
        zoomMin: 1,
        zoomMax: 3,
      });
    } else {
      photoSwiper = new Swiper('.swiper-container-pp', {
        loop: false,
        zoom: true,
        zoomMin: 1,
        zoomMax: 3,
      });
    }
  });
  // 点击空白区域移除弹层
  $('.photoShow').on('click', '.picbox', function(e) {
    e.stopPropagation();
    photoSwiper.destroy();
    $('.photoShow').fadeOut('200', function() {
      $('.swiper-container-pp .swiper-wrapper').empty();
      $('.swiper-container-p .swiper-wrapper').empty();
    });
  });
  // 阻止 冒泡及默认下拉行为
  $(target).on('touchmove', function(e) {
    if ($('.photoShow').is(':visible')) {
      e.preventDefault();
    }
  });

  // 点击播放录音
  $('.recording').on('click', function(e) {
    e.stopPropagation();
    if ($(this).addClass('cur').children("audio")[0].paused) {
      $(this).addClass('cur').children("audio")[0].play();
    } else {
      $(this).removeClass('cur').children("audio")[0].pause();
    }
  });
  // 监听录音播放完成
  $('.recording audio').on('ended', function(e) {
    e.stopPropagation();
    $(this).parent().removeClass("cur");
  });
  /*表单元素点击处理*/
  // checkbox 点击
  $('.checkbox').on('click', function(e) {
    e.stopPropagation();
    var target = $('.' + $(this).attr('class').match(/checkbox\d{2}/g)[0]);
    if ($(this).attr('data-cur') == 'no') {
      target.children('div:eq(0)').css('background-position', '0 0');
      target.attr('data-cur', 'yes');
    } else {
      target.children('div:eq(0)').css('background-position', '0 -30px');
      target.attr('data-cur', 'no');
    }
  });
  // radio 点击 实现互斥
  $('.radio').on('click', function(e) {
    e.stopPropagation();
    var target = $('.' + $(this).attr('class').match(/radio\d{2}/g)[0]);
    var name = $(this).attr('title');
    if ($(this).attr('data-cur') == 'no') {
      $.each($('.' + $(this).attr('class').match(/radio/g)[0] + '[title="' + name + '"]'), function(index, el) {
        $(el).children('div:eq(0)').css('background-position', '0 0');
      });
      target.children('div:eq(0)').css('background-position', '0 -32px');
      target.attr('data-cur', 'yes');
    } else {
      target.children('div:eq(0)').css('background-position', '0 0');
      target.attr('data-cur', 'no');
    }
  });
  // select选择
  $('.select').on('change', function(e) {
    e.stopPropagation();
    var target = $('.' + $(this).attr('class').match(/select\d{2}/g)[0]);
    var i = $(this).children('option:selected').index();
    $.each(target, function(index, el) {
      $(el).children('option:eq(' + i + ')').attr('selected', 'selected');
    });
  });
  // text输入
  $('.text').on('blur', function(e) {
    e.stopPropagation();
    var target = $('.' + $(this).attr('class').match(/text\d{2}/g)[0]);
    var text = $(this).val();
    $.each(target, function(index, el) {
      $(el).val(text);
    });
  });
  // 表单提交  (存在循环 单选分组 的问题)
  $('.submit').on('click', function(e) {
    e.stopPropagation();
    // 提交作品中所有的表单信息(text checkbox radio select)
    var submitObj = {};
    /*var page = $(this).parents('.main');
    var inputs = page.find('input');*/
    // input (radio checkbox text)
    var radios = $('.main input[type="radio"]');
    $.each(radios, function(index, el) {
      if ($(el).parent().attr('data-cur') == 'yes') {
        submitObj['radio'] = $(el).next('span').text();
      }
    });
    var checkboxs = $('.main input[type="checkbox"]');
    $.each(checkboxs, function(index, el) {
      if (index > checkboxs.length / 2 - 1) { //解决复选重复问题
        return;
      }
      if ($(el).parent().attr('data-cur') == 'yes') {
        submitObj['checkbox'] = submitObj['checkbox'] + '、' + $(el).next('span').text();
      }
    });
    if (submitObj['checkbox']) {
      submitObj['checkbox'] = submitObj['checkbox'].replace('undefined、', ''); //除去 'undefined、'
    }
    var texts = $('.main input[type="text"]');
    $.each(texts, function(index, el) {
      if ($(el).parent().attr('data-cur') == 'yes') {
        submitObj[$(el).attr('data-placeholder')] = $(el).val();
      }
    });
    // select
    /*var inputs = page.find('select');*/
    var selects = $('.main select');
    $.each(selects, function(i, v) {
      submitObj['select'] = $(v).children('option:selected').val();
    });
    // console.log(submitObj);
    var canSubmit = true;
    var texts = $('.main input[type="text"]');
    $.each(texts, function(index, el) {
      if ($(el).val() == "") {
        canSubmit = false;
      }
    });
    if (canSubmit) {
      getData({
        "gid": gift_id,
        "content": JSON.stringify(submitObj)
      }, 'noticeService.do', 'giftForm', 'giftform');
    } else {
      alert("请先填写信息");
    }
  });
  /*互动元素点击处理*/
  $('.active').on('click', function() {
    var pageEleId = $(this).attr('data-id');
    if (new Date().toLocaleDateString() != window.localStorage.getItem(pageEleId) || window.localStorage.getItem(pageEleId) == null) {
      getData({
        'pageEleId': pageEleId,
      }, 'elementsService.do', 'clickCount', 'clickCount');
      window.localStorage.setItem(pageEleId, new Date().toLocaleDateString());
      $(this).find('span').text(parseInt($(this).find('span').text()) + 1);
    } else {
      alert("已达今日上限");
    }
  });
  // 计算经纬度距离
  function toRad(d) {
    return d * Math.PI / 180;
  }

  function getDisance(lat1, lng1, lat2, lng2) {
    // #lat为纬度, lng为经度, 一定不要弄错
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;
  }
  // console.log(getDisance(31.224981, 121.550975, 31.84225, 117.238285));
  // 计算是否在范围内
  function calPosition(curaddress, curpoint) {
    var point = $("#sactivity .scope").attr("data-point");
    var address = $("#sactivity .scope p:eq(0)").text();
    // console.log(address);
    if (point) { // 门店
      point = JSON.parse(point);
      var curdistance = getDisance(curpoint.lat, curpoint.lng, point.lat, point.lng);
      var distance = /(\d*)Km/ig.exec(address)[1] * 1000;
      if (/50000Km/ig.exec(address)) {
        $("#sactivity .scope p:eq(0)").text('活动范围：不限');
      }
      if (curdistance <= distance) {
        canbeopen = true;
      }
    } else { //区域
      console.log(curaddress);
      console.log(address);
      curaddress = curaddress.replace("省", "");
      curaddress = curaddress.replace("市", "");
      address = address.replace("省", "");
      address = address.replace("市", "");
      // alert(curaddress + "==" + address);
      if (curaddress.indexOf(address.replace("活动范围：", '')) != -1) {
        // alert(1);
        canbeopen = true;
      }
    }
  }
  // 定位具体位置
  function judgePosition() {
    var map = new BMap.Map("map");
    var geolocation = new BMap.Geolocation();
    var geoc = new BMap.Geocoder();
    geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        var pt = r.point;
        curLat = pt.lat;
        curLng = pt.lng;
        geoc.getLocation(pt, function(rs) {
          var addComp = rs.addressComponents;
          var address = addComp.province + " " + addComp.city + " " + addComp.district;
          // alert(address);
          // alert(JSON.stringify(pt));
          calPosition(address, pt);
          // 判断是否在活动返回内 给按钮加上标记
        });
      }
    }, {
        enableHighAccuracy: true
      });
  }
  /*帮他拆红包*/
  $('.help-open').on('click', function(e) {
    e.stopPropagation();
    if (isPhone == 0) {
      alert("请使用微信扫描二维码进行操作");
      return;
    }
    // 推广活动判断是否在活动范围内
    if ($(this).attr("data-type") == 702) {
      if (window.ExtendShareObject) { //app端交互传值分享
        var parameter = {
          "title": giftName,
          "description": giftDes,
          "url": "http://www.easyinto.com/love/userService.do?op=actHome&actId=" + act_id + "&fromId=",
          "shareico": giftCover,
          "type": "act"
        };
        parameter = JSON.stringify(parameter);
        window.ExtendShareObject.extendShareWithDic(parameter);
      } else {
        var status = $(this).children("span").attr("data-status");
        if (status == "isok") {
          // alert(canbeopen);
          if (canbeopen) { // 可以拆
            // alert("可以拆");
            // alert(fromId);
            if (fromId) { // 如果存在fromId和toId 即可拆
              getData({
                'actid': act_id,
                "toid": toId,
                "fromid": fromId,
                "lng": curLng,
                "lat": curLat
              }, 'capitalService.do', 'helpPushGift', 'helpPushGift');
            } else { // 如果不存在及为第一次扫码打开 需要分享
              $('#showtip .tipbox').addClass("isself");
              $('#showtip').show();
            }
          } else { //不可以 不在活动范围内
            $('#showtip .tipbox').addClass("isout");
            $('#showtip').show();
          }
        } else if (status == "isnot") {
          $('#showtip .tipbox').addClass("isclose");
          $('#showtip').show();
        } else if (status == "isdone") {
          $('#showtip .tipbox').addClass("isfinish");
          $('#showtip').show();
        } else if (status == "isover") {
          $('#showtip .tipbox').addClass("isover");
          $('#showtip').show();
        } else if (status == "ismy") {
          $('#showtip .tipbox').addClass("isself");
          $('#showtip').show();
        }
      }
    } else { // 买单活动
      // alert("买单活动");
      if (window.ExtendShareObject) { //app端交互传值分享
        var parameter = {
          "title": giftName,
          "description": giftDes,
          "url": "http://www.easyinto.com/love/userService.do?op=actHome&gnId=",
          "shareico": giftCover,
          "type": "act"
        };
        parameter = JSON.stringify(parameter);
        window.ExtendShareObject.extendShareWithDic(parameter);
      } else {
        if ($(this).hasClass("my")) { // 自己打开的作品 需要分享
          $('#showtip .tipbox').addClass("isself");
          $('#showtip').show();
          return;
        }
        getData({
          'gnid': gn_id,
          "uid": toId
        }, 'capitalService.do', 'helpOpenGift', 'helpOpenGift');
      }
    }

  });
  /*隐藏提示*/
  // 买单活动 推广活动 
  // 点击按钮显示引导层 点击引导层隐藏 点击提示层隐藏
  /*$('.tipbox .btn').on('click', function (e) {
    e.stopPropagation();
    $("#cover").slideDown();
  });
  $("#cover").on('click', function (e) {
    e.stopPropagation();
    $("#cover").hide();
  });*/
  $('#showtip .tipbox').on('click', function(e) {
    e.stopPropagation();
  });
  $('#showtip').on('click', function(e) {
    e.stopPropagation();
    $("#showtip").hide();
  });
  // 我要推广
  $('.main .addgo>div.push').on("click", function(e) {
    e.stopPropagation();
    $('.main .pushcover').fadeIn();
  });
  $('.main .pushcover>div').on("click", function(e) {
    e.stopPropagation();
  });
  $('.main .pushcover').on("click", function(e) {
    e.stopPropagation();
    $('.main .pushcover').fadeOut();
  });


  //alert禁止显示网址
window.alert = function(name){
  var iframe = document.createElement("IFRAME");
  iframe.style.display="none";
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(name);
  iframe.parentNode.removeChild(iframe);
};
  // 菜单
  $('.operating').on("click", function(e) {
    e.stopPropagation();
    $(this).toggleClass('cur').children('ul').stop().slideToggle();
  });
  // 操作区
  $('.operating li').on("click", function(e) {
    e.stopPropagation();
    if ($(this).index() == 0) {
      window.alert("点赞成功");
      console.log("点赞成功");
    } else if ($(this).index() == 1) {
      if (!user_id) {
        $('.comment .public').remove();
      }
      $('.comment .author i').css('background-image', 'url(' + giftMsg.photo + ')');
      $('.comment .author h2').text(giftMsg.username);
      $('.comment .author p').text(giftMsg.updatetime);
      $('.comment .giftMsg i').css('background-image', 'url(' + imageUrl + giftMsg.path + ')');
      $('.comment .giftMsg p').text(giftMsg.giftname);
      getData({
        "giftId": gift_id
      }, 'replyService.do', 'showReplyByGift', 'showReplyByGift');
      $('.comment').fadeIn();
    } else if ($(this).index() == 2) {
      $('.report').fadeIn();
    }
  });
  // 隐藏举报
  $('.report .cancel').on('click', function(e) {
    e.stopPropagation();
    $('.report').hide();
  });
  // 确认举报
  $('.report .confirm').on('click', function(e) {
    e.stopPropagation();
    if ($(this).parent().prev().val() != "") {
      // 举报接口
      alert("感谢您的反馈！");
    }
    $('.report').hide();
  });
  // 三方键盘问题
  var interval;
  $('.public input').on('focus', function(e) {
    interval = setInterval(function() {
      document.body.scrollTop = document.body.scrollHeight
    }, 100);
  });
  $('.public input').on('blur', function(e) {
    clearInterval(interval);
  });
  // 切换取消或发表
  $('.public input').on('keyup', function(e) {
    e.stopPropagation();
    // 回复
    if ($(this).attr('data-id')) {
      if ($(this).val().match($(this).attr('data-name')) && $(this).val().length > $(this).attr('data-name').length) {
        $('.public .cancel').addClass('add');
      } else {
        $('.public .cancel').removeClass('add');
      }
    } else {
      if ($(this).val() != "") {
        $('.public .cancel').addClass('add');
      } else {
        $('.public .cancel').removeClass('add');
      }
    }
  });
  // 删除@
  $('.public input').on('keydown', function(e) {
    if (e.keyCode == 8 && $(this).attr('data-name')) {
      if ($(this).val() == $(this).attr('data-name') || $(this).val() == $(this).attr('data-name').replace(' ', '')) {
        $(this).select();
        $(this).removeAttr('data-id').removeAttr('data-name').removeAttr('data-userid');
      }
    }
  });
  // 隐藏评论 发表评论
  $('.public .cancel').on('click', function(e) {
    e.stopPropagation();
    if ($(this).hasClass('add')) {
      // 存在data-id极为回复评论
      if ($(this).prev().attr('data-id')) {
        // 回复评论  包含@xxx 并且长度大于data-name
        if ($(this).prev().val().match($(this).prev().attr('data-name')) && $(this).prev().val().length > $(this).prev().attr('data-name').length) {
          getData({
            "giftId": giftMsg.gid,
            "userId": user_id,
            "content": $(this).prev().val().replace($(this).prev().attr("data-name"), ''),
            "replyId": $(this).prev().attr('data-id'),
            "rUserId": $(this).prev().attr('data-userid')
          }, 'replyService.do', 'addReply', 'addReply');
        }
      } else {
        // 新增评论  内容长度大于0
        if ($(this).prev().val() != "") {
          getData({
            "giftId": giftMsg.gid,
            "userId": user_id,
            "content": $(this).prev().val(),
            "replyId": 0,
            "rUserId": 0
          }, 'replyService.do', 'addReply', 'addReply');
        }
      }
    } else {
      $('.comment').hide();
    }
  });
  $('.commentlist>ul').on('click', 'li i', function(e) {
    e.stopPropagation();
    $('.public input').val('@' + $(this).attr("data-name") + ' ').attr("data-id", $(this).attr("data-id")).attr("data-userid", $(this).attr("data-userid")).attr("data-name", '@' + $(this).attr("data-name") + ' ');
    $('.comment .cancel').removeClass('add');
  });
  // 隐藏
  $('.comment').on('click', function(e) {
    e.stopPropagation();
    $('.comment').hide();
  });
  $('.public').on('click', function(e) {
    e.stopPropagation();
  });
  // 阻止外层下拉
  $('.comment').on('touchmove', function(e) {
    e.preventDefault();
  });
  // 允许列表下拉
  $('.commentlist').on('touchmove', function(e) {
    e.stopPropagation();
  });
  // 我要制作
  $('.addgo>div.goto').on('click', function(e) {
    e.stopPropagation();
    if (/android/gi.exec(navigator.userAgent)) {
      $('.tip_box .android').show();
    } else if (/iphone/gi.exec(navigator.userAgent)) {
      $('.tip_box .ios').show();
    }
    $('.tip_box').fadeIn();
  });
  $('.tip_box').on('click', function(e) {
    e.stopPropagation();
    $('.tip_box').hide();
  });
  $('.tip_box>div').on('click', function(e) {
    e.stopPropagation();
  });
}
// 渲染作品
function dataDeal(returnCode, returnMsg, category, isPhone) {
  switch (category) {
    // 获取单个作品 并且预览
    case "gift_preview":
      console.log(returnMsg);
      // alert(returnCode);
      if (returnCode == 000) {
        var obj01 = returnMsg.gift;
        // swiper翻页方式 翻页方向
        flipMode = obj01.flipmode;
        flipDirection = obj01.flipdirection;
        frontCover = imageUrl + obj01.path;
        giftName = obj01.giftname;
        giftDes = obj01.description;
        giftCover = imageUrl + obj01.path;
        giftMsg = obj01;
        $(".ciho,#gift_titile").text(obj01.giftname);
        $('title').text(obj01.giftname);
        $('.naich').text(obj01.description);
        var obj02 = returnMsg.giftPages;
        var obj03 = returnMsg.giftPageElements;
        if (obj01.status == 1) {
          $('#loading_circle #outer').css("background-image", 'url(' + userUrl + obj01.logopic + ')'); // loading 换为商家logo
        }
        // 创建 container wrapper  外层容器
        var container = $('<div class="swiper-container swiper-container-all"></div>');
        var wrapper = $('<div class="swiper-wrapper"></div>');
        // 创建 页面动画js代码
        var pageJs = "var swiperAnimateParam_main1 = {";
        // 循环遍历创建 slide page content 三层容器 以及 bg main 背景容器和内容容器
        for (var i = 0; i < obj02.length; i++) {
          var aniAllTime = 0;
          /*// 商家移除最后广告页
          if (obj01.status == 1) { 
            if (obj02[i].id == -1) {
              continue;
            }
          }*/
          $('<li></li>').appendTo($(target).find('.slide_progress>ul')); //进度条
          var slide = $('<div class="swiper-slide"></div>');
          var page = $('<div class="page"></div>');
          var content = $('<div class="content"></div>');
          var bg = $('<div class="bg"></div>');
          var main = $('<div class="main"></div>');
          var ani_count = 1;
          pageJs += "slide_" + (i + 1) + ":{";
          //  && !/rudian/gi.exec(navigator.userAgent)
          if (obj02[i].id == -1) {
            // var addtitle = $('<p class="addtitle">广告标题</p>');
            var addwrapper = $('<div class="swiper-wrapper"></div>');
            var addpag = $('<div class="swiper-pagination-add"></div>');
            var addcontainer = $('<div class="swiper-container swiper-container-add"></div>');
            var addlogo = $('<div class="addlogo"></div><div class="addewm"><img src="images/wxewm.png"/></div>');
            // var addlogo = $('<div class="addlogo"></div><div class="addewm">'+navigator.userAgent+'</div>');
            // alert(navigator.userAgent);
            var addbottom = $('<p class="addbottom">按住别松，快，没时间解释了！</p><div class="addgo"><div class="goto"></div><div class="push"></div></div><div class="pushcover"><div><div class="pic"></div><div class="contact"><a href="tel:0551-67888117">0551-67888117</a><a href="tel:17755138836">17755138836</a></div></div></div>');
            // var rightcover = $('<div class="rightcover"></div>');
            // var leftcover = $('<div class="leftcover"></div>');
            // <p class="title">定点推广</p><p>定点、定时、定量式推广</p><p>激励、纵横、裂变式发散</p><p class="title">互动游戏</p><p>趣味消费互动</p><p>贯通线上线下</p><p class="title">联系电话</p>
          }
          // 活动页
          if (obj02[i].id == -2) {
            if (obj02[i].acttype == "701") { // 买单活动
              fromId = obj02[i].userid;
              // console.log(fromId + "==" + toId);
              if (fromId == toId || !toId) {
                var tipTxt = '<div class="help-open my" data-type="' + obj02[i].acttype + '">分享好友来帮忙</div>';
              } else {
                var tipTxt = '<div class="help-open other" data-type="' + obj02[i].acttype + '">帮他拆红包</div>';
              }
              // <div class="txt1">帮助成功</div><div class="txt2">快来买单参与活动吧</div><div class="btn">确定</div>
              var activity = $('<div id="pactivity"><div id="cover"><div><p>请点击右上角...</p><p>分享给好友或朋友圈即可参与活动</p><span></span></div></div><div id="showtip"><div class="tipbox"></div></div><div class="header"></div><div class="body"><div class="logo" style="background-image:url(' + obj02[i].photo + ');"></div><p class="name">' + obj02[i].username + '</p><p class="shopname">来自：' + obj02[i].shopname + '</p><div class="adress clearfix"><i></i><p>' + obj02[i].address + '</p></div><div class="money clearfix"><div class="current"><p>红包总金额</p><p>' + obj02[i].sumprice + '元</p></div><div class="need"><p>需拆次数</p><p>' + obj02[i].allcount + '</p></div><div class="already"><p>已拆次数</p><p>' + obj02[i].curcount + '</p></div></div><div class="tear">' + tipTxt + '</div></div></div>');
            } else { // 推广活动
              if (obj02[i].scopetype == "local") { // 地区
                var point = "";
                var scope = obj02[i].scope;
              } else { // 范围
                var point = {
                  "lng": obj02[i].lng,
                  "lat": obj02[i].lat
                };
                var scope = obj02[i].shopname + " " + obj02[i].scope + "以内";
              }
              // alert(obj02[i].closing);
              if (obj02[i].closing == 0) { // 活动未关闭
                if (obj02[i].status == 0) { // 活动未启用
                  var tipTxt = '活动未启动<span data-status="isnot"></span>';
                } else { // 活动启用
                  if (obj02[i].balance == 0) {
                    var tipTxt = '活动已结束<span data-status="isdone"></span>';
                  } else {
                    if (fromId) {
                      var tipTxt = '帮他拆红包<span data-status="isok"></span>';
                    } else {
                      var tipTxt = '分享给好友<span data-status="ismy"></span>';
                    }
                  }
                }
              } else { // 活动已关闭
                var tipTxt = '活动已过期<span data-status="isover"></span>';
              }
              // alert(JSON.stringify(obj02[i]));
              if (obj02[i].photo) {
                var photo = obj02[i].photo;
              } else {
                var photo = userUrl + obj01.logopic;
              }
              if (obj02[i].username) {
                var username = obj02[i].username;
              } else {
                var username = obj02[i].shopname;
              }
              // <div class="txt1">帮助成功</div><div class="txt2">快来帮忙宣传赢红包吧</div><div class="btn">我也要参与</div>
              var activity = $('<div id="sactivity"><div id="cover"><div><p>请点击右上角...</p><p>分享给好友或朋友圈即可参与活动</p><span></span></div></div><div id="showtip"><div class="tipbox"></div></div><div class="header"><a href="http://mp.weixin.qq.com/s/pFYnpl_LUP67tIKreUXhPw" target="_blank">红包提现</a></div><div class="body"><div class="logo" style="background-image:url(' + photo + ');"></div><p class="name">' + username + '</p><div class="adress clearfix">来自：<p>' + obj02[i].address + " " + obj02[i].shopname + '</p></div><div class="scope clearfix" data-point=' + JSON.stringify(point) + '><p><i>活动范围：</i>' + scope + '</p></div><div class="money clearfix"><div class="all"><p>总金额</p><p>' + obj02[i].sumprice + '元</p></div><div class="one"><p>每份金额</p><p>' + obj02[i].pushrule + '元</p></div><div class="last"><p>当前余额</p><p>' + obj02[i].balance + '元</p></div></div><div class="tear"><div class="help-open" data-type="' + obj02[i].acttype + '">' + tipTxt + '</div><p>谁分享，谁收益。分享场景，让别人帮你拆红包！</p><p>关注“入点文化”微信公众号，点击“个人中心”选择“提现”</p></div></div></div>');
            }
          }
          if (obj02[i].background) {
            if (/\#\w{3}/.test(obj02[i].background)) {
              bg.css({
                "background-color": obj02[i].background,
                "opacity": obj02[i].opacity
              });
            } else {
              bg.css({
                'background-image': 'url("' + imageUrl + obj02[i].background + '")',
                "opacity": obj02[i].opacity
              });
            }
          } else {
            bg.css({
              "background-color": '#fff'
            });
          }
          for (var j = 0; j < obj03.length; j++) {
            var pageHtml = '';
            var elemAni_count = 1;
            if (obj02[i].id == obj03[j].giftpageid) {
              if (obj03[j].animate) {
                if (obj03[j].animate.length) {
                  var width = '100%';
                  var height = '100%';
                  var top = '';
                  var left = '';
                  var zindex = '';
                } else {
                  var width = obj03[j].width + 'px';
                  var height = obj03[j].height + 'px';
                  var top = obj03[j].top + 'px';
                  var left = obj03[j].left + 'px';
                  var zindex = obj03[j].zindex;
                }
              }
              // 文本渲染
              if (obj03[j].eletype == 296) {
                // console.log(obj03[j]);
                pageHtml += '<div style="width:' + width + ';top:' + top + ';left:' + left + ';z-index:' + zindex + ';overflow:hidden;transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><p style="width:100%;line-height:' + obj03[j].lineheight + 'px;font-size:' + obj03[j].fontsize + 'px;font-family:' + obj03[j].fontfamily + ';font-style:' + obj03[j].fontstyle + ';color:' + obj03[j].color + ';font-weight:' + obj03[j].fontweight + ';text-align:' + obj03[j].textalign + ';text-shadow:' + obj03[j].textshadow + ';text-decoration:' + obj03[j].textdecoration + ';padding:18px;box-sizing:border-box;word-break:break-word;opacity:' + obj03[j].opacity + ';">' + obj03[j].path + '</p></div>';
                // 图片
              } else if (obj03[j].eletype == 62) {
                // console.log(obj03[j]);
                var replace = obj03[j].replace;
                if (replace == 1) {
                  var classs = 'replace';
                } else {
                  var classs = '';
                }
                // 延迟加载除了第一页的后续所有图片 先存储起来 等第一页图片加载完成再赋值
                if (i != 0) {
                  delayImages.push(imageUrl + obj03[j].path);
                  var src = "";
                  var delayClass = "delayImage";
                } else {
                  var src = imageUrl + obj03[j].path;
                  var delayClass = "";
                }
                // ' + imageUrl + obj03[j].path + '
                pageHtml += '<img class="' + classs + ' img' + i + ' ' + delayClass + '" src="' + src + '" style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';z-index:' + zindex + ';opacity:' + obj03[j].opacity + ';box-shadow:' + obj03[j].boxshadow + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);border-radius:' + obj03[j].borderradius + 'px;"/>';
              } else if (obj03[j].eletype == 409) {
                // 贴图
                pageHtml += '<img class="img' + i + '" src="' + mapUrl + obj03[j].path + '" style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';z-index:' + zindex + ';opacity:' + obj03[j].opacity + ';box-shadow:' + obj03[j].boxshadow + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);border-radius:' + obj03[j].borderradius + 'px;"/>';
              } else if (obj03[j].eletype == 470) {
                // 图形
                pageHtml += obj03[j].graph.replace('<svg ', '<svg style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';opacity:' + obj03[j].opacity + ';border-radius:' + obj03[j].borderradius + 'px;box-shadow:' + obj03[j].boxshadow + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);z-index:' + zindex + ';"').replace('<path ', '<path style="fill:' + obj03[j].backgroundcolor + ';"');
              } else if (obj03[j].eletype == 520) {
                // 输入框
                if (obj03[j].path) {
                  if (!JSON.parse(obj03[j].path)[0]) {
                    var inputTxt = '请输入内容...';
                  } else {
                    var inputTxt = JSON.parse(obj03[j].path)[0];
                  }
                } else {
                  continue;
                }
                pageHtml += '<div style="width:' + width + ';height:' + height + ';z-index:' + zindex + ';top:' + top + ';left:' + left + ';border-radius:' + obj03[j].borderradius + 'px;transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><input data-placeholder="' + inputTxt + '" type="text" maxlength="20" style="width:100%;height:100%;margin:0;padding:0;display:block;background-color:transparent;resize:none;box-shadow:' + obj03[j].boxshadow + ';color:' + obj03[j].color + ';position: relative;z-index: 170;font-size:28px;border-radius:' + obj03[j].borderradius + 'px;outline:none;padding-left:20px;box-sizing:border-box;border:none" placeholder="' + inputTxt + '" class="text text' + i + j + '"><div style="border:' + obj03[j].border + ';background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';position: absolute;top:0;left:0;right:0;bottom:0;z-index:160;border-radius:' + obj03[j].borderradius + 'px;"></div></div>';
                // 复选框
              } else if (obj03[j].eletype == 521) {
                if (obj03[j].path) {
                  if (!JSON.parse(obj03[j].path)[0]) {
                    var inputTxt = '选项';
                  } else {
                    var inputTxt = JSON.parse(obj03[j].path)[0];
                  }
                } else {
                  continue;
                }
                pageHtml += '<div style="width:' + width + ';height:' + height + ';z-index:' + zindex + ';top:' + top + ';left:' + left + ';display:table;transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><div class="checkbox checkbox' + i + j + '" data-cur="no"  title="' + obj03[j].fonttext + '" style="display:table-cell;vertical-align:middle;width:100%;height:100%;"><div style="position:absolute;margin-left:10px;z-index:180;width:26px;height:26px;background:url(images/checkbox.png) no-repeat 0 -30px;background-size:cover;background-color:#fff;"></div><input type="checkbox" style="position:relative;z-index:170;border:0;background-color:transparent;margin-left:10px"/><span style="position:relative;z-index:170;color:' + obj03[j].color + ';margin-left:20px">' + inputTxt + '</span><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + 'px;box-shadow:' + obj03[j].boxshadow + ';"></div></div></div>';
                // 单选
              } else if (obj03[j].eletype == 522) {
                if (obj03[j].path) {
                  if (!JSON.parse(obj03[j].path)[0]) {
                    var inputTxt = '选项';
                  } else {
                    var inputTxt = JSON.parse(obj03[j].path)[0];
                  }
                } else {
                  continue;
                }
                pageHtml += '<div style="width:' + width + ';height:' + height + ';z-index:' + zindex + ';top:' + top + ';left:' + left + ';display:table;transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><div class="radio radio' + i + j + '" data-cur="no" title="' + obj03[j].fonttext + '" style="display:table-cell;vertical-align:middle;width:100%;height:100%;"><div style="position:absolute;margin-left:12px;z-index:180;width:26px;height:26px;background:url(images/radio.png) no-repeat 0 0;background-size:cover;background-color:#fff;border-radius:50%;margin-left:10px"></div><input type="radio" style="position:relative;z-index:170;border:0;background-color:transparent;border-radius:50%;margin-left:10px;"/><span style="position:relative;z-index:170;color:' + obj03[j].color + ';margin-left:20px;">' + inputTxt + '</span><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + 'px;box-shadow:' + obj03[j].boxshadow + ';"></div></div></div>';
                // 按钮
              } else if (obj03[j].eletype == 523) {
                if (obj03[j].path) {
                  if (!JSON.parse(obj03[j].path)[0]) {
                    var inputTxt = '按钮';
                  } else {
                    var inputTxt = JSON.parse(obj03[j].path)[0];
                  }
                } else {
                  continue;
                }
                pageHtml += '<div style="width:' + width + ';height:' + height + ';z-index:' + zindex + ';top:' + top + ';left:' + left + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><button class="submit" style="color:' + obj03[j].color + ';position:relative;z-index:170;box-sizing:border-box;border:' + obj03[j].border + ';background-color:transparent;outline:0;width:100%;height:100%;">' + inputTxt + '</button><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + 'px;box-shadow:' + obj03[j].boxshadow + ';"></div></div>';
                // 下拉框
              } else if (obj03[j].eletype == 524) {
                var box = $('<div style="width:' + width + ';height:' + height + ';z-index:' + zindex + ';top:' + top + ';left:' + left + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><div style="position:absolute;top:0;left:0;bottom:0;right:0;background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';z-index:160;border-radius:' + obj03[j].borderradius + 'px;box-shadow:' + obj03[j].boxshadow + ';border:' + obj03[j].border + ';"></div></div>');
                var select = $('<select style="width:100%;height:100%;position:relative;z-index:170;color:' + obj03[j].color + ';border:none;background-color:transparent;outline:0;padding-left:20px;box-sizing:border-box;" class="select select' + i + j + '"></select>');
                var inputTxt = JSON.parse(obj03[j].path);
                for (var t = 0; t < inputTxt.length; t++) {
                  $('<option>' + inputTxt[t] + '</option>').appendTo(select);
                }
                select.appendTo(box);
                pageHtml += box[0].outerHTML;
                // 互动
              } else if (obj03[j].eletype == 527 || obj03[j].eletype == 528 || obj03[j].eletype == 529 || obj03[j].eletype == 530) {
                pageHtml += '<div class="active" data-id="' + obj03[j].id + '" style="text-align:center;display:table;width:' + width + ';height:' + height + ';z-index:' + zindex + ';top:' + top + ';left:' + left + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><div style="width:100%;height:100%;display:table-cell;vertical-align:middle;box-shadow:' + obj03[j].boxshadow + ';">' + obj03[j].graph.replace('<path ', '<path style="fill:' + obj03[j].color + ';"').replace('<svg ', '<svg style="position:relative;z-index:170;width:68px;height:56px;"') + '<span style="position:relative;z-index:170;font-size:60px;color:' + obj03[j].color + ';display:' + obj03[j].display + ';">' + obj03[j].clickcount + '</span><div style="background-color:' + obj03[j].backgroundcolor + ';opacity:' + obj03[j].opacity + ';border-radius:' + obj03[j].borderradius + 'px;position:absolute;top:0;left:0;right:0;bottom:0;z-index:160;"></div></div></div>';
                // 录音
              } else if (obj03[j].eletype == 405) {
                pageHtml += '<div class="recording" style="top:' + top + ';left:' + left + ';"><audio src="' + imageUrl + obj03[j].path + '"></audio></div>';
                // 视频
              } else if (obj03[j].eletype == 61) {
                pageHtml += '<video src="' + imageUrl + obj03[j].path + '" poster="images/logo_bg.png" webkit-playsinline="true" playsinline="true"></video>';
                // 摇一摇
              } else if (obj03[j].eletype == 406) {
                var shakeNo = "shake" + (i + 1);
                pageHtml += '<div style="width:100%;height:100%;top:0;left:0;z-index:500;" class="shake" data-id="' + shakeNo + '"></div>';
                shakeObj[shakeNo] = {
                  'src': obj03[j].path,
                  'speed': obj03[j].imgtime,
                  'size': obj03[j].imgsize * 2
                };
                // 擦一擦
              } else if (obj03[j].eletype == 407) {
                var wipeNum = "wipe" + i + j;
                if (/#\w{3}/.test(obj03[j].path)) {
                  var color = obj03[j].path;
                  pageHtml += '<div class="' + wipeNum + '" style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';z-index:600;opacity:' + obj03[j].opacity + ';"><div style="width:100%;height:100%;background-color:' + color + ';" class="wipe"></div></div>'
                } else {
                  var src = imageUrl + obj03[j].path;
                  pageHtml += '<div class="' + wipeNum + '" style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';z-index:600;opacity:' + obj03[j].opacity + ';"><img src="' + src + '" class="wipe" style="width:100%;height:100%;"/></div>'
                }
                // 点一点
              } else if (obj03[j].eletype == 408) {
                if (obj03[j].path.match("http:")) { // 网址
                  pageHtml += '<div class="pointing" style="background-image:url(images/point-w.png);top:' + top + ';left:' + left + ';z-index:' + zindex + ';width:' + width + ';height:' + height + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><a href="' + obj03[j].path + '" target="_blank"></a></div>';
                } else { // 电话
                  pageHtml += '<div class="pointing" style="background-image:url(images/point-t.png);top:' + top + ';left:' + left + ';z-index:' + zindex + ';width:' + width + ';height:' + height + ';transform:rotate(' + obj03[j].rotaangle + 'deg);-webkit-transform:rotate(' + obj03[j].rotaangle + 'deg);"><a href="' + obj03[j].path + '" target="_blank"></a></div>';
                }
                // 广告页
              } else {
                if (obj03[j].giftpageid == -1) {
                  // pageHtml += '<div><a href="'+obj03[j].link+'"><<img src="'+obj03[j].picture+'"/></a></div>';
                  $('<div class="swiper-slide"><div style="background-image:url(' + advertUrl + obj03[j].picture + ');background-size:cover;background-position:center;background-repeat:no-repeat;"></div><p>' + obj03[j].title + '</p><a href="' + obj03[j].link + '" target="_blank"></a></div>').appendTo(addwrapper);
                }
              }
              if (obj03[j].animate) {
                // 渲染动画JS
                var boxbegin = "";
                var boxend = "";
                var boxwidth = obj03[j].width + 'px';
                var boxheight = obj03[j].height + 'px';
                var boxtop = obj03[j].top + 'px';
                var boxleft = obj03[j].left + 'px';
                var boxzIndex = obj03[j].zindex;
                if (obj03[j].eletype == 296) {
                  boxwidth = parseFloat(obj03[j].width) + 14 + 'px';
                  boxtop = obj03[j].top + 'px';
                  boxleft = parseFloat(obj03[j].left) - 14 + 'px';
                }
                if (obj03[j].animate.length) {
                  for (var a = 0; a < obj03[j].animate.length; a++) {
                    var curAniTime = parseFloat(obj03[j].animate[a].duration) + parseFloat(obj03[j].animate[a].delay);
                    if (curAniTime > aniAllTime) {
                      aniAllTime = curAniTime;
                    }
                    pageJs += 'animate_' + (ani_count++) + ':{element:"main1_ani_' + j + '_' + elemAni_count + '",animation:"' + obj03[j].animate[a].animation + '",duration:"' + obj03[j].animate[a].duration + 's",delay:"' + obj03[j].animate[a].delay + 's",count:"' + obj03[j].animate[a].count + '",type:"' + obj03[j].animate[a].type + '","timing":"linear",},';
                    if (a == 0) {
                      boxbegin += '<div style="width:' + boxwidth + ';height:' + boxheight + ';top:' + boxtop + ';left:' + boxleft + ';z-index:' + boxzIndex + ';" class="main1_ani_' + j + '_' + elemAni_count + '">';
                    } else {
                      boxbegin += '<div style="width:100%;height:100%;" class="main1_ani_' + j + '_' + elemAni_count + '">';
                    }
                    boxend += '</div>';
                    elemAni_count++;
                  }
                  pageHtml = boxbegin + pageHtml + boxend;
                }
              }
            }
            main.append(pageHtml);
          }
          aniObj.push(aniAllTime);
          if (obj02[i].id == -1) {
            // addtitle.appendTo(main);
            addwrapper.appendTo(addcontainer);
            addpag.appendTo(addcontainer);
            // rightcover.appendTo(addcontainer);
            // leftcover.appendTo(addcontainer);
            addcontainer.appendTo(main);
            addlogo.appendTo(main);
            addbottom.appendTo(main);
          }
          if (obj02[i].id == -2) {
            activity.appendTo(main);
          }
          pageJs += '},';
          content.append(bg);
          content.append(main);
          page.append(content);
          slide.append(page);
          wrapper.append(slide);
          container.append(wrapper);
        }
        $(target).prepend(container);
        // 去除多余广告标题
        // $('.addtitle:gt(0)').remove();
        // 进度条宽度
        var pagecount = $(target).find('.slide_progress>ul>li').length;
        $('.slide_progress>ul>li').css('width', 'calc(100%/' + pagecount + ')');
        $('<div class="swiper-button-next"></div>').appendTo($(target));
        pageJs += '};';
        var js = document.createElement('script');
        js.text = pageJs;
        document.body.appendChild(js);
        // 启动swiper及动画 删除loading效果 注册事件
        callback();
        // 背景音乐渲染
        if (obj01.mpath) {
          musicSrc = obj01.mpath;
          // 插入audio
          $('<div id="audio"><audio src="' + obj01.mpath + '" loop="loop" preload="auto" data-cur="0"></audio><span></span></div>').appendTo(target);
          // 暂停播放
          $('#audio span').on('click', function(e) {
            e.stopPropagation();
            if (window.rudianMediaControl) {
              // data-cur为0表示为暂停状态
              if ($('#audio audio').attr('data-cur') == 0) {
                window.rudianMediaControl.onMediaPlay();
                $('#audio span').css('animation', 'rota 10s linear infinite');
                $('#audio audio').attr('data-cur', '1');
              } else {
                window.rudianMediaControl.onMediaPause();
                $('#audio span').css('animation', 'none');
                $('#audio audio').attr('data-cur', '0');
              }
            } else {
              if ($('#audio audio')[0].paused) {
                $('#audio span').css('animation', 'rota 10s linear infinite');
                $('#audio audio')[0].play();
              } else {
                $('#audio span').css('animation', 'none');
                $('#audio audio')[0].pause();
              }
            }
          });

          // 进入页面自动播放
          // 解决APP端 音乐无法自动播放问题
          if (window.rudianMediaControl) {
            var url = $('#audio audio')[0].src;
            window.rudianMediaControl.onMediaUrl(url);
            window.rudianMediaControl.onMediaPlay();
            $('#audio span').css('animation', 'rota 10s linear infinite');
            $('#audio audio').attr('data-cur', '1');
          } else {
            if (!/MicroMessenger/i.exec(navigator.userAgent.toLowerCase())) {
              $('#audio audio')[0].play();
              $('#audio span').css('animation', 'rota 10s linear infinite');
              // 解决 IOS限制自动播放问题
              $(document).on('touchstart', function(e) {
                $('#audio audio')[0].play();
                $(document).off('touchstart');
              });
            }
          }
        }

        // 解决 IOS微信 音乐无法自动播放问题 以及 微信分享
        if (/MicroMessenger/i.exec(navigator.userAgent.toLowerCase())) {
          // console.log(window.parent.playAudio);
          if (window.parent.playAudio) {
            window.parent.playAudio();
          }
          /*配置微信JSSDK*/
          var uri = location.href.split("/");
          uri = uri[uri.length - 1]; // 取截取的数组最后一个
          // console.log(uri);
          getData({
            "uri": uri
          }, "elementsService.do", "getWxActParameter", "getWxActParameter");
        }
      }
      break;
    case "wxPublicLoginPay": // 登陆后获取 买单活动详情
      // console.log(returnCode);
      // console.log(returnMsg);
      if (returnCode == 000) {
        toId = returnMsg.id;
        user_id = returnMsg.id;
        // console.log(gn_id);
        getData({
          "gnId": gn_id
        }, 'giftsService.do', 'getGiftDetailAdvert', 'gift_preview', isPhone);
      } else if (returnCode == 003) { //code已授权过
        // console.log("http://www.easyinto.com/love/userService.do?op=actHome&gnId=" + gn_id);
        window.location.href = "http://www.easyinto.com/love/userService.do?op=actHome&gnId=" + gn_id;
      }
      break;
    case "wxPublicLoginAct": // 登陆后获取 推广活动详情
      // console.log(returnCode);
      // console.log(returnMsg);
      if (returnCode == 000) {
        toId = returnMsg.id;
        user_id = returnMsg.id;
        // console.log(fromId);
        getData({
          "actId": act_id,
          "fromId": fromId
        }, 'giftsService.do', 'getGiftDetailAdvert', 'gift_preview', isPhone);
      } else if (returnCode == 003) { //code已授权过
        // console.log("http://www.easyinto.com/love/userService.do?op=actHome&actId=" + act_id + "&fromId=" + toId);
        window.location.href = "http://www.easyinto.com/love/userService.do?op=actHome&actId=" + act_id + "&fromId=" + toId;
      }
      break;
    // 浏览统计
    case "one_draft_count":
      // console.log(returnMsg);
      break;
    // 表单提交
    case "giftform":
      alert('谢谢您的支持，稍后我们的工作人员会跟您联系');
      break;
    // 互动提交
    case "clickCount":
      alert(returnMsg[0]);
      break;
    case "getWxActParameter":
      // alert(returnCode);
      // alert(JSON.stringify(returnMsg));
      setWxParameter(returnMsg);
      break;
    case "helpOpenGift":
      // alert(returnCode);
      // alert(JSON.stringify(returnMsg));
      if (returnCode == 000) {
        $('#showtip .tipbox').addClass("isok");
        $('#showtip').show();
      } else if (returnCode == 002) {
        $('#showtip .tipbox').addClass("isalready");
        $('#showtip').show();
      } else if (returnCode == 004) {
        $('#showtip .tipbox').addClass("isfinish");
        $('#showtip').show();
      } else if (returnCode == 003) {
        $('#showtip .tipbox').addClass("isself");
        $('#showtip').show();
      } else if (returnCode == 005) {
        $('#showtip .tipbox').addClass("isnix");
        $('#showtip').show();
      }
      break;
    case "helpPushGift":
      // alert(returnCode);
      // alert(JSON.stringify(returnMsg));
      if (returnCode == 000) {
        $('#showtip .tipbox').addClass("isok2");
        $('#showtip').show();
      } else if (returnCode == 002) {
        $('#showtip .tipbox').addClass("isalready2");
        $('#showtip').show();
      } else if (returnCode == 004) {
        $('#showtip .tipbox').addClass("isfinish2");
        $('#showtip').show();
      } else if (returnCode == 003) {
        $('#showtip .tipbox').addClass("isself");
        $('#showtip').show();
      } else if (returnCode == 005) {
        $('#showtip .tipbox').addClass("isnix");
        $('#showtip').show();
      }
      break;
    case "showReplyByGift":
      // console.log(returnMsg);
      var html = "";
      if (returnMsg.length == 0) {
        html += '暂无评论';
      } else {
        $.each(returnMsg, function(i, obj) {
          // 单条
          if (obj.child.length == 0) {
            html += '<li class="clearfix"><i style="background-image:url(' + obj.photo + ');" data-userid="' + obj.userid + '" data-id="' + obj.id + '" data-name="' + obj.username + '"></i><h2>' + obj.username + '<span>' + obj.time.replace('.0', '') + '</span></h2><p><span>评论：</span>' + obj.content + '</p></li>';
          } else {
            html += '<li><div class="clearfix"><i style="background-image:url(' + obj.photo + ');" data-userid="' + obj.userid + '" data-id="' + obj.id + '" data-name="' + obj.username + '"></i><h2>' + obj.username + '<span>' + obj.time.replace('.0', '') + '</span></h2><p><span>评论：</span>' + obj.content + '</p></div>';
            $.each(obj.child, function(j, child) {
              html += '<div class="clearfix"><i style="background-image:url(' + child.photo + ');" data-userid="' + child.userid + '" data-id="' + child.id + '" data-name="' + child.username + '"></i><h2>' + child.username + '<span>' + child.time.replace('.0', '') + '</span></h2><p><span>回复：</span>' + child.content + '</p></div>';
            });
            html += "</li>";
          }
        });
      }
      $('.commentlist>ul').html(html);
      break;
    case "addReply":
      // console.log(returnMsg);
      $('.comment input').val('');
      $('.comment .cancel').removeClass('add');
      getData({
        "giftId": giftMsg.gid
      }, 'replyService.do', 'showReplyByGift', 'showReplyByGift');
      break;
  }
}
// 数据解密------------------------
function getData(packets, interName, methName, category, isPhone) {
  var token = "0FB451072D3FB25E3D5AE438D64FF3D7";
  var key = CryptoJS.enc.Utf8.parse(token.slice(0, 16));
  var data = CryptoJS.enc.Utf8.parse(JSON.stringify(packets));
  var packetsAES = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  var sign = "[" + [packetsAES, token].sort().toString().replace(",", ", ") + "]";
  var signMD5 = CryptoJS.MD5(sign).toString();
  $.ajax({
    url: serviceUrl + interName,
    type: 'post',
    dataType: 'json',
    data: {
      'op': methName,
      'packets': packetsAES,
      'sign': signMD5
    },
    success: function(res) {
      var returnCode = res.returnCode;
      var returnMsg = res.returnMsg;
      if (returnCode === "000") {
        returnMsg = CryptoJS.AES.decrypt(returnMsg, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        try {
          returnMsg = JSON.parse(returnMsg.toString(CryptoJS.enc.Utf8));
        } catch (err) {
          returnMsg = returnMsg.toString(CryptoJS.enc.Utf8);
        }
      }
      if (typeof dataDeal === "function") {
        dataDeal(returnCode, returnMsg, category, isPhone);
      } else {
        console.log("dataDeal is not defined");
      }
    }
  });
}

/*分享功能*/
if (isPhone == 0) {
  // PC分享
  window._bd_share_config = {
    "common": {
      "bdSnsKey": {},
      "bdText": giftName,
      "bdDesc": giftDes,
      "bdUrl": window.location.href,
      "bdPic": frontCover,
      "bdSize": "16",
    },
    "share": {
      "bdSize": 16
    }
  };
  (function() {
    with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)]
  })();
  $('.bdsharebuttonbox>span>a').css('background-image', 'none');
} else {
  // 微信端分享
  if (/MicroMessenger/i.exec(navigator.userAgent.toLowerCase())) {
    function setWxParameter(returnMsg) {
      // alert(JSON.stringify(returnMsg));
      wx.config({
        debug: false,
        appId: returnMsg["appid"],
        timestamp: returnMsg["timestamp"],
        nonceStr: returnMsg["nonceStr"],
        signature: returnMsg["signature"],
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareQZone'
        ]
      });
      wx.ready(function() {
        // 区分 普通作品与活动作品
        if (gift_id) { // 普通作品
          var shareUrl = "http://www.easyinto.com/love/rudian/giftShow.html?gift_id=" + gift_id;
        } else {
          if (gn_id) { // 买单活动
            var shareUrl = "http://www.easyinto.com/love/userService.do?op=actHome&gnId=" + gn_id;
          } else { // 推广活动
            // alert(toId);
            var shareUrl = "http://www.easyinto.com/love/userService.do?op=actHome&actId=" + act_id + "&fromId=" + toId;
          }
        }
        // alert(giftDes);
        // 分享微信朋友
        wx.onMenuShareAppMessage({
          title: giftName,
          desc: giftDes,
          link: shareUrl,
          imgUrl: giftCover,
          type: '',
          dataUrl: '',
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        // 分享到微信朋友圈
        wx.onMenuShareTimeline({
          title: giftName,
          link: shareUrl,
          imgUrl: giftCover,
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        // 分享qq朋友
        wx.onMenuShareQQ({
          title: giftName,
          desc: giftDes,
          link: shareUrl,
          imgUrl: giftCover,
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        // 分享qq空间
        wx.onMenuShareQZone({
          title: giftName,
          desc: giftDes,
          link: shareUrl,
          imgUrl: giftCover,
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        if ($('#audio audio').length) {
          $('#audio audio')[0].play();
          $('#audio span').css('animation', 'rota 10s linear infinite');
        }
      });
      wx.error(function(res) {
        // alert(res.errMsg);
      });
    }
  }
}
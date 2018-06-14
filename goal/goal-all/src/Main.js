(function () {
  Flash2x.designWidth = 870;
  Flash2x.designHeight = 1136;
  "Android" == F2xSystem.osType ? F2xInit(30, "flash2xDiv", 640, window.innerHeight / window.innerWidth * 640, main) : F2xInit(30, "flash2xDiv", window.innerWidth, window.innerHeight, main)
})();
var l = F2xContainer.prototype.addEventListener;
F2xContainer.prototype.addEventListener = function (b, c, d, f) {
  l.call(this, b, function (d) {
    "click" !== b || f || Flash2x.getSoundByName("cover", "button").play(0, 1);
    c && c(d)
  }, d)
};
var replaceScene = function (b) {
  Flash2x.stage.removeAllChildren();
  Flash2x.stage.addChild(b)
};

function main() {
  Flash2x.stageScaleMode = F2xStageScaleMode.NO_BORDER;
  Flash2x.stageAlign = F2xStageAlign.MIDDLE;
  Flash2x.initViewSize();
  Flash2x.initViewSize = function () {};
  Flash2x.loadScene("loading", function (b) {}, function () {
    var b = new loading.Loading,
      c = new loading.MusicPannel,
      d = Flash2x.stage,
      f = new F2xContainer;
    d.addChild(f);
    d.addChild(c);
    c.x = 666;
    c.y = 30;
    Flash2x.stage = f;
    Flash2x.stage.addChild(b);
    b.startLoad()
  })
}
var sendRequest = function (b, c, d, f, h) {
  var e = new XMLHttpRequest;
  d = d || "GET";
  if ("GET" === d) {
    var a = null;
    if (null != c) {
      var a = "",
        g;
      for (g in c) a += g + "=" + c[g] + "&";
      a = a.substr(0, a.length - 1)
    }
    null !== a && "" !== a && (b += "?" + a)
  }
  e.open(d, b, !0);
  e.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  e.onreadystatechange = function () {
    if (4 == e.readyState && 200 == e.status) {
      var a = e.responseText;
      if (a) {
        console.log(a);
        var b = JSON.parse(a);
        b ? f && f(b) : h && h(b)
      } else h && h(b)
    }
  };
  if ("GET" === d) e.send(c);
  else {
    a = null;
    if (null != c) {
      a = "&";
      for (g in c) a += g + "=" + c[g] + "&";
      a = a.substr(0, a.length - 1)
    }
    console.log(a);
    e.send(a)
  }
};

function getRandom(b) {
  return Math.floor(Math.random() * b) % b
};
---
layout: post
title: '阿里 arms 前端监控源码分析'
date: '2019-05-27'
author: 'XuBaoshi'
header-img: 'img/node-module.jpg'
---

# 阿里 arms 前端监控（web 场景）源码分析

ARMS 前端监控平台用于 Web 端体验数据监控，从页面打开速度（测速）、页面稳定性（JS Error）和外部服务调用成功率（API）这三个
方面监测 Web 页面的健康度。

[文档地址](https://help.aliyun.com/document_detail/58652.html?spm=a2c4g.11186623.6.601.6b427408NLzKtY)

## sdk 初始化

### 以 CDN 方式接入

![/img/monitor/cdn.png](/img/monitor/cdn.png)  

### Npm 接入配置

npm 包下载

```
npm install alife-logger --save
```

初始化

```javascript
const BrowserLogger = require('alife-logger')
// BrowserLogger.singleton(conf) conf传入config配置
const __bl = BrowserLogger.singleton({
  pid: 'your-project-id',
  imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?' // 设定日志上传地址,新加坡部署可选`https://arms-retcode-sg.aliyuncs.com/r.png?`
  // 其他config配置
})
```

## config 说明

```
pid                String     项目唯一 ID，由 ARMS 在创建站点时自动生成
tag                String     传入的标记，每条日志都会携带该标记
page               String     页面名称，默认取当前页面 URL 的关键部分
enableSPA          Boolean    是否监听页面的 hashchange 事件并重新上报 PV，适用于单页面应用场景
parseHash          Function   配合 enableSPA 使用, 将 URL hash 解析为 page 的方法。
disableHook        Boolean    是否禁用 AJAX 请求监听，默认会监听并用于 API 调用成功率上报
ignoreUrlCase      Boolean    是否忽略 Page URL 大小写，默认为忽略
urlHelper          *          代替旧字段 ignoreUrlPath，用于配置 URL 过滤规则。
apiHelper          *          代替旧字段 ignoreApiPath，用于配置 API 过滤规则。
ignore             Object     忽略指定 URL/API/JS Error。符合规则的日志将被忽略，不会上报，包含子配置项 ignoreUrls、ignoreApis 和 ignoreErrors。
disabled           Boolean    禁用日志上报功能
sample             Integer    日志采样配置，值为 1、10 或 100。性能和成功 API 日志按照 1/sample。
sendResource       Boolean    是否上报页面静态资源
useFmp             Boolean    是否采集首屏 FMP（First Meaningful Paint，首次有效渲染）数据。
enableLinkTrace    Boolean    是否允许进行前后端链路追踪。
```

## 实例对象（\_bl）方法说明

### api() 接口调用成功率上报

用于手动上报上报页面的 API 调用成功率

```javascript
__bl.api(api, success, time, code, msg)
```

参数说明

```
api           String                   接口名
success       Boolean                  是否调用成功
time          Number                   接口耗时
code          String/Number            返回码
msg           String                   返回信息
```

### error() 错误信息上报

用于手动上报页面中的 JS 错误或使用者想关注的异常

```javascript
__bl.error(error, pos)
```

参数说明

```
error               Error                    JS 的 Error 对象
pos                 Object                   错误发生的位置，包含以下3个属性
pos.filename        String                   错误发生的文件名
pos.lineno          Number                   错误发生的行数
pos.colno           Number                   错误发生的列数
```

### sum() 求和统计

统计业务中某些事件发生的次数

```javascript
__bl.sum(key, value)
```

参数说明

```
key                 String                    事件名
value               Number                    单次累加上报量，默认 1
```

### avg() 求平均统计

统计业务场景中某些事件发生的平均次数或平均值

```javascript
__bl.avg(key, value)
```

参数说明

```
key               String                事件名
value             Number                单次累加上报量，默认 1
```

### setConfig() 修改配置项

用于在 SDK 初始完成后重新修改部分配置项。

```javascript
__bl.setConfig(next)
```

参数说明

```
next               Object                需要修改的配置项以及值
```

### setPage() 设置当前页面的 page name

设置当前页面的 page name

```javascript
__bl.setPage(next, sendPv)
```

参数说明

```
page               String                新的 page name
sendPv             Boolean               是否上报 PV，默认会上报
```

## 源码分析

[源码地址](https://github.com/xubaoshi/monitor-source-code/tree/master/lib/src)

### 初始化（CDN）

```html
<script>
  !(function(c, b, d, a) {
    c[a] || (c[a] = {})
    c[a].config = {
      pid: 'hba2jsfapn@02e58eba6efaf2b',
      imgUrl: 'http://127.0.0.1:3012/r.png?',
      sendResource: true,
      enableSPA: true,
      useFmp: true
    }
    with (b)
      with (body)
        with (insertBefore(createElement('script'), firstChild))
          setAttribute('crossorigin', '', (src = d))
  })(window, document, 'https://retcode.alicdn.com/retcode/bl.js', '__bl')
</script>
```

index.js

``` javascript
import clazz from './biz.browser.clazz_2.js'
import util from './utils_14.js'

// 初始化 _bl 函数
function r (e, t) {
  var n = a[i] = new o(e);
  n.$ak(t);
  var r = n._conf;
  return !1 !== r.autoSendPv && n.$ar(),
    r && r.useFmp || n.$au(),
    r && r.sendResource && n.$b0(),
    a[s] = !0,
    n
}

var a = window
  , o = a.BrowserLogger = clazz
  , i = util.key // "_bl"
  , s = "__hasInitBlSdk";

// npm 引入 sdk 方式使用
o.singleton = function (e, t) {
  return a[s] ? a[i] : r(e, t)
};

// 判断是否执行 _bl 函数
"object" == typeof window && !!window.navigator && a[i] && (o.bl = function () {
  if (a[s])
    return a[i];
  var e = {}
    , t = [];
  return i in a && (e = a[i].config || {},
    t = a[i].pipe || []),
    r(e, t)
}(a.__hasInitBlSdk))
```

biz.browser.clazz_2.js

``` javascript
import util from './utils_14.js'
import reporter from './reporter_13.js'
import sender from '././common.sender_11.js'
import post from './common.post_9.js'
import handler from './handler_5.js'
import fmp from './fmp_3.js'
import hook from './hook_6.js'
import hack from './hack_4.js'
var util_r = util
  , reporter_a = reporter
  , sender_o = sender
  , post_i = post
  , util_r_win_s = util_r.win
  , c = util_r_win_s.document
  , u = /^(error|api|speed|sum|avg|percent|custom|msg|setPage|setConfig)$/
  , f = function (e) {
    // e -> index.js 传递过来的用户的配置信息
    var t = this;
    return reporter_a.call(t, e),
      t._initialPage = e.page && util_r.$a8(e.page, [], e.page + "") || null,
      t._health = {
        errcount: 0,
        apisucc: 0,
        apifail: 0
      },
      t.$ag = function (e, n) {
        "error" === e ? t._health.errcount++ : "api" === e && t._health[n.success ? "apisucc" : "apifail"]++
      }
      ,
      t.$ah(),
      t.$ai(),
      t.$aj(1e4),
      Object.defineProperty && util_r_win_s.addEventListener && Object.defineProperty(t, "pipe", {
        set: t.$ak
      }),
  };

  //  prototype 继承
  f.prototype = util_r.$al(reporter_a.prototype),

  // 默认配置
  util_r.ext(reporter_a._root.dftCon,{
    //......
  })

  // prototype 方法
  util_r.ext(f.prototype, {
    // .....
  })

  handler(f, util_r_win_s, c),
  // 首屏渲染方法处理
  fmp(f, util_r_win_s, c),
  // api 监控方法处理
  hook(f, util_r_win_s),
  // 自定义事件 HTML5 History 模式
  hack(f, util_r_win_s),
  f._super = reporter_a,
  f._root = reporter_a._root,
  reporter_a.Browser = f
```

reporter_13.js

``` javascript
import util from './utils_14.js'
import base from './base_1.js'
var util_r = util
  , base_a = base
  , o = ["api", "success", "time", "code", "msg", "trace", "traceId", "begin", "sid", "seq"]
  , i = function (e, t) {
    var n = e.split("::");
    return n.length > 1 ? util_r.ext({
      group: n[0],
      key: n[1]
    }, t) : util_r.ext({  
      group: "default_group",
      key: n[0]
    }, t)
  }
  , s = function (e) {
    // e -> biz.browser.clazz_2.js 传递过来的用户的配置信息
    base_a.call(this, e);
    var t;
    try {
      t = "object" == typeof performance ? performance.timing.fetchStart : Date.now()
    } catch (n) {
      t = Date.now()
    }
    return this._startTime = t,
      this
  };
```

base_1.js

``` javascript
import util from './utils_14.js'
var util_r = util
  , a = function (e) {
    // e -> reporter_13.js 传递过来的用户的配置信息
    return this.ver = "1.5.1",
      this._conf = util_r.ext({}, a.dftCon),
      this.$a5 = {},
      this.$a1 = [],
      this.hash = util_r.seq(),
      this.$a6(),
      // 设置页面传递过来的信息
      this.setConfig(e),
      this.rip = util_r.getRandIP(),
      this.record = 999,
      this["EagleEye-TraceID"] = this.getTraceId()["EagleEye-TraceID"],
      this._common = {},
      this
  };
a.dftCon = {
  sample: 1,
  tag: "",
  imgUrl: "https://arms-retcode.aliyuncs.com/util_r.png?",
  region: null
}
```

### 与监控后端交互

1.base_1.js _lg()  

``` javascript
{
  _lg: function (e, t, n) {
      var a = this._conf;
      return this.$ab(a.imgUrl) && t && !a.disabled && a.pid ? n && !this.$af(n) ? this : (t = util_r.ext({
        t: e,
        times: 1,
        page: this.$a7(),
        tag: a.tag || "",
        begin: Date.now()
      }, t, this.$ae(), this._common, {
          pid: a.pid,
          _v: this.ver,
          sid: this.session,
          sampling: n || 1,
          z: util_r.seq()
        }),
        function (e, t) {
          var n;
          "error" === t.t && (n = e.$a1[0]) && "error" === n.t && t.msg === n.msg ? n.times++ : (e.$a1.unshift(t),
            e.$a2(function () {
              e.$a3 = util_r.delay(function () {
                e.$a4()
              }, "error" === t.t ? 3e3 : -1)
            }))
        }(this, t)) : this
  }
}
```

2.base_1.js $a4()

``` javascript
{
  $a4: function () {
      var e;
      for (clearTimeout(this.$a3),
        this.$a3 = null; e = this.$a1.pop();)
        "res" === e.t ? this.$ad(e, "res") : "error" === e.t ? this.$ad(e, "err") : this.$ac(e);
      return this
  }
}
```

3.biz.browser.clazz_2.js   $ad()  res(静态资源) error（错误） 使用 XMLHttpRequest

``` javascript
{
  $ad: function (e, t) {
      var n = {};
      n[t] = e[t],
        delete e[t];
      var reporter_a = "";
      "object" == typeof e && (reporter_a = util_r.serialize(e)),
        i(n, this.getConfig("imgUrl") + reporter_a + "&post_res=")
  }
}
```

4.biz.browser.clazz_2.js   $ac()  fetch

``` javascript
{
  $ac: function (e) {
      o(e, this.getConfig("imgUrl"))
  }
}
```
common.sender_11.js o fetch  
common.post_9.js  i XMLHttpRequest post  


### api 请求上报

hook_6.js

``` javascript
import util from './utils_14.js'
export default function (t, n) {
  var r = util
    , a = null
    , o = function (e, t, n, a, o, i, s, c, u, f) {
      var l = r.J(o) || null
        , p = r.$a8(t, [l, a], null);
      if (!p)
        return !1;
      var h = p.code || i
        , g = !("success" in p) || p.success;
      e.api(n, g, s, h, p.msg, c, u, f)
    }
    , i = "fetch"
    , s = "__oFetch_"
    , c = "__oXMLHttpRequest_"
    , u = "XMLHttpRequest";
  return r.ext(t.prototype, {
    // ...
    addHook: function (e) {
      return !e && a ? this : (a || (function () {
        if ("function" == typeof n[i]) {
          var e = n[i];
          n[s] = e,
            n[i] = function (t, i) {
              // ....
            }
            ,
            n[i].toString = r.$aw(i)
        }
      }(),
        function () {
          if ("function" == typeof n[u]) {
            var e = n[u];
            n[c] = e,
              n[u] = function (t) {
                // 使用原生 XMLHttpRequest 方法初始化 ,在此基础上再次封装，装饰者模式
                var n = new e(t)
                  , i = a;
                if (!i || !i.api || !n.addEventListener)
                  return n;
                var s, c, u, f = n.send, l = n.open, p = n.setRequestHeader, h = i._conf, g = i.getConfig("enableLinkTrace"), d = "", v = "", m = "";
                return n.open = function (e, t) {
                  var a = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                  if (l.apply(n, a),
                    u = t || "",
                    c = r.$an(u),
                    c = c ? r.$am(c, h.ignoreApiPath) : "",
                    g) {
                    var o = "";
                    try {
                      o = location.origin ? location.origin : location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "")
                    } catch (s) {
                      o = ""
                    }
                    r.checkSameOrigin(u, o) && p && "function" == typeof p && (d = i.getTraceId()["EagleEye-TraceID"],
                      p.apply(n, ["EagleEye-TraceID", d]),
                      v = i.getSessionId()["EagleEye-SessionID"],
                      p.apply(n, ["EagleEye-SessionID", v]),
                      m = i.getConfig("pid"),
                      p.apply(n, ["EagleEye-pAppName", m]))
                  }
                }
                  ,
                  n.send = function () {
                    s = Date.now();
                    var e = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments);
                    f.apply(n, e)
                  }
                  ,
                  r.on(n, "readystatechange", function () {
                    if (c && 4 === n.readyState) {
                      var e = Date.now() - s;
                      if (n.status >= 200 && n.status <= 299) {
                        var t = n.status || 200;
                        if ("function" == typeof n.getResponseHeader) {
                          var r = n.getResponseHeader("Content-Type");
                          if (r && !/(text)|(json)/.test(r))
                            return
                        }
                        n.responseType && "text" !== n.responseType ? i.api(c, !0, e, t, "", s, d, v) : o(i, h.parseResponse, c, u, n.responseText, t, e, s, d, v)
                      } else
                        i.api(c, !1, e, n.status || "FAILED", n.statusText, s, d, v)
                    }
                  }),
                  n
              }
              ,
              n[u].toString = r.$aw(u)
          }
        }()),
        a = this,
        this)
    },
    $ai: function () {
      return this.$b7 ? this : (this.getConfig("disableHook") || this.addHook(),
        this.$b7 = !0,
        this)
    }
  }),
    t
}
```

reporter_13 api()

``` javascript
{
  api: function (e, t, n, base_a, i, s, c, u) {
      return e ? (e = "string" == typeof e ? {
        api: e,
        success: t,
        time: n,
        code: base_a,
        msg: i,
        begin: s,
        traceId: c, // 链路追踪 EagleEye-TraceID 没有设置默认为空
        sid: u // 链路追踪 EagleEye-SessionID 没有设置默认为空
      } : util_r.sub(e, o),
        util_r.$b6(e.api) ? (e.code = e.code || "",
          e.msg = e.msg || "",
          e.success = e.success ? 1 : 0,
          e.time = +e.time,
          e.begin = e.begin,
          e.traceId = e.traceId || "",
          e.sid = e.sid || "",
          !e.api || isNaN(e.time) ? (util_r.warn("[retcode] invalid time or api"),
            this) : (this.$ag && this.$ag("api", e),
              this._lg("api", e, e.success && this.getConfig("sample")))) : this) : (util_r.warn("[retcode] api is null"),
                this)
  }
}
```

### pv 上报 (uv 后台统计)

handler_5.js   $ar

``` javascript
{
  $ar: function () {
      var e = this;
      e.$a2(function () {
        var t = function (e) {
          var t = d(e)
            , a = n.devicePixelRatio || 1;
          return {
            uid: t,
            dt: r.title,
            dl: location.href,
            dr: r.referrer,
            dpr: a.toFixed(2),
            de: (r.characterSet || r.defaultCharset || "").toLowerCase(),
            ul: c.lang,
            begin: Date.now()
          }
        }(e);
        t && t.uid && e._lg("pv", t)
      })
  }
}
```

#### 非 spa 应用

index.js

``` javascript
function r (e, t) {
  var n = a[i] = new o(e);
  n.$ak(t);
  var r = n._conf;
  return !1 !== r.autoSendPv && n.$ar(),
    r && r.useFmp || n.$au(),
    r && r.sendResource && n.$b0(),
    a[s] = !0,
    n
}
```

#### spa 应用

biz.browser.clazz_2.js   f()

``` javascript
import util from './utils_14.js'
import reporter from './reporter_13.js'
import sender from '././common.sender_11.js'
import post from './common.post_9.js'
import handler from './handler_5.js'
import fmp from './fmp_3.js'
import hook from './hook_6.js'
import hack from './hack_4.js'
var util_r = util
  , reporter_a = reporter
  , sender_o = sender
  , post_i = post
  , util_r_win_s = util_r.win
  , c = util_r_win_s.document
  , u = /^(error|api|speed|sum|avg|percent|custom|msg|setPage|setConfig)$/
  , f = function (e) {
    var t = this;
    return reporter_a.call(t, e),
      // ...
      t.$ah(),
      // ...
  };
```

handler_5.js   $ah

``` javascript
{
  $ah: function () {
      var e = this;
      if (e.$b5)
        return e;
      var t = e._conf;
      return a.on(n, "beforeunload", function () {
        e.$aq(0)
      }),
        e.$as(t.enableSPA),
        e.activeErrHandler(!1),
        e.$b5 = !0,
        e
  }
}
```

handler_5.js   $as

``` javascript
{
  $as: function (e) {
      var t = this;
      if (!e ^ t.$b3)
        return t;
      e ? (t.$ax(),
        t.$b3 = function (e) {
          var n = t._conf.parseHash(location.hash);
          n && t.setPage(n, !1 !== e)
        }
        ,
        t.$b4 = function (e) {
          var n = t._conf.parseHash(e.detail);
          n && t.setPage(n)
        }
        ,
        // 原生事件 hashchange
        a.on(n, "hashchange", t.$b3),
        // 自定事件 historystatechange
        a.on(n, "historystatechange", t.$b4),
        t.$b3(!1)) : (a.off(n, "hashchange", t.$b3),
          a.off(n, "historystatechange", t.$b4),
          t.$b3 = null,
          t.$b4 = null)
  }
}
```

history 模式 （参看 hack_4.js ）

### 资源加载数据上报

#### html performance

performance 是 html5 的新特性之一，通过它页面的开发者们可以非常精确的统计到自己页面的表现情况。

![/img/monitor/performance.png](/img/monitor/performance.png)  

[performance api 说明](https://www.cnblogs.com/bldxh/p/6857324.html)

index.js

``` javascript
function r (e, t) {
  var n = a[i] = new o(e);
  n.$ak(t);
  var r = n._conf;
  return !1 !== r.autoSendPv && n.$ar(),
    r && r.useFmp || n.$au(),
    r && r.sendResource && n.$b0(),
    a[s] = !0,
    n
}
```

handler_5.js   $au

``` javascript
{
  $b0: function (e) {
      var t = this;
      t.$a2(function () {
        // common.res_10.js
        var n = i();
        // load 时间超过 2000  或者 load 时间超过 8000
        n && (n.load && n.load <= 2e3 || n.load && n.load <= 8e3 && Math.random() > .05 || (n.page = t.$a7(!0),
          n.dl = location.href,
          e && (n = a.ext(n, e)),
          t._lg("res", n, t.getConfig("sample"))))
      })
    }
}
```

common.res_10.js


### js 异常上报

handler_5.js

``` javascript
a.on(n, "error", function (e) {
      s && s.errorHandler(e)
}).on(n, "unhandledrejection", function (e) {
  s && s.errorHandler(e)
})
```

handler_5.js  errorHandler

``` javascript
errorHandler: function (e) {
      if (!e)
        return this;
      var t = e.type;
      return "error" === t ? this.error(e.error || {
        message: e.message
      }, e) : "unhandledrejection" === t && a.T(e.reason, "Error") && a.$az(e.reason) && this.error(e.reason),
        this
}
```

handler_5.js  error

``` javascript
{
  error: function (e, t) {
      if (!e)
        return util_r.warn("[retcode] invalid param e: " + e),
          this;
      1 === arguments.length ? ("string" == typeof e && (e = {
        message: e
      },
        t = {}),
        "object" == typeof e && (t = e = e.error || e)) : ("string" == typeof e && (e = {
          message: e
        }),
          "object" != typeof t && (t = {}));
      var n = e.name || "CustomError"
        , base_a = e.message
        , o = e.stack || "";
      t = t || {};
      var i = {
        begin: Date.now(),
        cate: n,
        msg: base_a.substring(0, 1e3),
        stack: o && o.substring(0, 1e3),
        file: t.filename || "",
        line: t.lineno || "",
        col: t.colno || "",
        err: {
          msg_raw: base_a,
          stack_raw: o
        }
      };
      return this.$ag && this.$ag("error", i),
        this._lg("error", i, 1)
  }
}
```

### 页面加载性能数据上报

#### 首屏渲染 

biz.browser.clazz_2.js 

``` javascript
import util from './utils_14.js'
import reporter from './reporter_13.js'
import sender from '././common.sender_11.js'
import post from './common.post_9.js'
import handler from './handler_5.js'
import fmp from './fmp_3.js'
import hook from './hook_6.js'
import hack from './hack_4.js'
var util_r = util
  , reporter_a = reporter
  , sender_o = sender
  , post_i = post
  , util_r_win_s = util_r.win
  , c = util_r_win_s.document
  , u = /^(error|api|speed|sum|avg|percent|custom|msg|setPage|setConfig)$/
  , f = function (e) {
    var t = this;
    return reporter_a.call(t, e),
      // ...
      t.$aj(1e4),
      // ...
  };

// ...

fmp(f, util_r_win_s, c)

```

fmp_3.js

[MutationObserver](http://javascript.ruanyifeng.com/dom/mutationobserver.html)

#### 其他性能指标

index.js

``` javascript
function r (e, t) {
  var n = a[i] = new o(e);
  n.$ak(t);
  var r = n._conf;
  return !1 !== r.autoSendPv && n.$ar(),
    r && r.useFmp || n.$au(),
    r && r.sendResource && n.$b0(),
    a[s] = !0,
    n
}
```

handler_5.js   $au

``` javascript
{
  $au: function (e) {
      var t = this;
      t.$a2(function () {
        //  common.perf_8.js
        var n = o();
        n && (n.page = t.$a7(!0),
          e && (n = a.ext(n, e)),
          t._lg("perf", n, t.getConfig("sample")))
      })
  }
}
```


common.perf_8.js

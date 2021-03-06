## 介绍

用户行为分析，是指在获得网站或 APP 等平台访问量基本数据的情况下，对有关数据进行统计、分析，从中发现用户访问网站或 APP 等平台的规律，从而发现目前平台中可能存在的问题，并为进一步修正。用户行为分析离不开大量的数据采集，这便需要依赖对网站进行埋点，收集用户信息发给统计信息的服务端再次进行统计。  

此工具可以对用户 pv 、页面停留时间、页面点击事件上报，支持手动埋点、无埋点方式。

## 安装

### script 引入

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>use-analysis</title>
</head>
<body>
  <script src="../lib/uaTool.js"></script>
  <script>
    window.onload = function() {
      new UaTool({
        serverUrl: 'http://127.0.0.1:8801/logStash/push',
        isAutoTrackPv: true
      })
    }
  </script>
</body>
</html>
```

### es6 import 引入 (vue)

``` javascript
import UaTool from './uaTool'

const uaTool = new UaTool({
  serverUrl: 'http://10.67.9.191:8801/logStash/push',
  isAutoTrackPv: true
})

Object.defineProperty(Vue.prototype, '$uaTool', { value: uaTool })
```

## 配置参数

``` doc
clientId                       String     项目标识
serverUrl                      String     统计服务端 url
sendType                       String     请求类型 目前支持 ajax（默认） image
isSinglePage                   Boolean    是否为单页应用，默认（false）
isAutoTrackPv                  Boolean    是否自动上报 pv，默认（false）
isAutoTrackStay                Boolean    是否自动上报页面停留时间，默认（false）
isAutoTackClick                Boolean    是否使用自动埋点，默认（false）
trackElementTags               Array      自动埋点点监控的元素，默认：'a'、 'button'、 'input'、 'textarea'、'i', 可配合 html 标签 track-ignore 使用
autoTrackIgnoreClass           Array      无埋点忽略监控样式集合
useLocalTime                   Boolean    上报时间是否使用客户端时间，默认（true）
```

## 上报字段

``` doc
| 字段          | 类型       |  备注  |
| --------      | --------   | --------  
| type          |  String    |   操作类型 pageView, pageClose  
| uid           |   String   |   标识用户的唯一的字符串     
| sid           |   String   |   标识页面唯一的字符串  
| clientId      |   String   |   项目标识 
| clientTime    |   Long     |   上报时间  
| category      |   String   |   用户自定义  
| action        |   String   |   用户自定义  
| value         |   Obj      |   用户自定义，注意：value统一处理为String，value对象的key值不能包含day，time关键字，例如：**time  
| label         |   String   |   标签，用户自定义  
| userCode      |   String   |   用户编码,取cookie中的userCode  
| sessionId     |   String   |   sessionId, 取cookie中JSESSIONID  
| pageView      |   String   |   当前浏览页面  
| prevPage      |   String   |   上次浏览页面  
| urlPath       |   String   |   页面路径  
| stay          |   Number   |   页面停留时间，如2.77表示2.77秒  
| title         |   String   |   页面标题  
| vwidth        |   Number   |   视窗宽度，如1280  
| vheight       |   Number   |   视窗高度，如800 
| swidth        |   Number   |   视窗宽度，如1280  
| sheight       |   Number   |   视窗高度，如800 
| dpr           |   Number   |   物理像素分辨率与 CSS 像素分辨率的比率  
| ua            |   String   |   客户机发送服务器的 user-agent 头部值  
| appName       |   String   |   浏览器名称  
| appVer        |   String   |   浏览器版本  
| platform      |   String   |   平台  
| lang          |   String   |   浏览器语言  
| etype         |   String   |   元素类型 
| ename         |   String   |   元素 name 属性 
| eid           |   String   |   元素 Id 属性 
| eclassname    |   String   |   元素 class 属性 
| etargeturl    |   String   |   如果为 a 标签 对应的 href 属性 
| econtent      |   String   |   元素文本，如果为 i 标签文本内容为 title 
```


## 实现原理

### pv

#### 多页应用

多页应用的 pv 统计很直接，在页面加载后直接上报 pv 信息。

``` javascript
window.onload = function() {
  // ...
  var referrer = getReferrer()
  var params = extend({
    referrer: referrer,
    urlPath: location.pathname
    // ...
  }, {})
  sendEvent.track("pageView", params, this.config)
}
```

#### 单页应用

单页应用，页面加载初始化只有一次,目前主流的单页应用大部分都是基于 browserHistory (history api) 或者 hashHistory 来做路由处理，我们可以通过监听路由变化来判断页面是否有可能切换。

hashHistory
hash 的变化可以通过 hashchange 来监听。

browserHistory
history api 提供 onpopstate 事件监听浏览器前进后退的事件，但  History.pushState() 或 History.replaceState() 触发时 onpopstate 事件无法监听到。运行时重写 history.pushState 和 history.replaceState 。

``` javascript
let _wr =  function (type) {
  let orig = window.history[type]
  return  function () {
    let rv = orig.apply(this, arguments)
    let e = new Event(type.toLowerCase())
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}
window.history.pushState = _wr('pushState')
window.history.replaceState = _wr('replaceState')
window.addEventListener('pushstate',  function (event) {})
window.addEventListener('replacestate',  function (event) {})
```

这些事件监听到后直接上报 pv 信息。

### 停留时间

#### 多页应用

``` javascript

  window.addEventListener('load', function (data) {
      // 开始计时
  })

  window.addEventListener('beforeunload', function (data) {
      // 结束计时上报消息
  })

```

#### 单页应用

``` javascript
  // ...

  // supportsPushState 是否支持 history api
  if (supportsPushState) {
    window.addEventListener('onpopstate', function (data) {
    })
    // pushstate 或 replacestate
    window.addEventListener('historystatechange', function (data) {
    })
  } else  {
    window.addEventListener('hashchange', function (data) {
    })
  }

  // ...

  // 计时操作
  var startTime = new Date()
  var endTime = null
  var duration = null

  var setDuration = function (pageInfo) {
    if (startTime) {
      endTime = new Date()
      duration = (endTime.getTime() - startTime.getTime()) / 1000
      trackFn('pageClose', {
        stay: duration,
        url: pageInfo && pageInfo.from.length > 0 ? pageInfo.from.join('#') : window.location.href,
        title: document.title
      }, config)
      startTime = endTime
      endTime = null
    }
  }

```

### 页面事件

默认监听 'a', 'button', 'input', 'textarea', 'i' 等标签的点击事件。

## QA

### 手动埋点

#### script 引入

``` javascript
uaTool.track({
  action: 'CustomEvent',
  category: '',
  label: '',
  value: ''
})
```

#### es6 import 引入 (vue)

``` javascript
this.$uaTool.track({
  action: 'CustomEvent',
  category: '',
  label: '',
  value: ''
})
```

#### data-track-* 使用方法

当设置 `isAutoTackClick = true` 时可以使用 `data-track-*` ， 作用同上两个方法，标签属性设置手动埋点参数代码如下：

``` html
<button data-track-action="CustomEvent" data-track-label="" data-track-value="" data-track-categoty=""></button>
```
ps: 监控的元素范围为 `trackElementTags` 所设置的元素，默认元素有 'a'、 'button'、 'input'、 'textarea'、'i'


### track-ignore

无埋点模式下（isAutoTackClick = true），使用 track-ignore 属性添加到元素标签上可以忽略 sdk 上报。

```html
<button track-ignore="1">button-test</button>
```

### npm script 命令说明

```
dev                      sdk 开发模式 、监控文件变化并生成 sourcemap
build                    sdk 生产模式
demo-server              上报收集服务
demo-page                上报示例页面
demo-analysis            数据分析页面
lint                     eslint
lint-fix                 eslint fix
lint-staged              配合 husky 使用 git commit 时的钩子
```
---
layout: post
title: 'SkyWalking Client JS 源码分析'
date: '2021-05-15'
author: 'XuBaoshi'
header-img: 'img/node-module.jpg'
---

<a name="x78qw"></a>
## 简介
​

Apache SkyWalking Client-side JavaScript exception and tracing library.

- Provide metrics and error collection to SkyWalking backend.
- Lightweight
- Make browser as a start of whole distributed tracing

​<br />
<a name="W85VW"></a>
## 客户端初始化


<a name="GoEtZ"></a>
### 下载
​<br />
```shell
npm install skywalking-client-js --save
```


<a name="FbqvR"></a>
### 初始化


```javascript
import ClientMonitor from 'skywalking-client-js';

ClientMonitor.register({
  collector: 'http://127.0.0.1:8080',
  service: 'test-ui',
  pagePath: '/current/page/name',
  serviceVersion: 'v1.0.0',
});
```


<a name="sKLb5"></a>
## 源码目录

<br />![/img/skywalking/1.png](/img/skywalking/1.png)<br />
<br />

<a name="esJVs"></a>
## 入口文件分析

<br />该项目的入口文件为 `src/index.ts` 但其内部实际上只是引用了 `src/monitor.ts` 并将其暴露出去。<br />​<br />
```typescript
import ClientMonitor from './monitor';

(window as any).ClientMonitor = ClientMonitor;

export default ClientMonitor;
```

<br />`src/monitor.ts`
```javascript
import { CustomOptionsType, CustomReportOptions } from './types';
import { JSErrors, PromiseErrors, AjaxErrors, ResourceErrors, VueErrors, FrameErrors } from './errors/index';
import tracePerf from './performance/index';
import traceSegment from './trace/segment';

const ClientMonitor = {
 
  // ...

  register(configs: CustomOptionsType) {
    // 1. 合并 options
    this.customOptions = {
      ...this.customOptions,
      ...configs,
    };
    // 2. 错误处理
    this.catchErrors(this.customOptions);
    // 3. performenc处理
    if (!this.customOptions.enableSPA) {
      this.performance(this.customOptions);
    }

    // 4. api 监控
    traceSegment(this.customOptions);
  },
  performance(configs: any) {
    // trace and report perf data and pv to serve when page loaded
    if (document.readyState === 'complete') {
      tracePerf.recordPerf(configs);
    } else {
      window.addEventListener(
        'load',
        () => {
          tracePerf.recordPerf(configs);
        },
        false,
      );
    }
    if (this.customOptions.enableSPA) {
      // hash router
      window.addEventListener(
        'hashchange',
        () => {
          tracePerf.recordPerf(configs);
        },
        false,
      );
    }
  },
  catchErrors(options: CustomOptionsType) {
    const { service, pagePath, serviceVersion, collector } = options;

    if (options.jsErrors) {
      JSErrors.handleErrors({ service, pagePath, serviceVersion, collector });
      PromiseErrors.handleErrors({ service, pagePath, serviceVersion, collector });
      if (options.vue) {
        VueErrors.handleErrors({ service, pagePath, serviceVersion, collector }, options.vue);
      }
    }
    if (options.apiErrors) {
      AjaxErrors.handleError({ service, pagePath, serviceVersion, collector });
    }
    if (options.resourceErrors) {
      ResourceErrors.handleErrors({ service, pagePath, serviceVersion, collector });
    }
  },
  setPerformance(configs: CustomOptionsType) {
    // history router
    this.customOptions = {
      ...this.customOptions,
      ...configs,
    };
    this.performance(this.customOptions);
  },
  reportFrameErrors(configs: CustomReportOptions, error: Error) {
    FrameErrors.handleErrors(configs, error);
  },
};

export default ClientMonitor;
```
<a name="dEmBS"></a>
## 
<a name="B4Ckm"></a>
## 错误监控

<br />`src/monitor.ts`
```javascript
// ...

import { JSErrors, PromiseErrors, AjaxErrors, ResourceErrors, VueErrors, FrameErrors } from './errors/index';

// ...

register(configs: CustomOptionsType) {
    this.customOptions = {
      ...this.customOptions,
      ...configs,
    };
    this.catchErrors(this.customOptions);
  	
    // ...
},
  catchErrors(options: CustomOptionsType) {
    const { service, pagePath, serviceVersion, collector } = options;

    if (options.jsErrors) {
      JSErrors.handleErrors({ service, pagePath, serviceVersion, collector });
      PromiseErrors.handleErrors({ service, pagePath, serviceVersion, collector });
      if (options.vue) {
        VueErrors.handleErrors({ service, pagePath, serviceVersion, collector }, options.vue);
      }
    }
    if (options.apiErrors) {
      AjaxErrors.handleError({ service, pagePath, serviceVersion, collector });
    }
    if (options.resourceErrors) {
      ResourceErrors.handleErrors({ service, pagePath, serviceVersion, collector });
    }
  },
```


<a name="fG33S"></a>
### JSErrors
`src/errors/js.ts`
```javascript
// ...

class JSErrors extends Base {
  public handleErrors(options: { service: string; serviceVersion: string; pagePath: string; collector: string }) {
    window.onerror = (message, url, line, col, error) => {
      this.logInfo = {
        uniqueId: uuid(),
        service: options.service,
        serviceVersion: options.serviceVersion,
        pagePath: options.pagePath,
        category: ErrorsCategory.JS_ERROR,
        grade: GradeTypeEnum.ERROR,
        errorUrl: url,
        line,
        col,
        message,
        collector: options.collector,
        stack: error.stack,
      };
      this.traceInfo();
    };
  }
}
export default new JSErrors();
```
以上通过 `window.onerror` 监听 js 报错。<br />
<br />traceInfo 方法实现的逻辑如下：
```javascript
public traceInfo() {
  // ...
	
  // 1. 记录错误
  this.handleRecordError();
  // 2. 发送错误
  setTimeout(() => {
    Task.fireTasks();
  }, 100);
}
```

1. 记录错误
```javascript
private handleRecordError() {
  try {
    if (!this.logInfo.message) {
      return;
    }
    const errorInfo = this.handleErrorInfo();
    
    // 1.1 Task 示例添加错误信息
    Task.addTask(errorInfo);
  } catch (error) {
    throw error;
  }
}

private handleErrorInfo() {
    let message = `error category:${this.logInfo.category}\r\n log info:${this.logInfo.message}\r\n
      error url: ${this.logInfo.errorUrl}\r\n `;

    switch (this.logInfo.category) {
      case ErrorsCategory.JS_ERROR:
        message += `error line number: ${this.logInfo.line}\r\n error col number:${this.logInfo.col}\r\n`;
        break;
      default:
        message;
        break;
    }
    const recordInfo = {
      ...this.logInfo,
      message,
    };
    return recordInfo;
}
```


2. 发送错误

上报及收集信息由 `src/services/task.ts` 完成<br />​

![/img/skywalking/2.png](/img/skywalking/2.png)<br />Report 类内部封装了 fetch 及 xmlHttpRequest 两种上报方式,一下不再赘述。
<a name="lM3v1"></a>
### VueErrors
`src/errors/vue.ts`<br />
<br />vue 内部的错误都被 catch 到了 ，`window.onerror` 无法监控到， 需要使用 `Vue.config.errorHandler`  捕获到错误并发送错误信息。<br />​<br />
```javascript
// ...

class VueErrors extends Base {
  public handleErrors(
    options: { service: string; pagePath: string; serviceVersion: string; collector: string },
    Vue: any,
  ) {
    Vue.config.errorHandler = (error: Error, vm: any, info: string) => {
      try {
        this.logInfo = {
          uniqueId: uuid(),
          service: options.service,
          serviceVersion: options.serviceVersion,
          pagePath: options.pagePath,
          category: ErrorsCategory.VUE_ERROR,
          grade: GradeTypeEnum.ERROR,
          errorUrl: location.href,
          message: info,
          collector: options.collector,
          stack: error.stack,
        };
        this.traceInfo();
      } catch (error) {
        throw error;
      }
    };
  }
}

export default new VueErrors();
```
​<br />
<a name="NOln7"></a>
### PromiseErrors
```javascript
function forgetCatchError () {
  async()
    .then(() => {
      // code..
    })
    .then(() => console.log('forget catch error!'));
}
```
上面的示例代码中 async() 中和后续的两个 then 中的代码如果出错或者 reject ，错误没有得到处理。在没有使用 catch 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。当promise被 reject 并且错误信息没有被处理的时候，会抛出 unhandledrejection，这个错误不会被 window.onerror 和 addEventListener("error") 所监听到。<br />​

`src/errors/promise.ts`<br />​<br />
```javascript

// ...

class PromiseErrors extends Base {
  public handleErrors(options: { service: string; serviceVersion: string; pagePath: string; collector: string }) {
    window.addEventListener('unhandledrejection', (event) => {
      try {
        // ...
        
        this.logInfo = {
          // ...
        };
        this.traceInfo();
      } catch (error) {
        console.log(error);
      }
    });
  }
}
export default new PromiseErrors();
```
<a name="FjTif"></a>
### AjaxErrors
`src/errors/ajax.ts`<br />

```javascript
// ...
// 1. 原生的 send 方法
const xhrSend = XMLHttpRequest.prototype.send;
const xhrEvent = (event: any) => {
  try {
    if (event && event.currentTarget && (event.currentTarget.status >= 400 || event.currentTarget.status === 0)) {
      this.logInfo = {
       // ...
      };
      this.traceInfo();
    }
  } catch (error) {
    console.log(error);
  }
};

// 2. 重写 XMLHttpRequest 中 send 方法， 添加内部自定义事件并调用远程的 send 方法
XMLHttpRequest.prototype.send = function () {
  if (this.addEventListener) {
    this.addEventListener('error', xhrEvent);
    this.addEventListener('abort', xhrEvent);
    this.addEventListener('timeout', xhrEvent);
  } else {
    const stateChange = this.onreadystatechange;
    this.onreadystatechange = function (event: any) {
      stateChange.apply(this, arguments);
      if (this.readyState === 4) {
        // 3. 重新调用原生的 send 方法
        xhrEvent(event);
      }
    };
  }
  return xhrSend.apply(this, arguments);
};

// ...
```
<a name="X2OSA"></a>
### ResourceErrors
`src/errors/resource.ts`<br />​<br />
```javascript
// ....
// 1.
window.addEventListener('error', (event) => {
  try {
    if (!event) {
      return;
    }
    const target: any = event.target || event.srcElement;
    const isElementTarget =
          target instanceof HTMLScriptElement ||
          target instanceof HTMLLinkElement ||
          target instanceof HTMLImageElement;

    if (!isElementTarget) {
      // return js error
      return;
    }
    this.logInfo = {
      uniqueId: uuid(),
      service: options.service,
      serviceVersion: options.serviceVersion,
      pagePath: options.pagePath,
      category: ErrorsCategory.RESOURCE_ERROR,
      grade: target.tagName === 'IMG' ? GradeTypeEnum.WARNING : GradeTypeEnum.ERROR,
      errorUrl: target.src || target.href || location.href,
      message: `load ${target.tagName} resource error`,
      collector: options.collector,
      stack: `load ${target.tagName} resource error`,
    };
    this.traceInfo();
  } catch (error) {
    throw error;
  }
});
```
​<br />
<a name="J059E"></a>
#### window.onerror 与 window.addEventListener('error', **function**(event) { ... }) 区别

1. window.onerror 

window.onerror是一个全局变量，默认值为null。当有js运行时错误触发时，window会触发error事件，并执行window.onerror()。onerror可以接受多个参数。<br />​<br />

- message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
- source：发生错误的脚本URL（字符串）
- lineno：发生错误的行号（数字）
- colno：发生错误的列号（数字）
- error：Error对象


<br />若该函数返回true，则阻止执行默认事件处理函数，如异常信息不会在console中打印。<br />没有返回值或者返回值为false的时候，异常信息会在console中打印。<br />​

 2. window.addEventListener<br />​

监听js运行时错误事件，会比window.onerror先触发，与onerror的功能大体类似，不过事件回调函数传参只有一个保存所有错误信息的参数，不能阻止默认事件处理函数的执行，但**可以全局捕获资源加载异常的错误**。<br />​

当资源（如img或script）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，但可以在捕获阶段被捕获 因此如果要全局监听资源加载错误，需要在捕获阶段捕获事件。<br />​<br />
<a name="YacSM"></a>
## api 监控

<br />`src/monitor.ts`<br />​<br />
```javascript
// ...

import traceSegment from './trace/segment';

// ...

register(configs: CustomOptionsType) {
    this.customOptions = {
      ...this.customOptions,
      ...configs,
    };
  
    // ...

    traceSegment(this.customOptions);
}

// ...
```

<br />`src/trace/segment.ts`<br />![/img/skywalking/3.png](/img/skywalking/3.png) <br />
<br />上面的代码中引入  interceptors/xhr.ts 及  interceptors/fetch.ts 文件对 xmlhttprequest 及 fetch 的监控。<br />

<a name="SJbhy"></a>
### interceptors/xhr.ts


<a name="g8q5L"></a>
#### 重写 原生 XMLHttpRequest 

<br />![/img/skywalking/4.png](/img/skywalking/4.png)<br />
<br />上面的代码主要做了 XMLHttpRequest 做了二次封装，并将 window 的原始 XMLHttpRequest 方法进行了重新赋值。其中内部的 customizedXHR 方法中：<br />
<br />![/img/skywalking/5.png](/img/skywalking/5.png)<br />
<br />上述方法中监听了 XMLHttpRequest  readystatechange 事件，并触发了通过 ` const ajaxEvent = new CustomEvent(event, { detail: this })` 定义的自定义事件 `xhrReadyStateChange`。<br />
<br />其中将涉及到的参数存入到 `getRequestConfig` 中：<br />
<br />![/img/skywalking/6.png](/img/skywalking/6.png)<br />以上就是为了能暂存请求参数及配置。<br />

<a name="QmZh1"></a>
#### 触发 xhrReadyStateChange 事件

1.  初始化对象及处理 url

![/img/skywalking/7.png](/img/skywalking/7.png)

2. 判断当前接口是否在不跟踪的接口列表内

![/img/skywalking/8.png](/img/skywalking/8.png)

3. 排除不需要上报的接口地址以及追踪开关是否开启

![/img/skywalking/9.png](/img/skywalking/9.png)

4. 当  XMLHttpRequest  中  readyState 为 1 时，即表示已调用send()方法正在向服务端发送请求，此时生成  traceId 、接口开始时间、数据并设置请求头、segCollector 数组增加一个新的对象如下：

![/img/skywalking/10.png](/img/skywalking/10.png)

5. 当  XMLHttpRequest  中  readyState 为 4 时 表示请求完成， 遍历 segCollector 如果中的对象满足 `segCollector[i].event.readyState === 4` 构建 exitSpan 对象并存储到 segent 对象上并在 segCollector  剔除掉。


<br />![/img/skywalking/11.png](/img/skywalking/11.png)<br />

<a name="Q3QBO"></a>
#### 上报收集到的消息


1.  监听浏览器  `onbeforeunload ` 事件后统一将收集到的信息上报上去。


<br />![/img/skywalking/12.png](/img/skywalking/12.png)

2. 定时发送

![/img/skywalking/13.png](/img/skywalking/13.png)<br />

<a name="LVrlS"></a>
## Performance
`src/monitor.ts`
```javascript
performance(configs: any) {
  // trace and report perf data and pv to serve when page loaded
  if (document.readyState === 'complete') {
    tracePerf.recordPerf(configs);
  } else {
    window.addEventListener(
      'load',
      () => {
        tracePerf.recordPerf(configs);
      },
      false,
    );
  }
  if (this.customOptions.enableSPA) {
    // hash router
    // 针对单页应用监控
    window.addEventListener(
      'hashchange',
      () => {
        tracePerf.recordPerf(configs);
      },
      false,
    );
  }
}
```
<a name="saqzE"></a>
### document.readyState

<br />0-UNINITIALIZED：XML 对象被产生，但没有任何文件被加载。<br />1-LOADING：加载程序进行中，但文件尚未开始解析。<br />2-LOADED：部分的文件已经加载且进行解析，但对象模型尚未生效。<br />3-INTERACTIVE：仅对已加载的部分文件有效，在此情况下，对象模型是有效但只读的。<br />4-COMPLETED：文件已完全加载，代表加载成功。<br />​<br />
<a name="YeZiK"></a>
### window.addEventListener('load', () => {})

1. **html 文档中的图片资源，js 代码中有异步加载的 css、js 、图片资源都加载完毕之后**

window.onload = function() { } 传统事件只能执行一次<br />window.addEventListener('load' , function() { })<br />​<br />

2. **HTML 文档被完全加载和解析完成，无需等待样式表、图像和子框架的完成加载之后**

document.addEventListener('DOMContentLoaded',funtion( ) { } )  与jQuery的 ready( ) 方法同理。<br />​<br />
```javascript
$( document ).ready(function() {
    console.log( "ready!" );
});
```
[参考链接](https://www.cnblogs.com/gg-qq/p/11327972.html)<br />​

`src/performance/perf.ts`
```javascript
// ...

const { timing } = window.performance;
let redirectTime = 0;

if (timing.navigationStart !== undefined) {
  redirectTime = parseInt(String(timing.fetchStart - timing.navigationStart), 10);
} else if (timing.redirectEnd !== undefined) {
  redirectTime = parseInt(String(timing.redirectEnd - timing.redirectStart), 10);
} else {
  redirectTime = 0;
}

return {
  // 重定向时间
  redirectTime,
  // DNS解析时间
  // DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长
  // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
  dnsTime: parseInt(String(timing.domainLookupEnd - timing.domainLookupStart), 10),
  // 读取页面第一个字节的时间
  // 可以理解为用户拿到你的资源占用的时间
  ttfbTime: parseInt(String(timing.responseStart - timing.requestStart), 10), // Time to First Byte
  // TCP完成握手时间
  tcpTime: parseInt(String(timing.connectEnd - timing.connectStart), 10),
  // HTTP请求响应完成时间
  transTime: parseInt(String(timing.responseEnd - timing.responseStart), 10),
  // DOM结构解析完成时间
  domAnalysisTime: parseInt(String(timing.domInteractive - timing.responseEnd), 10),
  // 首次刷新或白屏时间
  fptTime: parseInt(String(timing.responseEnd - timing.fetchStart), 10), // First Paint Time or Blank Screen Time
  // domready时间
  domReadyTime: parseInt(String(timing.domContentLoadedEventEnd - timing.fetchStart), 10),
  // 页面完整加载时间
  // 这几乎代表了用户等待页面可用的时间
  loadPageTime: parseInt(String(timing.loadEventStart - timing.fetchStart), 10), // Page full load time
  //  资源请求耗时
  resTime: parseInt(String(timing.loadEventStart - timing.domContentLoadedEventEnd), 10),
  // TLS的验证时间(https)
  sslTime:
  location.protocol === 'https:' && timing.secureConnectionStart > 0
  ? parseInt(String(timing.connectEnd - timing.secureConnectionStart), 10)
  : undefined,
  // 用户可交互事件
  ttlTime: parseInt(String(timing.domInteractive - timing.fetchStart), 10), // time to interact
  // 第一个包的时间
  firstPackTime: parseInt(String(timing.responseStart - timing.domainLookupStart), 10), // first pack time
  fmpTime: 0, // First Meaningful Paint
};


// ...
```
<a name="Pw1xa"></a>
### 

<br />​


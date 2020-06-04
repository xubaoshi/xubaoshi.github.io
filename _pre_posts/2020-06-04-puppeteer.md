---
layout: post
title: 'Puppeteer 前端自动化测试实践'
date: '2020-06-04'
author: 'XuBaoshi'
header-img: 'img/node-module.jpg'
---

# puppeteer 前端自动化测试实践

## puppeteer 简介

![/img/puppeteer/puppeteer.jpg](/img/puppeteer/puppeteer.jpg)

puppeteer 中文翻译为操纵木偶的人，谷歌浏览器在 17 年自行开发了 Chrome Headless 特性，并与之同时推出了 puppeteer， 可以理解为我们日常使用的 Chrome 的无界面版本以及对其进行操控的 js 接口套装。

使用 puppeteer 实际上是通过调用 Chrome DevTools 开放的接口与 Chrome 通信。 Chrome DevTools 的接口很复杂， puppeteer 为此封装了一些调用方便的接口供使用。

## [Chrome DevTool Protocol](https://chromedevtools.github.io/devtools-protocol/)

1. 基于 websocket 实现与浏览器内核的快速数据通道
2. 协议中分为多个域如：DOM、Debugger、NetWork、Profiler、Console 等等。每个域中都定义了相关的命令和事件
3. 业界内的 [ Chrome 开发者工具](https://developers.google.cn/web/tools/chrome-devtools/)、[puppeteer](https://github.com/GoogleChrome/puppeteer/) 都是基于 Chrome DevTool Protocol 实现的

## Headless Chrome

1. 在无界面的环境中运行 Chrome
2. 通过命令行或者程序语言操作 Chrome

操作系统 win10：

访问页面并截图

```shell
"C:\Users\baoshi\AppData\Local\Google\Chrome\Application\chrome" --headless --disable-gpu --screenshot=H:\output.png https://www.baidu.com
```

![/img/puppeteer/headless1.png](/img/puppeteer/headless1.png)

访问页面并将页面输出为 pdf 文件

```shell
 "C:\Users\baoshi\AppData\Local\Google\Chrome\Application\chrome" --headless --disable-gpu --print-to-pdf=H:\output.pdf https://www.baidu.com
```

![/img/puppeteer/headless2.png](/img/puppeteer/headless2.png)

访问页面并下载页面 dom

```shell
 "C:\Users\baoshi\AppData\Local\Google\Chrome\Application\chrome" --headless --disable-gpu --dump-dom https://www.baidu.com
```

![/img/puppeteer/headless3.png](/img/puppeteer/headless3.png)

开启远程调试

```shell
 "C:\Users\baoshi\AppData\Local\Google\Chrome\Application\chrome" --headless --remote-debugging-port=9222 --disable-gpu
```

![/img/puppeteer/headless4.png](/img/puppeteer/headless4.png)

![/img/puppeteer/headless5.png](/img/puppeteer/headless5.png)

## puppteer 能做什么

1. puppteer 通过封装了 Chrome DevTools Protocol 的接口，从而控制 Chromium/Chrome 浏览器的行为
2. puppteer 默认以 headless 模式启动 Chrome，可以通过设计参数启动有界面的 Chrome
3. 网页截图或者生成 PDF
4. 爬取 SPA 或 SSR 网站
5. UI 自动化测试，模拟表单提交，键盘输入，点击等行为
6. 捕获网站的时间线，帮助诊断性能问题
7. 创建一个最新的自动化测试环境，使用 js 和 Chrome 浏览器运行测试用例
8. ......

## puppeteer API 分层结构

![/img/puppeteer/tree.png](/img/puppeteer/tree.png)

puppeteer 涉及的主要概念如下：

1. Browser 对应一个浏览器实例， 一个 Browser 可以包含多个 BrowserContext
2. BrowserContext 对应一个浏览器的上下文 可以理解为一个浏览器的窗口， 比如有的时候我们会同时打开一个普通的窗口和一个无痕的窗口。其中 BrowserContext 之间 Session 、Cookie 等都是相互独立的互不影响。 一个 BrowserContext 包含多个 Page。
3. Page 表示一个 Tab 页面， 可以通过 `browserContext.newPage()/browser.newPage()` 创建， 区别在于 `browser.newPage()` 会调用默认的 `browserContext` 创建。一个 Page 包含多个 Frame
4. Frame 一个框架 可以理解为 html 中的 iframe 标签
5. ExecutionContext 是 javascript 的执行环境
6. ElementHandle 对应 DOM 的一个元素节点， 通过该实例可以实现对元素的点击及填写表单等行为。可以通过选择器或 xpath 获取对应的元素
7. JSHandle 表示一个页面内 JavaScript 对象。 JSHandles 可以使用 page.evaluateHandle 方法创建。， ElementHandle 继承自 JsHandle
8. CDPSession 可以直接与原生的 Chrome DevTools Protocol 通信，通过 `session.send` 调用及 `session.on` 方法订阅
9. Coverage 收集相关页面使用的 javascript 及 css 信息
10. Tracing 抓取性能数据进行分析， 通过使用 `tracing.start` 和 `trace.stop` 创建一个可以在 Chrome DevTools 或者 timeline viewer 中打开的跟踪文件
11. Request 页面收到的响应 可以基于 `page.on('request',() => {})` 监听页面的请求
12. Response 页面发出的请求 可以基于 `page.on('reponse',() => {})` 监听页面的返回结果

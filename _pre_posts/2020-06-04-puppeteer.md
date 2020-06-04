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

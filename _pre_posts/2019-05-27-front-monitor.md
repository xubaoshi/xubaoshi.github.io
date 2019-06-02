---
layout: post
title: 'arms前端监控源码分析'
date: '2019-05-27'
author: 'XuBaoshi'
header-img: 'img/node-module.jpg'
---

# 阿里 arms 前端监控（web 场景）源码分析

ARMS 前端监控平台专注于 Web 端体验数据监控，从页面打开速度（测速）、页面稳定性（JS Error）和外部服务调用成功率（API）这三个方面监测 Web 页面的健康度。

## 功能说明

### 页面访问速度

#### 页面加载瀑布图

DNS 查询  
TCP 连接  
请求响应  
内容传输  
DOM 解析  
资源加载

#### 关键性能指标

首次渲染  
首屏时间  
首次可交互  
DOM Ready  
页面完全加载时间

#### html performance

performance 是 html5 的新特性之一，通过它页面的开发者们可以非常精确的统计到自己页面的表现情况。

![https://images2015.cnblogs.com/blog/1025895/201705/1025895-20170515171943869-544403857.png](https://images2015.cnblogs.com/blog/1025895/201705/1025895-20170515171943869-544403857.png) 

[performance api 说明](https://www.cnblogs.com/bldxh/p/6857324.html)


### API 请求监控

API 的成功率  
返回信息  
接口的调用成功平均耗时  
接口的调用失败平均耗时

### 性能样本分布

### 慢页面会话追踪

### 地理分布和终端分布

### JS 错误诊断及 JS 错误统计

JS 错误率 = 指定时间内发生 JS 错误的 PV / 总 PV

#### 错误关键信息

上报时间  
日志类型  
页面地址  
浏览器  
设备  
地域  
Tag  
UA(User Agent)  
Param 参数  
Message(信息）  
Stack(错误栈信息)  
File(错误文件)  
Line/Col(错误位置）

## 使用方法

## api 说明

## 源码分析

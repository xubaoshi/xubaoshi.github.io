---
layout: post
title: 'web 端用户行为统计'
date: '2019-08-10'
author: 'XuBaoshi'
header-img: 'img/post-bg-06.jpg'
---

# 用户行为分析

## 简介

用户行为分析，是指在获得网站或 APP 等平台访问量基本数据的情况下，对有关数据进行统计、分析，从中发现用户访问网站或 APP 等平台的规律，，从而发现目前平台中可能存在的问题，并为进一步修正。

## 分析模型

### 行为事件分析模型

行为事件分析模型主要来研究某行为事件的发生对企业组织价值的影响以及影响程度。例如：定义加入购物车入口、商品订单、使用优惠券、提交订单、支付订单、分享商品、浏览商品、联系客服、点击推广栏、领取优惠券等事件。

![/img/user-behavior/event.png](/img/user-behavior/event.png)

### 用户留存分析模型

评估产品更新效果或渠道推广效果，我们常常需要对同期进入产品或同期使用了产品某个功能的用户的后续行为表现进行评估。例如：把完成了“注册”行为的用户才视为产品的新客，且进行了“支付订单”的行为才视为用户留存。

![/img/user-behavior/user.png](/img/user-behavior/user.png)

### 漏斗分析模型

漏斗分析模型是一套流程式数据分析模型，它能够科学反映用户行为状态以及从起点到终点各阶段用户转化率情况的重要分析模型。例如：典型的用户购买行为由以下连续的行为构成： 浏览首页、浏览商品、提交订单、支付订单。

![/img/user-behavior/hopper.png](/img/user-behavior/hopper.png)

### 行为路径分析模型

用户在 APP 或网站中的访问行为路径。例如：买家从登录网站／APP 到支付成功要经过首页浏览、搜索商品、加入购物车、提交订单、支付订单等过程。而在用户真实的选购过程是一个交缠反复的过程，例如提交订单后，用户可能会返回首页继续搜索商品，也可能去取消订单，每一个路径背后都有不同的动机。

![/img/user-behavior/path.png](/img/user-behavior/path.png)

### 用户分群

通过漏斗分析模型，可以看到用户在不同阶段所表现出的行为是不同的。由于群体特征不同，行为会有很大差别，将具有一定规律特性的用户群体进行归类，进而再次观察该群体的具体行为。这就是用户分群的原理。例如：某平台统计高活跃客户这个群体对应的对其进行分群，定义后展开数据分析。

![/img/user-behavior/group.png](/img/user-behavior/group.png)

### 点击分析模型

点击分析具有分析过程高效、灵活、易用，效果直观的特点。采用可视化的设计，直观呈现访客热衷的区域，帮助评估网页的设计的科学性。

![/img/user-behavior/click.png](/img/user-behavior/click.png)

## 埋点技术

### 如何埋点（web）

如果想统计用户的行为，便需要收集大量用户的操作行为，这便需要依赖对网站进行埋点，收集用户信息发给统计信息的服务端再次进行统计。

无论使用何种用户行为工具，如 CNZZ 、Google Analytics (ga) 、 Mixpanel 、GrowingIO 等用户行为分析的工具，都必须在网站内部引入埋点 js，引入位置一般放置在页面的 head 或 body 处，如 ga ：

![/img/user-behavior/how.png](/img/user-behavior/how.png)

### 用户行为信息（web）

通过埋点 js 可以统计如下用户信息

```
域名
页面标题
分辨率
颜色深度
Referrer
客户端语言
页面停留时间点击事件链接跳转视窗停留时间
........
```

### 代码埋点

用预先写好的代码埋在事件交互的代码中发送数据。如：web 端 我们想统计 A 页面某个按钮的点击次数，则在某个按钮被点击时调用埋点所属 js 暴露出的方法，发送请求给统计服务端。

![/img/user-behavior/code.png](/img/user-behavior/code.png)

#### 代码埋点（单页 vs 多页）

如统计页面 pv 时，传统应用，一般都在页面加载的时候，都会统计到数据，然而在单页应用，页面加载初始化只有一次，所以其它页面的统计数据需要我们自己手动上报。

![/img/user-behavior/mult.png](/img/user-behavior/mult.png)

![/img/user-behavior/single.png](/img/user-behavior/single.png)

#### 代码埋点（Vue）

![/img/user-behavior/vue.png](/img/user-behavior/vue.png)

#### 总结

优点：精准控制， 准确的发送数据，可以自定义事件、属性，传递丰富的数据到服务端。  
缺点：埋点代价比较大，每一个控件的埋点都需要添加相应的代码，不仅工作量大，而且限定了必须是技术人员才能完成；其次是更新的代价比较大，每一次更新埋点方案，都必须改代码。

### 可视化埋点

通过埋点配置后台，将元素与要采集事件关联起来，可以自动生成埋点代码嵌入到页面中。（前提页面必须引入埋点 js），在配置后台输入网站页面地址。

![/img/user-behavior/seePage.png](/img/user-behavior/seePage.png)

![/img/user-behavior/seeEvent.png](/img/user-behavior/seeEvent.png)

#### 可视化埋点（原理）

xpath 来标识页面元素、控件的唯一性。  
xpath:一种规范格式，定义了访问 xml 节点的方式， dom 使用这个这种规范格式访问节点。  
xpath 格式: /html/body/div

![/img/user-behavior/path.png](/img/user-behavior/path.png)

埋点配置后台，通过 iframe 将目标页面加载进来，对页面进行了 hover click 等事件的二次处理。跨域方式通过使用 html5 postMessage 。

![/img/user-behavior/seeIframe1.png](/img/user-behavior/seeIframe1.png)

![/img/user-behavior/seeIframe2.png](/img/user-behavior/seeIframe2.png)

#### 总结

优点：业务方工作量少,埋点 js 引入后，运营或产品人员就可以进行埋点操作。  
缺点：技术上推广和实现起来有点难，如果面对频繁更新的网站，页面结构发成改变，会造成埋点信息采集不到，需要重新进行埋点设置。

### 无埋点

无埋点则是前端自动采集全部事件，上报埋点数据，由后端来过滤和计算出有用的数据。（前提页面必须引入埋点 js）。  
原理对页面所有事件都进行一遍监控，检测到变化时需要重新向数据收集端发送请求。

![/img/user-behavior/noCode.png](/img/user-behavior/noCode.png)

![/img/user-behavior/noCode1.png](/img/user-behavior/noCodeHttp.png)

#### 总结

优点： 前端只要加载埋点脚本，统计更加详细。在某一天，突然想增加某个控件的点击的分析，如果是框架式埋点方案，则只能从这一时刻向后收集数据，而如果是“无埋点”，则从部署 SDK 的时候数据就一直都在收集了。  
缺点：流量和采集的数据过于庞大，服务器性能压力大。不能灵活地自定义属性，传输时效性和数据可靠性欠佳。

## 分析工具介绍

### 页面浏览（PV）和会话（Session）

在传统的 Web 时代，通常使用 PV（页面访问量）来衡量和分析一个产品的好坏。ga、cnzz 、百度统计发布相对较早的统计工具，目前均是免费使用。以传统的页面浏览（PV）和会话（Session）为核心。现在也可以手动添加事件（Event）和自定义属性。埋点方式目前只支持代码埋点。每个统计工具的统计数据的准确性都会有些许不同。

ga：https://analytics.google.com 统计时也不受墙的影响，只有分析的时候需要翻墙  
cnzz：https://www.umeng.com  
百度统计：https://tongji.baidu.com

### 事件模型

采用事件模型作为基本的数据模型，在事件分析、漏斗、留存、回访等分析功能上，维度和指标都是可以完全自定义的，分析功能非常灵活和强大。

mixpanel: https://mixpanel.com  
heap: https://heap.io  
growingio: https://growingio.com  
神策: https://www.sensorsdata.cn  
TalkingData: https://www.talkingdata.com  
诸葛 io: https://zhugeio.com

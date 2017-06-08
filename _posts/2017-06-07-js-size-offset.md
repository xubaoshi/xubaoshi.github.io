---
layout:     post
title:      "2017-06-07-js元素尺寸及偏移量总结"
date:       "2017-06-07 "
author:     "XuBaoshi"
header-img: "img/post-bg-02.jpg"
---

# js元素尺寸及偏移量总结 #

## 浏览器视窗大小 ##

	function getViewport(){
		if(document.compatMode === 'BackCompat'){
			// ie7 之前			
			return {
				width:document.body.clientWidth,
				height:document.body.clentHeight
			}
		} else {
			return {
				width:document.documentElement.clientWidth,
				height:document.documentElement.clientHeight
			}
		}
	}	

## 定位父级 ##
offsetParent可以理解为当前元素经过定位的(position!= static)最近的上级元素。<br>
1 如果当前元素(position=fixed),offsetParent结果为null;<br>
2 如果当前的元素的上级position都为static，则offsetParent结果为body元素<br>

	<body>
		<div id="wrap" style="position:relative;">
			<div class="fold">
				<p id="artical">artical</p>
			</div>
		</div>	
	</body>
	
	// offsetParent
	document.getElementById('artical').offsetParent();  // #wrap

	// jquery
	$('#artical').offsetParent();


## offsetTop 与 jquery $(dom).offset().top ##
offsetTop可以理解为当前元素到经过定位的(position!= static)最近的上级元素距离。<br>
jquery $(dom).offset().top可以理解为当前元素至document的高度。<br>

	<body>
		<div id="wrap" style="position:relative;">
			<div class="fold">
				<p id="artical">artical</p>
			</div>
		</div>	
	</body>
	
	// offsetParent
	document.getElementById('artical').offsetTop();  // 距离#wrap的高度

	// jquery
	$('#artical').offset().top();  // 距离document的高度

同理offsetLeft 与 jquery $(dom).offset().left

## scroll相关 ##
1. scrollHeight 没有滚动条的情况下，元素内容的高度
2. scrollWidth 没有滚动条的情况下，元素内容的宽度
3. scrollTop 被隐藏在内容区域上方的像素数，包括元素上边框
4. scrollLeft 被隐藏在内容区域左侧的像素数，包括元素左边框

## 确定文档高度 ##
保证跨浏览器的环境下得到精确地结果，要确保取 scrollWidth/clientWidth 和scrollHeight/clientHeight中的最大值。

	var docHeight = Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight)
	var docWidth = Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth)

对于ie7及以下浏览器`document.documentElement`应该更换为`document.body`
## getComputedStyle ##
getComputedStyle获取当前元素所有最终使用的css属性值。
	
	var dom = document.getElementById('test');
	var style = window.getComputedStyle(dom,':after');

	// 如果不是伪类
	var style = window.getComputedStyle(dom,null);

该方法兼容至ie9+，如果低于ie9使用currentStyle代替，但currentStyle不支持伪元素的获取。

	// 跨浏览器兼容方法
	var style = dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom,null);

## getPropertyValue ##
getPropertyValue获取css样式上声明的属性值,	其兼容至ie9+。
	
	var style = dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom,null);
	var width = style.getPropertyValue('width');

如果低于ie9可以使用getAttribute方法代替，但略有不同。

**ps：jquery的css()方法就是基于getComputedStyle与getPropertyValue方法实现的。**


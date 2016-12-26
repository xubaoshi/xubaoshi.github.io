---
layout:     post
title:      "webpack 问题汇总"
date:       "2016-12-26 13:52:00"
author:     "XuBaoshi"
header-img: "img/webpack.jpg"
---

# webpack learn #

### babel-polyfill 与 babel-runtime 区别###
<p>
babel转译后的代码要实现源代码同样的功能需要借助一些函数
</p>
	
	{[name]:'JavaScript'}

	// babel转译后
	'use strict'
	function _defineProperty(obj,key,value){
		if(key in obj){
			Object.defineProperty(obj,key,{
				value:value,
				enumerable:true,
				configureable:true,
				writable:true
			});
		} else {
			obj[key] = value;
		}
	}

	var obj = _defineProperty({},'name','JavaScript')

类似上面`_defineProperty`可能会重复出现在一些模块里，导致编译后代码体积变大。babel提供了单独的包 babel-runtime 供编译模块复用工具函数。


	// 使用babel-plugin-transform-runtime 使用babel-runtime转译后
	'use strict';
	// 之前的 _defineProperty 函数已经作为公共模块 `babel-runtime/helpers/defineProperty` 使用
	var _defineProperty2 = require('babel-runtime/helpers/defineProperty');
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	var obj = (0, _defineProperty3.default)({}, 'name', 'JavaScript');




<p>
babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。
</p>

### webstorm、idea修改文件后，webpack-dev-server不自动编译刷新###
使用webstorm或idea时，会出现如下现象，修改某个js或css后webpack不自动编译浏览器刷新，原因是webstorm或idea中有一个选项叫`use "safe write"`，刚修改文件时该设置会在临时文件中创建一个文件并没有触发真正的文件变更，因此webpack也就监听不到，无法编译。如图：<br>

![](http://i.imgur.com/qNHxI12.png)
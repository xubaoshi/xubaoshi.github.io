---
layout:     post
title:      "webpack 问题汇总"
date:       "2016-12-26 13:52:00"
author:     "XuBaoshi"
header-img: "img/webpack.jpg"
---

# webpack 问题汇总 #

## webpack文件路径 ##

在开发阶段使用webpack时通常会使用`hot replace`（热重载），即通过一个http服务器(nodejs)伺服资源文件，当原始文件作出的改动服务器会以某种方式（websocket）通知客户端（浏览器）刷新页面重新更新资源。搭建nodejs服务器可以结合webpack提供的api自己搭建，也可以使用webpack-dev-server（基于express的http服务器），通常会选择webpack-dev-server，刚接触webpack时一些路径的配置的原因很容易弄混：下面给出了需要注意的webpack及webpack-dev-server相关配置项：

**有一点需要注意的是WEBPACK-DEV-SERVER实时编译后生成的文件都存在内存中。**

文件目录结构如下：<br>

![](http://i.imgur.com/vWCx0ix.jpg)<br>

**webpack.config.js：<br>**

	module.exports = {
	    devtool: 'cheap-source-map',                        // 编译模式 
	    entry:  './public/script/index.js',                 // 入口文件路径
	    output: {
	        publicPath:'/asset',                            // 设置为想要的资源访问路径。访问时，如果没有设置，则默认从站点根目录加载  当前打包后的文件加载地址为 localhost:8080/asset/bundle.js
	        path: "./dist/script",                          // 出口文件路径
	        filename: "bundle.js"                           // 出口文件名称
	    },
		resolve: {
			extensions: ['', '.js', '.jsx']
		},
	    module: {
	        loaders: [
	            {
	                test: /\.json$/,
	                loader: 'json'
	            },
	            {
	                test: /\.js$/,
	                exclude: /node_modules/,
	                loader: 'babel'
	            },
	            {
	                test: /\.css$/,
	                loader: 'style!css?modules'              
	            }
	        ]
	    }
	};

**index.html：<br>**

	<!DOCTYPE html>
	<html>
	    <head>
	        <title>react demo</title>
	    </head>
	    <body>
	        <div id="example"></div>
			// 如果 webpack.config.js  output.publicPath不设置则修改为 <script src="bundle.js"></script>
	        <script src="asset/bundle.js"></script>
	    </body>
	</html>


**cmd 命令：<br>**
![](http://i.imgur.com/pz5n8JT.png)

content-base 设定 webpack-dev-server 伺服的 directory，上图设置为当前根目录。

## babel-polyfill 与 babel-runtime 区别##
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

## webstorm、idea修改文件后，webpack-dev-server不自动编译刷新##
使用webstorm或idea时，会出现如下现象，修改某个js或css后webpack不自动编译浏览器刷新，原因是webstorm或idea中有一个选项叫`use "safe write"`，刚修改文件时该设置会在临时文件中创建一个文件并没有触发真正的文件变更，因此webpack也就监听不到，无法编译。如图：<br>

![](http://i.imgur.com/qNHxI12.png)
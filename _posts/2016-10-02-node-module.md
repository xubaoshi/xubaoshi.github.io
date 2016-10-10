---
layout:     post
title:      "nodejs 模块机制"
date:       "2016-10-01 21:52:00"
author:     "XuBaoshi"
header-img: "img/node-module.jpg"
---

# nodejs 模块机制 #

<h2> 1.AMD、CMD、CommonJS  模块规范 </h2>
关于js为什么要引入模块化规范，请参考  [https://github.com/seajs/seajs/issues/547](https://github.com/seajs/seajs/issues/547)
<h3> CommonJS规范 </h3>
CommonJS规范是2009年开始提出的，最初的名字叫ServerJS，后期重命名为CommonJS，CommonJS认为一个单独的文件就是一个模块,每一个模块都是一个单独的作用域。加载模块使用require()方法，该方法读取一个文件并编译执行，最终返回文件内部的exports对象。nodejs就是采用了CommonJS的规范。

	//    filename: foo.js
	//    dependencies
	var $ = require('jquery');

	//    methods
	function myFunc(){};

	//    exposed public method (single)
	module.exports = myFunc;

	===========================================

	// filename: index.js
	var foo = require('./foo');
	foo.myFunc();

<p>CommonJS加载的方式采用的是同步的方式，只有资源加载完成才能执行后面的操作，nodejs主要用来做服务端的编程，所依赖的文件大多都在本地，因此读取速度快，不需要考虑异步加载。但是如果此方案用在浏览器端，文件加载时间未知可能会导致浏览器页面处于卡死的状态。于是后面就有了AMD规范与CMD规范。</p>

<h3> AMD规范 </h3>

是在requirejs在推广的过程中产出的。AMD异步加载模块，AMD是提前执行的。
	
	define(['jquery','underscore'],function($,_){
	
	})

AMD推崇依赖前置，但AMD依然支持依赖就近，延迟执行（由RequireJS 从 2.0增加）。

	// RequireJS 2.0
	define(function(require,exports,module)){
		var $ = require('jquery');
		var _ = require('underscore');
	}

<h3> CMD规范 </h3>

是在seajs在推广的过程中产出的，cmd是延迟执行的。
	
	define(function(require,exports,module)){
		var $ = require('jquery');
		var _ = require('underscore');
	}


CMD推崇依赖就近。

<h2> 2. Node中引入模块的步骤： </h2>	
**（1）路径分析<br>（2）文件定位<br>（3）编译执行<br>**
<h2> 3. Node中模块分为两类： </h2>	
**Node提供的模块（核心模块）、用户编写的模块(文件模块)。<br>**
**核心模块：**<br>在Node启动时部分核心模块直接被加载到内存中，所以在引入这些模块时，文件定位及编译执行可以省略掉，并且路径分析中优先判断，加载速度最快.<br>
**文件模块：**
运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。
<h2> 4. 优先从缓存加载 </h2>	
Node对引入过的模块进行缓存，以减少引入时的开销。浏览器缓存的仅仅是缓存文件，而Node缓存的是编译执行后的对象。
<h2> 5. 路径分析与文件定位 </h2>
<h3> 5.1 模块标识符分析 </h3>
node通过require方法引入模块，require方法内接受一个标识符作为参数，node基于此标识符进行模块的分析与定位。<br>

	var path = require('path');                                                            // 核心模块  http、fs、path等
	var test1 = require('./test1.json');                                                   // . 或 .. 开始的相对路径的文件模块
	var test2 = require('../test2.json');
	var test3 = require('E:/code/learn/project/js/node/module/test/test3.json');           // 绝对路径
	var walk = require('walk');                                                            // 非路径形式的walk模块

**核心模块**的优先级仅次于缓存加载，由于Node的源码编译过程中已经将其编译为二进制编码，因此其加载过程最快。ps:http(node中的核心模块)，如果自定义该模块，引入时如果希望加载成功，必须选择一个不同的标识符或者通过路径引用的方式引用该模块<br>


	var http = require('http');          // 核心模块
	var http = require('http_custom');   // 更换标识符
	var http = require('./http');        // 路径方式引入

**路径形式的文件模块**以`.` 、`..` 、`/`开始的标识符都会当做文件模块来处理，在分析路径模块时，require()方法会将路径转为真实路径进行编译，编译执行后的结果会存储在缓存中，以使二次加载更快。 
由于文件模块给node指明了确切的文件位置，查找过程可以大量的节约时间，其速度仅此于核心模块。<br>
**自定义模块**指非核心模块同时也不是路径形式的模块，属于一种特殊的文件模块，可能是一个文件或者包的形式，查找最费时，也是最慢的一种。

**NODE_PATH** <br>
操作系统中都会有一个环境变量，当系统调用一个命令时，就会在PATH变量中寻找，如果注册路径中存在则调用，如果没有就提示命令没有找到。<br>
NODE_PATH就是node中模块所提供的注册路径环境变量。使用`;`进行分割不同的路径。

	module.paths

**windows系统下**<br>

![](http://i.imgur.com/tbG3eHu.png)

如果寻找一个文件，nodejs首先会从当前目录下的node_modules、上级目录的node_modules,逐级查找直至到根目录的node_modules。文件目录越深，文件查找耗时越多，如果还没有查找到指定模块的话，就会去 NODE_PATH中注册的路径中查找，因此去NODE_PAtH中首次（找到后会进行缓存）查找也是最慢的。

<h3> 5.2 文件扩展名分析 </h3>
如果require() 方法内的参数不添加标识符，Node会按照.js、.json、.node的顺序依次加载。
<h3> 5.3 目录分析和包 </h3>
1.通过require()方法进行查找文件所得到的可能不是一个文件而是一个目录，这时node会将这个目录当做一个包进行处理。<br>
首先node会在当前的目录下查找package.json文件，通过JSON.parse()方法将package.json进行解析成描述该包的对象，从该对象main属性指定的文件进行定位。<br>2.如果没有package.json,node会认为index当做默认的文件名，依次去查找.js、.json、.node文件。<br>3.如果在此目录分析过程中没有定位到任何文件的话，node会进入下一个模块路径进行查找。如果没有找到则直接抛错查找异常。<br>
![](http://i.imgur.com/TtkpN07.png)
<h2> 6. 模块编译 </h2>
编译和执行是引用模块的最后一个阶段，定位到文件后node会新建一个模块对象，然后根据路径进行载入并编译。不同的文件扩展名其载入方式也是不同的。<br>
1. .js文件。通过fs模块同步读取后编译执行。<br>
2. .node文件。使用c/c++编写的扩展文件，通过内建的process.dlopen()方法加载编译执行。<br>
3. .json文件。通过fs模块同步读取文件后，用JSON.parse()解析返回结果。<br>
4. 其余扩展名文件。当做.js文件进行载入。<br>

<h2> 7. 包与npm </h2>
第三方模块中，模块与模块之间是散列在各地的，相互之间不能引用。包和npm则是将模块之间联系起来的一种机制。
![](http://i.imgur.com/qy2APmY.png)
<h3> 7.1 npm </h3>
npm其实是node的包管理工具，可以帮助node的使用者发布、安装、依赖第三方包。
<h3> 7.2 包的结构 </h3>
通过npm install下载的包实际上是一个目录直接打包成.zip或tar.gz格式的文件，下载后安装解压成目录。符合CommonJS规范的包的结果应该包含以下文件：<br>
- package.json: 包的描述文件。<br>
- bin:用来指定各个内部命令对应的可执行文件的位置。<br>
- lib:用于存放javascript代码的目录。<br>
- doc:用于存放文档的目录。<br>
- test:用于存放单元测试代码的目录。<br>


<h3> 7.3 包的安装 </h3>
	
	npm install walk
	npm install webpack

webpack为例 如果当前目录没有node_modules文件夹 执行命令后npm会在当前目录下创建node_modules,同时在node_modules文件夹内创建webpack文件夹，最后将下载后的压缩文件解压到webpack中。npm install 执行完成。

<h4> 全局模式安装 </h4>

	npm install walk -g
	npm install webapck -g

确切的说将此命令称为全局模式安装是不精确的，这会让人产生很多误解。<br>
**全局模式并不是将一个模块包安装为一个全局包的意思，这并不意味这你可以通过require()方法在任何地方来引用它。**<br>
`-g`事实上是将该包安装为全局可用的**可执行命令**。如:webpack、grunt、gulp等。

	// webpack package.json

	{
		...
		 "bin": {
    		"webpack": "./bin/webpack.js"
		 }
		...
	}


	// walk package.json 并没有bin属性因此walk是不可能作为全局可用的可执行命令

node在运行时会解析bin属性所对应的文件路径加入到系统的PATH变量中，因此可以在dos命令行中任何位置使用该命令。

![](http://i.imgur.com/0GfMPW0.jpg)
![](http://i.imgur.com/4I1MOwA.png)


	// 查看全局安装模式包的位置
	node root -g

![](http://i.imgur.com/AZ8oNYR.jpg)
---
layout:     post
title:      "es6-function"
date:       "2017-06-27 "
author:     "XuBaoshi"
header-img: "img/post-bg-02.jpg"
---

<h1>ECMAScript.6 函数相关</h1>
<h2>参数默认值</h2>	

	//es5
	function makeRequest(url,timeout,callback){
		timeout = timeout || 2000;
		callback = callback || function(){};
		// ..... 
	}

	// 当参数为timeout为0时上面的设置的参数变为2000，在这种情况下存在问题,保险的做法如下：
	
	// es5 safer
	function makeRequest(url,timeout,callback){
		timeout = (typeof timeout !== 'undefined') ? timeout : 2000;
		callback = (typeof callback !== 'undefined') ? callback : function(){};
		// ......
	}

	// es6
	function makeRequest(url,timeout=2000,callback=function(){}){
		// ......
	}

	// es5 非严格模式下，函数参数发生变化 arguments数组会与其保持一致
	function mixArgs(first,second){
		console.log(first === arguments[0]);  //true
		console.log(second === arguments[1]);  //true
		console.log(first);  //"a"
		console.log(second); //"b"
		console.log(arguments[0]);//"a"
		console.log(arguments[1]); //"b"
		first = "c";
		second = "d";
		console.log(first === arguments[0]);//true
		console.log(second === arguments[1]);//true
		console.log(first);//"c"
		console.log(second);//"d"
		console.log(arguments[0]);//"c"
		console.log(arguments[1]);////"d"
	}
	mixArgs('a','b');

	// es5 严格模式下，函数参数发生变化 arguments数组不会更改
	function mixArgs(first,second){
		'use strict';
		console.log(first === arguments[0]);//true
		console.log(second === arguments[1]);//true
		console.log(first);//"e"
		console.log(second);//"f"
		console.log(arguments[0]);//"e"
		console.log(arguments[1]);//"f"
		first = "g";
		second = "h";
		console.log(first === arguments[0]);//false
		console.log(second === arguments[1]);//false
		console.log(first);//"g"
		console.log(second);//"h"
		console.log(arguments[0]);//"e"
		console.log(arguments[1]);//"f"
	}
	mixArgs('e','f');


	// 暂时性死区
	function add(first = second, second) {
		return first + second;
	}
	console.log(add(1,1));
	console.log(add(undefined,1)); // throw errors
上述代码当first为undefined，初始化时需要second对其进行初始化，但此时second还没有存在当前上下文。<br>

<img src="/img/es6-function/param-tdz.png" style="display:block;"/>

<h2>Rest Parameters(剩余参数)</h2>

	// es5 复制对象属性
	function pick(object){
		let result = Object.create(null);
		for(let i = 1;len = arguments.length,i<len; i++){
			result[arguments[i]] = object[arguments[i]];
		}
		return result;
	}

	let book = {
		A:"AA",
		B:"BB",
		C:"CC",
	}
	let bookData = pick(book,'A','B');
	console.log(book);
	console.log(bookData);  //[object Object] {
							//	A: "AA",
							//	B: "BB"
							//}

	// Rest Parameters(剩余参数)
	// 如果所需要复制的参数过多，可以使用剩余参数
	function pickNew(object,...keys){
		let result = Object.create(null);
		for(let i=0;len = keys.length,i<len;i++){
			result[keys[i]] = object[keys[i]];
		}
		return result;
	}

	let bookNewData = pickNew(book,'A','B','C');
	console.log(bookNewData);//[object Object] {
							 //	A: "AA",
							 //	B: "BB",
							 //	C: "CC"
							 //}

<strong>剩余参数后面，不能再次追加参数。</strong>
	
	function pick(object,...keys,last){
  		console.log(last);
	}

<img src="/img/es6-function/param-rest.jpg" style="display:block;" />

<h2>The Spread Operator(展开运算符)</h2>
1. 展开运算符（spread operator）允许一个表达式在某处展开。展开运算符在多个参数（用于函数调用）或多个元素（用于数组字面量）或者多个变量（用于解构赋值）的地方可以使用。<br>
2. 展开运算符不能用在对象当中，因为目前展开运算符只能在可遍历对象（iterables）可用。iterables的实现是依靠[Symbol.iterator]函数，而目前只有Array,Set,String内置[Symbol.iterator]方法，而Object尚未内置该方法，因此无法使用展开运算符。不过ES7草案当中已经加入了对象展开运算符特性。



	var value1 = 25,value2=50;
	console.log(Math.max(value1,value2));  //50

	// wrong
	var valArr = [25,50];
	console.log(Math.max(valArr));  //throw error

	// right
	console.log(Math.max.apply(Math,valArr));//50

	// 通过待对比的参数封装在一个数组内，可以使用展开运算符进行处理
	// es6
	console.log(Math.max(...valArr));//50
	console.log(Math,max(...valArr,200)); //200



<h2>函数名</h2>

	// 函数声明
	function doSomeThing(){
	
	}

	// 函数表达式
	var doAnotherThing = function(){
	
	}

	console.log(doSomeThing.name);    // "doSomeThing"
	console.log(doAnotherThing.name); // "doAnotherThing"

	var doAnotherElseThing = function doElseThing(){
	
	};
	console.log(doAnotherElseThing.name);   // "doElseThing"


<strong>函数声明的优先级最高(可以这么理解，本人理解为先创建函数然后在进行赋值，所以保留首次创建的name，自己可能理解的不对。。)</strong>


	// 赋值name不变
	var doAnotherThingElse = doAnotherThing;
	console.log(doAnotherThingElse.name);  // "doAnotherThing"
	console.log(doSomeThing.bind().name);  // "bound doSomeThing"
	console.log((new Function()).name); // "anonymous"

<h2>new.target</h2>
new.target获取当前new的那个目标构造器 

	// 判断执行当前函数前是否添加 new
	// es5
	function Person(name){
		console.log(this instanceof Person);
		if(this instanceof Person){
			this.name = name;
		}else{
			throw new Error('must use new');
		}
	}
	var p1 = new Person('h');
	console.log(p1.name);    //h
	
	// wrong
	var p2 = Person('name'); // throw error
	
	// 使用call或者apply避开条件判断
	Person.call(p1,"i");   // 此种情况 不会抛错

	// es6 new.target
	function Person(name){
		if(typeof new.target !== 'undefined'){
			this.name = name;
		}else{
			throw new Error('must use new');
		}
	}
	var p4 = new Person('Nich');
	Person.call(p4,"i");   // throw error

<h2>块级作用域</h2>

	//es5 no strict
	if(true){
		console.log(typeof doSomeThing);  // "function"
		function doSomeThing(){
			console.log("222");
		}
		console.log(typeof doSomeThing); // "function"
		doSomeThing();  // "222
	}
	console.log(typeof doSomeThing);  // "function"

	//es5  strict
	"use strict"    // throw error
	// .....      
	
<img src="/img/es6-function/block-level.png" style="display:block;"/>


	// es6
	// 1.
	"use strict";
	if(true){
		console.log(typeof doSomeThing);  // "function"
		function doSomeThing(){
			console.log("222");
		}
		console.log(typeof doSomeThing); // "function"
		doSomeThing();  // "222"
	}
	console.log(typeof doSomeThing);  // "undefined"

	// 2.
	if(true){
		console.log(typeof doSomeThing);  // "function"
		function doSomeThing(){
			console.log("222");
		}
		console.log(typeof doSomeThing); // "function"
		doSomeThing();  // "222"
	}
	console.log(typeof doSomeThing);  // "function"

从上述代码可以看出严格模式下，es6中的块级作用域对函数声明有效。

<h2>箭头函数</h2>
1.没有super、arguments and new.target 这些对象为离他最近的非箭头函数所定义的。<br/>
2.不能使用new调用。<br/>
3.没有prototype。<br/>
4.this不能被更改。<br/>
5.没有arguments对象只能使用命名过的参数或者剩余参数。<br/>
6.不允许存在重复的参数。<br/>

	// arrow function
	let reflect1 = value => console.log(value);
	reflect1("2222");  // "2222"

	// common function
	let reflect2 = function(value){
		console.log(value);
	}
	reflect2("2222"); // "2222"

	// 空函数
	let doNothing = () => {};
	// 等同于
	let doNothing = function(){

	}

	// 返回对象
	let getTemp = id => ({id:id,name:'temp'});
	console.log(getTemp('id'))	// [object Object] {
								//	id: "id",
								//	name: "temp"
								//	}
								
<strong>ps:如果想返回对象，被返回的对象外面需包裹 "(" ")"。</strong>


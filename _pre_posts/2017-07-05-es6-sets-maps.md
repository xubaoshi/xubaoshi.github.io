---
layout:     post
title:      "2017-07-05-es6-sets-maps"
date:       "2017-07-05 "
author:     "XuBaoshi"
header-img: "img/post-bg-06.jpg"
---

<h1>ECMAScript.6 Sets与Maps相关</h1>
ES6 提供了两个新的数据结构Set与Map。Set类似于数组，Set内的成员都是唯一的没有重复的。Map类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
<h2>Set</h2>
<h3>创建Set</h3>

    let set = new Set();
    set.add(5);  
    set.add("5");
    console.log(set.size); // 2

<ol>
    <li>add(value)：添加某个值，返回Set结构本身。</li>
</ol>

从上面代码可以看出通过new关键字声明一个set变量，通过add添加新成员。被添加的新成员不会被强制类型转换。<br>

    let a = NaN;
    let b = NaN;
    let set = new Set();
    set.add(a);
    set.add(b);
    console.log(set); // {NaN}

<strong>ps：Set内的成员都是唯一的没有重复的Set内部判断两个值是否相同使用的是 Object.is()方法。Object.is() 与 === 很相似，不同之处在于 +0 与 -0 的比较 、两个NaN之间的比较。</strong>

    let arr = [1,2,3,4,5,5,5,5];
    let set = new Set(arr);
    console.log(set.size);  // 5

如果一个存在相同值数组作为初始化set的参数时，生成的set会将重复的值剔除。因为Set内的成员都是唯一的没有重复的。

<h3>判断成员是否存在</h3>
<ol>
    <li>has(value)：返回一个布尔值，表示该值是否为Set的成员。</li>
</ol>

    // has
    let set = new Set();
    set.add(5);
    set.add("5");

    console.log(set.has(5)); //true
    console.log(set.has(6)); // false

<h3>删除成员</h3>
<ol>
    <li>delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。</li>
    <li>clear()：清除所有成员，没有返回值。</li>
</ol>

    let set = new Set();
    set.add(5);
    set.add('5');

    console.log(set.size); // 2
    set.delete(5);
    console.log(set.size); // 1
    set.clear();
    console.log(set.has('5')); // false
    console.log(set.size); // 0

<h3>遍历Set</h3>
Set 结构的实例有四个遍历方法，可以用于遍历成员
<ol>
    <li>keys()：返回键名的遍历器</li>
    <li>values()：返回键值的遍历器</li>
    <li>entries()：返回键值对的遍历器</li>
    <li>forEach()：使用回调函数遍历每个成员</li>
</ol>
关于遍历器的相关内容后期进行说明。<br/>
forEach方法有三个参数，与数组Array的forEach方法相似，1、键值 2、键名 3.集合本身

    let set = new Set(['red','green','blue']);

    set.forEach(function(value,key,own){
        console.log(value);  // 'red'
        console.log(key);  // 'red'
        console.log(own === set); // true
    })

<h3>Set转换为Array</h3>
可以通过展开运算符实现数组的转换。

    let set = new Set([1,2,3,3,3,4,5]);
    let array = [...set];
    console.log(array); // [1,2,3,4,5]

<h2>Weak Set</h2>
WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。首先，WeakSet 的成员只能是对象，而不能是其他类型的值,其次WeakSet 中的对象是弱引用，即如果其他对象都不再引用该对象那么垃圾回收机制会自动回收该对象占用的内存，不考虑该对象是否存在于WeakSet之中。

    // Set
    let set = new Set(),key = {};
    set.add(key);
    console.log(key);  // Object {}
    console.log(set.size); // 1

    // 设置key=null
    key = null;

    console.log(set.size); // 1
    key = [...set][0]; 
    console.log(key); // Object {}

从上述代码可以看出，虽然将key设置为null,但set内依旧保留着在key没有被设置为null之前的引用，依旧可以通过展开运算符转换为数组。但有的时候set的这种模式并不是一个很好的方式，比如在操作Dom的时候，有的时候你并不需要知道Dom被修改后之前的dom状态是什么样子的。

    // WeakSet
    let set = new WeakSet(),key = {};
    set.add(key);
    console.log(key);  // Object {}
    console.log(set.has(key)); //true
    console.log(set);  

    // 设置key=null
    key = null;
    console.log(set.has(key)); // false
<h2>Map</h2>

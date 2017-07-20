---
layout:     post
title:      "2017-07-10-es6-sets-maps"
date:       "2017-07-10 "
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
<ol>
    <li>如果使用WeakSet实例 add、has、delete方法时传递非对象参数将会抛错。</li>
    <li>WeakSet不能使用for of方法。</li>
    <li>WeakSet不能使用迭代器相关方法如：keys、values、methods。</li>
    <li>WeakSet不能使用forEach方法。</li>
    <li>WeakSet不能使用size方法。</li>
</ol>

<h2>Map</h2>
Map类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。Map中判断键值是否相等采用的Object.is()方法相同的模式进行判断;
<h3>基础</h3>

    // 创建
    let map = new Map();
   
    // 添加、获取
    map.set('title','es6');
    map.set('year',2017);
    console.log(map.get('title')); // "es6"
    console.log(map.get('year')); // 2017

    // 修改
    map.set('year',2018); 
    console.log(map.get('year')); // 2018

    // 使用{}作为key
    var key1 = {};
    var key2 = {};
    map.set(key1,2017);
    map.set(key2,2018);
    console.log(map.get(key1)); // 2017
    console.log(map.get(key2)); // 2018
    console.log(key1 === key2); // false

创建Map时Map也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。

    let map = new Map([['name','Kevin'],['age',25]]);
    console.log(map.size); // 2
    console.log(map.get('name')); // "Kevin"
    console.log(map.get('age')); // 25

<h3>方法及属性</h3>
<ol>
<li>has(key) 判断键值是否在map中</li>
<li>delete(key) 删除键值及对应value</li>
<li>clear() 清空map</li>
<li>size map中包含有多少键值对</li>
<li>forEach 方法与map相似</li>
</ol>

    let map = new Map();
    var key1 = {};
    map.set('name','Kevin');
    map.set('age','25');
    map.set(key1,'25');

    // size
    console.log(map.size); // 3

    // has
    console.log(map.has('name')); // true
    console.log(map.get('name')); // "Kevin"
    console.log(map.has(key1)); true
    console.log(map.get(key1)); // 25

    // delete
    map.delete('name');
    console.log(map.size); // 2
    map.delete(key1);
    console.log(map.size); // 1
    console.log(map.get('name')); // undefined
    console.log(map.get(key1)); // undefined

    // clear
    map.clear();
    console.log(map.size); // 0

forEach方法有三个参数，与数组Array的forEach方法相似，1、键值 2、键名 3.map本身

    let map = new Map([['name','Kevin'],['age',25]]);
    map.forEach(function(value,key,own){
        console.log(value);
        console.log(key);
        console.log(map === own);
    })

<h2>WeakMap</h2>
WeakMap设计的目的在于有的时候我们希望在某个对象上存放一些数据，这便会形成这个对象对这些数据的引用，我们不需要时只能手动清除掉，否则会一直占用内存。

    // eg:
    var dom1 = document.getElementById('logo');
    var dom2 = document.getElementById('fakebox');
    var arr = [
        [dom1,'1'],
        [dom2,'2']
    ];
    console.log(arr[0][0]);
    console.log(arr[1][0]);
    dom1.remove();
    dom2.remove();
    dom1 = null;
    dom2 = null;
    console.log(dom1);
    console.log(dom2);
    console.log(arr[0][0]);
    console.log(arr[1][0]);

上述代码中从文档中移除dom节点后，dom1,dom2是不需要的，但垃圾回收器没有办法回收节点的内存，删除节点后节点的内存才会被回收。

    // 不需要dom1,dom2时需要手动删除。
    arr[0] = null;
    arr[1] = null;

WeakMap其实是WeakSet是相似的，WeakMap中每一个键值必须是一个对象（null也不可以），只要所引用的对象的其他引用都被清除,WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。如果在声明WeakMap时使用键值是非对象将会抛错。

<h3>创建WeakMap</h3>
    
    // create
    let map = new WeakMap();
    
    // set Key

    // throw error
    map.set('',1);
    map.set(1,1);
    map.set(null,1);
    map.set("2",1);
    map.set(undefined,1);
    map.set(NaN,1);
    map.set(true,1);
    

    // object
    var key1 = {};
    var key2 = function(){};
    var key3 = [];
    
    map.set(key1,1);
    map.set(key2,2);
    map.set(key3,3);
    map.set(dom1,'dom1');

    // get
    console.log(map.get(key1)); // 1
    console.log(map.get(key2)); // 2
    console.log(map.get(key3)); // 3

    key1 = null;
    key2 = null;
    key3 = null;

    console.log(map.get(key1)); // undefined
    console.log(map.get(key2)); // undefined
    console.log(map.get(key3)); // undefined

创建WeakMap时WeakMap也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。

    var dom1 = document.getElementById('logo');
    var dom2 = document.getElementById('fakebox');
    var map = new WeakMap([
        [dom1,'1'],
        [dom2,'2']
    ]);
    dom1.remove();
    dom2.remove();
    dom1 = null;
    dom2 = null;
    console.log(map.get(dom1)); // undefined
    console.log(map.get(dom1)); // undefined

<ol>
    <li>如果使用WeakMap实例 add、has、delete方法时传递非对象参数将会抛错。</li>
    <li>WeakMap不能使用for of方法。</li>
    <li>WeakMap不能使用迭代器相关方法如：keys、values、methods。</li>
    <li>WeakMap不能使用forEach方法。</li>
    <li>WeakMap不能使用size方法。</li>
</ol>
     

    
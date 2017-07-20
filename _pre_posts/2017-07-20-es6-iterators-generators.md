---
layout:     post
title:      "2017-07-20-es6-iterators-generators"
date:       "2017-07-20"
author:     "XuBaoshi"
header-img: "img/post-bg-07.jpg"
---
<h1>iterators-generators</h1>
<h2>iterators(迭代器)</h2>
<p>迭代器是一种一种机制，它为各种不同数据结构提供统一的访问机制。如果该数据结构部署了Iterator接口那么该数据结构便可以完成遍历数据结构成员操作。</p>
<p>所有的迭代器都有一个next()方法，每次调用该方法后返回一个对象，该对象包含两个属性：value属性指的是当前成员的值，done属性是一个boolean值指的是遍历是否结束。当遍历结束后再次调用next()方法时，返回的对象value属性为undefined,done属性为true</p>
以上述想法使用es5实现迭代器如下：

    function createIterator(items){
        var i = 0;
        return {
            next:function(){
                var done = (i >= items.length);
                var value = !done ? items[i++] :undefined;
                return {
                    value:value,
                    done:done
                }
            }
        }
    }

    var iterator = createIterator([1,2,3]);
    console.log(iterator.next()); // "{value:1,done:false}"
    console.log(iterator.next()); // "{value:2,done:false}"
    console.log(iterator.next()); // "{value:3,done:false}"
    console.log(iterator.next()); // "{value:undefined,done:true}"
    console.log(iterator.next()); // "{value:undefined,done:true}"

遵循上述规则上述代码书写迭代器似乎有些麻烦，es6提供generators帮助方便的生成迭代器。

<h2>generators</h2>
generators 是一个返回迭代器的函数，与不同函数不同的是声明generators函数要在function后面添加"*",同时函数内部使用es6新增加的关键字yield来控制next()方法的返回值。

    // generator 函数
    function *createIterator(){
        yield 1;
        yield 2;
        yield 3;
    }

    // 创建迭代器
    let iterator = createIterator();
    console.log(iterator.next().value); // 1
    console.log(iterator.next().value); // 2
    console.log(iterator.next().value); // 3
    console.log(iterator.next().value); // undefined
从上述代码可以看出或许最令人感兴趣的便是每次的yield使用都可以阻止代码的执行，dang迭代器调用next()方法后才会继续执行。
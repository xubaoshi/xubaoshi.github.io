---
layout: post
title: 'js 循环异步场景分析'
date: '2020-02-21'
author: 'XuBaoshi'
header-img: 'img/node-module.jpg'
---

# js 循环异步场景分析

针对循环异步的场景往往在 web 端出现的情况是较为少见的，但是在后端（node.js） 循环异步的情况是较为寻常的而且是不可避免的。如：如果异步存储文件组（一个文件执行一次存储操作）后在在执行某些操作.

## 循环

下面是一个普通的循环

```javascript
for (var i = 0; i < 5; i++) {
  console.log(i)
}
// 0,1,2,3,4
```

### 添加 setTimeout

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0)
}
// 5,5,5,5,5
```

setTimeout 方法本身是同步执行的，该方法执行后会告诉浏览器在某一个时刻执行其传入的函数，这块便涉及到了 js 中的事件循环机制（event loop）。

在事件循环任务队列是可以有多个：宏任务（ macrotask queue ）、微任务（microtask queue）。其中整个 script 代码是放在宏任务中执行的，执行顺序如下整个 script 代码作为第一个宏任务执行，当执行到 setTimeout 时，将其传入的函数放置在下一个宏任务中去，在当前的宏任务（这个整个 script 代码）执行完毕后，去取找微任务是否存在，如果存在按顺序执行完微任务（上例中不存在微任务），这一步完成后继续寻找宏任务执行，上例中 for 循环执行完后第一个宏任务执行完毕，然后就去执行 setTimeout 生成的宏任务，此时的 i = 5。

在 setTimeout 存在的情况如果控制台希望继续输出 0,1,2,3,4， 一般面试的时候会问如何解决。

### 闭包

```javascript
for (var i = 0; i < 5; i++) {
  !(function(j) {
    setTimeout(function() {
      console.log(j)
    }, 0)
  })(i)
}
```

### let

## promise

## async && await

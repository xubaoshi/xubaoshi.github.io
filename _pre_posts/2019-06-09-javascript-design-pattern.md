---
layout: post
title: 'typescript 学习记录基础篇'
date: '2019-11-07'
author: 'XuBaoshi'
header-img: 'img/post-bg-02.jpg'
---

# javascript 设计模式



### es6 class

#### es5 实现 es6 class

es6 class 内部是基于寄生组合式继承

```javascript
function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType
    }
  })
  Object.setPrototypeOf(subType, superType)
}
```

##### setPrototypeOf

Object.setPrototypeOf 方法的作用与 `__proto__` 相同，用来设置一个对象的 prototype 对象，返回参数对象本身。该方法等同于下面的方法

```javascript
function (obj,proto) {
  obj.__proto__ = proto
  return obj
}
```

demo

```javascript
let proto = {}
let obj = { x: 10 }
Object.setPrototypeOf(obj, proto)
proto.y = 20
proto.z = 40

console.log(proto.x)
console.log(proto.y)
console.log(proto.z)
```

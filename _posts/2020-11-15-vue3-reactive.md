---
layout: post
title: 'Vue.js 3.0 响应式原理'
date: '2020-11-01'
author: 'XuBaoshi'
header-img: 'img/post-bg-06.jpg'
---

# Vue.js 3.0 响应式原理

<a name="df368884"></a>

## 前言

<br />响应式原理是 vue 最独特的特性之一，通过监控一个普通的 js 对象，每当该 js 对象被修改时，视图自动会同步更新。通过理解 vue 的响应式的工作原理，可进一步的避免业务开发中的常见问题。

<a name="79339905"></a>

## vue3.0 如何建立响应式

<br />vue3.0 建立响应式的方法有两种：<br />

<a name="g9GhF"></a>

#### 1. composition-api

- [官方文档](https://composition-api.vuejs.org/)
- [一图胜千言](https://juejin.im/post/6890545920883032071)

<br />运用 composition-api 中的 reactive 直接构建响应式，composition-api 的出现我们可以在.vue 文件中，直接用 setup()函数来处理之前的大部分逻辑，也就是说我们没有必要在 export default{ } 中在声明生命周期 ， data(){} 函数，watch{} , computed{} 等 ，取而代之的是我们在 setup 函数中，用 vue3.0 reactive watch 生命周期 api 来到达同样的效果，这样就像 react-hooks 一样提升代码的复用率，逻辑性更强。<br />

```javascript
const { reactive , onMounted } = Vue
setup(){
    const state = reactive({
        count:0,
        todoList:[]
    })
    /* 生命周期mounted */
    onMounted(() => {
       console.log('mounted')
    })
    /* 增加count数量 */
    function add(){
        state.count++
    }
    /* 减少count数量 */
    function del(){
        state.count--
    }
    /* 添加代办事项 */
    function addTodo(id,title,content){
        state.todoList.push({
            id,
            title,
            content,
            done:false
        })
    }
    /* 完成代办事项 */
    function complete(id){
        for(let i = 0; i< state.todoList.length; i++){
            const currentTodo = state.todoList[i]
            if(id === currentTodo.id){
                state.todoList[i] = {
                    ...currentTodo,
                    done:true
                }
                break
            }
        }
    }
    return {
        state,
        add,
        del,
        addTodo,
        complete
    }
}
```

<br />

<a name="Sk2Ov"></a>

#### 2. 传统的 data(){ return{} } 形式

vue3.0 没有放弃对 vue2.0 写法的支持，而是对 vue2.0 的写法是完全兼容的，提供了*applyOptions*  来处理 options 形式的 vue 组件。但是 options 里面的 data , watch , computed 等处理逻辑，还是用了 composition-api 中的 API 对应处理。

```javascript
export default {
    data(){
        return{
            count:0,
            todoList:[]
        }
    },
    mounted(){
        console.log('mounted')
    }
    methods:{
        add(){
            this.count++
        },
        del(){
            this.count--
        },
        addTodo(id,title,content){
           this.todoList.push({
               id,
               title,
               content,
               done:false
           })
        },
        complete(id){
            for(let i = 0; i< this.todoList.length; i++){
                const currentTodo = this.todoList[i]
                if(id === currentTodo.id){
                    this.todoList[i] = {
                        ...currentTodo,
                        done:true
                    }
                    break
                }
            }
        }
    }
}
```

<br />vue 经历了 1.x、2.x、3.x 版本，其中对于每个版本对于响应式的处理都有所不同，本次主要针对 vue3.x 版本的响应式原理进行分析。我们都知道 2.x 版本 vue 的响应式使用的是 `Object.defineProperty` 但是在 3.x 中其使用确是  `proxy`，具体如何使用还需要仔细阅读源码理解。<br />
<br />[vue 3.0 源码地址](https://github.com/vuejs/vue-next)<br />
<br />
<br />关于 vue3.0 响应式实现代码在如下位置：<br />![/img/vue3/1.png](/img/vue3/1.png)<br />
<br />
<br />`reactive.ts` 该文件由 typescript 书写，下面我们使用 js 将该文件内部的响应式原理简要的实现一下。在这之前我们还需要熟悉一下 es2015 相关的几个语法。<br />

<a name="O9a0A"></a>

## ES2015

<a name="Proxy"></a>

### Proxy

<a name="c11b905a"></a>

#### 兼容性

<br />
![/img/vue3/2.png](/img/vue3/2.png)

Proxy 可以在目标对象的外层搭建了一层拦截，外界对目标对象的一些操作，必须通过这层拦截。

```javascript
const proxy = new Proxy(target, handler)
```

<br />`new Proxy()` 标识生成一个 Proxy 实例， target 表示目标对象 ，handler 也是一个对象，用来定制拦截的行为。

```javascript
const target = {
  name: 'a',
}
const handler = {
  get: function (target, key) {
    console.log(`${key} 被读取`)
    return target[key]
  },
  set: function (target, key, value) {
    console.log(`${key}被设置为${value}`)
    target[key] = value
  },
}
const test = new Proxy(target, handler)
test.name
test.name = 'c'
console.log(target.name)
```

<br />其中 test 读取属性的值时， 实际上执行的是 handler.get 方法，并在控制台输出了信息。test 设置属性时执行的是 handler.set 方法，并在控制台输出了信息。<br />

<a name="1654d9f6"></a>

#### **Proxy 作用**

- 拦截和监视外部对对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进行校验或对所需资源进行管理

<br />

<a name="3763dbaa"></a>

#### **Proxy 所能代理的范围**

```javascript
// 在读取代理对象的原型时触发该操作，比如在执行 Object.getPrototypeOf(proxy) 时。
handler.getPrototypeOf()

// 在设置代理对象的原型时触发该操作，比如在执行 Object.setPrototypeOf(proxy, null) 时。
handler.setPrototypeOf()

// 在判断一个代理对象是否是可扩展时触发该操作，比如在执行 Object.isExtensible(proxy) 时。
handler.isExtensible()

// 在让一个代理对象不可扩展时触发该操作，比如在执行 Object.preventExtensions(proxy) 时。
handler.preventExtensions()

// 在获取代理对象某个属性的属性描述时触发该操作，比如在执行 Object.getOwnPropertyDescriptor(proxy, "foo") 时。
handler.getOwnPropertyDescriptor()

// 在定义代理对象某个属性时的属性描述时触发该操作，比如在执行 Object.defineProperty(proxy, "foo", {}) 时。
andler.defineProperty()

// 在判断代理对象是否拥有某个属性时触发该操作，比如在执行 "foo" in proxy 时。
handler.has()

// 在读取代理对象的某个属性时触发该操作，比如在执行 proxy.foo 时。
handler.get()

// 在给代理对象的某个属性赋值时触发该操作，比如在执行 proxy.foo = 1 时。
handler.set()

// 在删除代理对象的某个属性时触发该操作，比如在执行 delete proxy.foo 时。
handler.deleteProperty()

// 在获取代理对象的所有属性键时触发该操作，比如在执行 Object.getOwnPropertyNames(proxy) 时。
handler.ownKeys()

// 在调用一个目标对象为函数的代理对象时触发该操作，比如在执行 proxy() 时。
handler.apply()

// 在给一个目标对象为构造函数的代理对象构造实例时触发该操作，比如在执行new proxy() 时。
handler.construct()
```

<br />

<a name="Reflect"></a>

### Reflect

<a name="e05dce83"></a>

#### 简介

<br />
`Reflect`  是一个内置的对象，它提供拦截 `JavaScript` 操作的方法，这些方法与处理器对象的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。<br />
<br />

<a name="660d9caf"></a>

#### 为什么要用 Reflect？

<br />
`Reflect`内部封装了一系列对对象的底层操作， 我们之前操作对象可以用诸如： in、delete 及 Object 上面的方法。而使用 `Reflect` 则统一了对象的操作方式。

| 方法                     | 默认调用方式                       | 功能                                                     |
| ------------------------ | ---------------------------------- | -------------------------------------------------------- |
| get                      | Reflect.get()                      | 获取对象身上某个属性的值                                 |
| set                      | Reflect.set()                      | 在对象上设置属性                                         |
| has                      | Reflect.has()                      | 判断一个对象是否存在某个属性                             |
| deleteProperty           | Reflect.deleteProperty()           | 删除对象上的属性                                         |
| getProperty              | Reflect.getPrototypeOf()           | 获取指定对象原型的函数                                   |
| setProperty              | Reflect.setPrototypeOf()           | 设置或改变对象原型的函数                                 |
| isExtensible             | Reflect.isExtensible()             | 判断一个对象是否可扩展 （即是否能够添加新的属性）        |
| preventExtensions        | Reflect.preventExtensions()        | 阻止新属性添加到对象                                     |
| getOwnPropertyDescriptor | Reflect.getOwnPropertyDescriptor() | 获取给定属性的属性描述符                                 |
| defineProperty           | Reflect.defineProperty()           | 定义或修改一个对象的属性                                 |
| ownKeys                  | Reflect.ownKeys()                  | 返回由目标对象自身的属性键组成的数组                     |
| apply                    | Reflect.apply()                    | 对一个函数进行调用操作，同时可以传入一个数组作为调用参数 |
| construct                | Reflect.construct()                | 对构造函数进行 new 操作，实现创建类的实例                |
| .preventExtensions       | Reflect.preventExtensions()        | 阻止新属性添加到对象                                     |

<br />

<a name="Weakmap"></a>

### Weakmap

<br />

<a name="e05dce83-1"></a>

#### 简介

<br />WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。WeakMap 的 key 只能是 Object 类型。 原始数据类型是不能作为 key 的。WeakMap 设计的目的在于有的时候我们希望在某个对象上存放一些数据，这便会形成这个对象对这些数据的引用，我们不需要时只能手动清除掉，否则会一直占用内存。

WeakMap 中每一个键值必须是一个对象（null 也不可以），只要所引用的对象的其他引用都被清除,WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。如果在声明 WeakMap 时使用键值是非对象将会抛错。

<a name="28fcc753"></a>

#### Map 与 WeakMap 对比

<br />node 环境下 同个场景下 Map 与 WeakMap 对垃圾回收的影响<br />

```javascript
//map.js
function usageSize() {
  const used = process.memoryUsage().heapUsed
  return Math.round((used / 1024 / 1024) * 100) / 100 + 'M'
}

global.gc()
console.log(usageSize()) // ≈ 3.19M

let arr = new Array(10 * 1024 * 1024)
const map = new Map()

map.set(arr, 1)
global.gc()
console.log(usageSize()) // ≈ 83.19M

arr = null
global.gc()
console.log(usageSize()) // ≈ 83.2M
```

<br />创建完 map.js 之后，在命令行输入  `node --expose-gc map.js`  命令执行  `map.js`  中的代码，其中  `--expose-gc`  参数表示允许手动执行垃圾回收机制。

```javascript
function usageSize() {
  const used = process.memoryUsage().heapUsed
  return Math.round((used / 1024 / 1024) * 100) / 100 + 'M'
}

global.gc()
console.log(usageSize()) // ≈ 3.19M

let arr = new Array(10 * 1024 * 1024)
const map = new WeakMap()

map.set(arr, 1)
global.gc()
console.log(usageSize()) // ≈ 83.2M

arr = null
global.gc()
console.log(usageSize()) // ≈ 3.2M
```

<br />同样，创建完 weakmap.js 之后，在命令行输入  `node --expose-gc weakmap.js`  命令执行  `weakmap.js`  中的代码。通过对比  `map.js`  和  `weakmap.js`  的输出结果，我们可知  `weakmap.js`  中定义的  `arr`  被清除后，其占用的堆内存被垃圾回收器成功回收了。<br />

<a name="9ec477c2"></a>

## 响应式原理分析

<a name="F5nW2"></a>

#### 基本实现

```javascript
function trigger() {
  // 每次更新完成后 trigger 方法都会触发
  console.log('触发视图更新')
}

function isObject(target) {
  return typeof target === 'obejct' && target !== null
}

function reactive(target) {
  if (!isObject(target)) {
    return target
  }
  const handlers = {
    set(target, key, value, recevier) {
      // 更改属性时
      // target为目标对象，key为属性名，value为属性值，receiver为实际接受的对象
      // target[key] = value
      // 或
      trigger()
      return Reflect.set(target, key, value, recevier)
    },
    get(target, key, recevier) {
      // 获取属性时
      // target为目标对象，key为属性名，receiver为实际接受的对象
      // return target[key]
      // 或
      return Reflect.get(target, key, recevier)
    },
  }
  // 如果是对象
  let observed = new Proxy(target, handlers)
  return observed
}

let obj = {
  name: 'test',
}
let p = reactive(obj)
p.name
p.name = 'testa'
```

![/img/vue3/3.png](/img/vue3/3.png)<br />

- 通过 reactive 方法实现对 obj 的数据劫持
- reactive 内部通过判断 obj 是否是对象来决定是否使用 Proxy 生成实例
- 当获取属性时 p.name   调用 Proxy   内部 get 方法， get   方法内部使用 Reflect Api 代替对象的操作
- 当设置属性 `p.name = 'testa'` 时调用 Proxy   内部 set 方法， set 方法内部方法内部使用 Reflect Api 代替对象的操作同时调用更新视图的 trigger 方法

<a name="CV53g"></a>

#### 数组的数据监听

如果数据监听的是数组，则会出现以下问题

```javascript
// ...
const handlers = {
  set(target, key, value, recevier) {
    console.log(key)
    trigger()
    return Reflect.set(target, key, value, recevier)
  },
  get(target, key, recevier) {
    return Reflect.get(target, key, recevier)
  },
}
// ...

let arr = [1, 2, 3]
let p = reactive(arr)
p.push(4)
```

![/img/vue3/4.png](/img/vue3/4.png)<br />更新数组时我们会触发 set 方法， <br />其中第一次的 3 为 当前数组的索引但是第二次修改为修改数组的长度，长度应该屏蔽掉。<br />故在 set 方法中调整为如果修改的属性为内部属性的话则不触发更新操作。也可以理解为更改私有属性是可以触发更新操作的如果不是则直接返回，代码调整如下：<br />

```javascript
function trigger() {
  // 每次更新完成后 trigger 方法都会触发
  console.log('触发视图更新')
}

function isObject(target) {
  return typeof target === 'object' && target !== null
}

function reactive(target) {
  if (!isObject(target)) {
    return target
  }
  const handlers = {
    set(target, key, value, recevier) {
      if (target.hasOwnProperty(key)) {
        console.log(key)
        // 如果 key 是私有属性
        trigger()
      }
      return Reflect.set(target, key, value, recevier)
    },
    get(target, key, recevier) {
      return Reflect.get(target, key, recevier)
    },
  }
  let observed = new Proxy(target, handlers)
  return observed
}

let arr = [1, 2, 3]
let p = reactive(arr)
p.push(4)
console.log(p)
```

![/img/vue3/5.png](/img/vue3/5.png)<br />

<a name="5oH5f"></a>

#### 对象嵌套数据

但往往我们处理业务数据的时候经常遇到对象嵌套数组的情况。<br />

```javascript
let obj = {
  name: 'test',
  a: [1, 2, 3],
}
let p = reactive(obj)
p.a.push(4)
```

![/img/vue3/6.png](/img/vue3/6.png)<br />上图  `p.a.push(4)` 没有到 trigger 方法触发，原因是我们没有对对象内部的数组进行代理。处理方法如下：<br />

```javascript
function trigger() {
  // 每次更新完成后 trigger 方法都会触发
  console.log('触发视图更新')
}

function isObject(target) {
  return typeof target === 'obejct' && target !== null
}

function reactive(target) {
  if (!isObject(target)) {
    return target
  }
  const handlers = {
    set(target, key, value, recevier) {
      if (target.hasOwnProperty(key)) {
        // 如果 key 是私有属性
        trigger()
      }
      return Reflect.set(target, key, value, recevier)
    },
    get(target, key, recevier) {
      const res = Reflect.get(target, key, recevier)
      if (isObject(target[key])) {
        return reactive(res) // 如果取值是一个对象递归代理
      }
      return res
    },
  }
  let observed = new Proxy(target, handlers)
  return observed
}

let obj = {
  name: 'test',
  a: [1, 2, 3],
}
let p = reactive(obj)
p.a.push(4)
```

当调用 `p.a` 时，如果属性 a 为一个对象，则继续调用 reactive 方法。<br />![/img/vue3/9.png](/img/vue3/9.png)<br />

<a name="YbcWa"></a>

#### 缓存机制

```javascript
function reactive(target) {
  if (!isObject(target)) {
    return target
  }
  const handlers = {
    set(target, key, value, recevier) {
      if (target.hasOwnProperty(key)) {
        // 如果 key 是私有属性
        trigger()
      }
      return Reflect.set(target, key, value, recevier)
    },
    get(target, key, recevier) {
      const res = Reflect.get(target, key, recevier)
      if (isObject(target[key])) {
        return reactive(res) // 如果取值是一个对象递归代理
      }
      return res
    },
  }
  // 添加测试日志
  console.log('proxy')
  let observed = new Proxy(target, handlers)
  return observed
}

let obj = {
  name: 'test',
  a: [1, 2, 3],
}
let p = reactive(obj)
p = reactive(obj)
p = reactive(obj)
p.a.push(4)
```

![/img/vue3/7.png](/img/vue3/7.png)<br />通过 Weakmap 实现缓存机制， 将 Proxy 放置在<br />

```javascript
const toProxy = new WeakMap() // 存放的是代理后的对象
const toRaw = new WeakMap() // 存放的是代理前的对象

function trigger() {
  // 每次更新完成后 trigger 方法都会触发
  console.log('触发视图更新')
}

function isObject(target) {
  return typeof target === 'obejct' && target !== null
}

function reactive(target) {
  if (!isObject(target)) {
    return target
  }
  // 如果代理表中已经存在了，就把这个结果返回
  let proxy = toProxy.get(target)
  if (proxy) {
    return toProxy.get(target)
  }
  // 如果这个对象已经被代理过了， 则返回这个对象
  if (toRaw.has(target)) {
    return target
  }
  const handlers = {
    set(target, key, value, recevier) {
      if (target.hasOwnProperty(key)) {
        // 如果 key 是私有属性
        trigger()
      }
      return Reflect.set(target, key, value, recevier)
    },
    get(target, key, recevier) {
      const res = Reflect.get(target, key, recevier)
      if (isObject(target[key])) {
        return reactive(res) // 如果取值是一个对象递归代理
      }
      return res
    },
  }
  // 添加测试日志
  console.log('proxy')
  let observed = new Proxy(target, handlers)
  toProxy.set(target, observed) // 原对象 ： 代理后的结果
  toRaw.set(observed, target) // let p = reactive(obj)  p = reactive(p)
  return observed
}

let p = reactive(obj)
p = reactive(obj)
p = reactive(obj)
p.a.push(4)
```

![/img/vue3/8.png](/img/vue3/8.png)<br />第一次 Proxy 为 ` let p = reactive(obj)` ，第二次 Proxy   为 `p.a.push(4)`<br />
<br />

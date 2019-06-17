/**
 * 单例模式
 *
 * 1.保证一个类仅有一个实例，并提供一个访问它的全局访问点， 它限制了类的实例化次数只能一次。
 * 2.单例模式在该实例不存在的情况下，可以通过一个方法创建一个类来实现创建类的新实例；如果实例存在，它会简单返回该对象的引用。
 * 3.单例不同于静态类或对象，可以延迟对它们的初始化。
 * 4.单例可以充当共享资源命名空间使用
 *
 * 利：
 *
 * 弊：
 *
 * 如果单例模式存在的话，也就表明当前的结构的耦合型比较高。
 *
 */
// demo1
// 对象字面量方法实现单例模式
var mySingleton1 = {
  prop1: 'something',
  method1: function() {
    console.log('hello world')
  }
}
// demo2
// 使用闭包的方式在其内部封装变量和函数声明
var mySingleton1 = function() {
  // 私有变量和方法
  var privateVariable = 'something private'
  function showPrivate() {
    console.log(privateVariable)
  }

  // 公有方法
  return {
    publicMethod: function() {
      showPrivate()
    },
    publicVar: 'this public can see this'
  }
}
var singleInstance1 = mySingleton1()
console.log(singleInstance1)

// demo3
// 为了节约资源的目的，只有使用时才初始化
var mySingleton2 = (function() {
  var instance
  function init() {
    // singleton
    // 私有变量和方法
    function privateMethod() {
      console.log('i am private')
    }
    var privateVariable = 'i am also private'
    var privateRandomNumber = Math.random()
    return {
      publicMethod: function() {
        privateMethod()
        console.log('the public can be see me!')
      },
      publicProperty: 'i am also public',
      getRandomNumber: function() {
        return privateRandomNumber
      }
    }
  }
  return {
    getInstance: function() {
      if (!instance) {
        // 单例不同于静态类或对象，可以延迟对它们的初始化。
        instance = init()
      }
      return instance
    }
  }
})()

const singleInstance2 = mySingleton2.getInstance()
console.log(singleInstance2)
console.log(singleInstance2.getRandomNumber())

// 其他实现

// 其他实现1
// 首次初始化 通过构造函数隐式返回
function Universe() {
  // 判断实例是否存在
  if (typeof Universe.instance === 'object') {
    return Universe.instance
  }
  // 其它内容
  this.start_time = 0
  this.bang = 'big'
  // 缓存
  Universe.instance = this
}
// 测试
var uni = new Universe()
var unitest = new Universe()
console.log(uni === unitest)

// 其他实现2
// 重写构造函数
function Universe1() {
  // 缓存实例
  var instance = this

  // 其它内容
  this.start_time = 0
  this.bang = 'big'

  // 重写构造函数
  Universe1 = function() {
    return instance
  }
}
// 测试
var uni1 = new Universe1()
var uni1Test = new Universe1()
console.log(uni1 === uni1Test)

// 其他实现3
// 构造函数 return 对象，如果构造函数 return 的不是一个对象 如数字 123，则返回的是 this
// 动态添加原型属性
function Universe2() {
  // 缓存实例
  var instance
  // 重写构造函数
  Universe2 = function Universe2() {
    // 如果 instance !== 'object' return 语句失效返回 this
    return instance
  }
  // 后期处理原型属性
  Universe2.prototype = this
  // 实例
  instance = new Universe2()
  // 重设构造函数指针
  instance.constructor = Universe2
  //其它功能
  instance.start_time = 0
  instance.bang = 'big'
  return instance
}
// 测试
var uni2 = new Universe2()
var uni2Test = new Universe2()
console.log(uni2 === uni2Test)
// 添加原型属性
Universe2.prototype.nothing = true
var uni1Test1 = new Universe2()
Universe2.prototype.everything = true
var uni2Test2 = new Universe2()
console.log(uni1Test1 === uni2Test2)

// 其他实现4
// 自执行函数
var Universe3
;(function() {
  var instance
  Universe3 = function() {
    if (instance) {
      return instance
    }
    instance = this
    // 其它内容
    this.start_time = 0
    this.bang = 'big'
  }
})()
var uni3 = new Universe3()
var uni3Test = new Universe3()
console.log(uni3 === uni3Test)
uni3.bang = '123'
console.log(uni3Test.bang)

/**
 * 装饰者模式
 *
 * 定义：在不改变现有对象结构的情况下，动态地给该对象添加一些职责。希望在系统中为对象添加额外的功能，而不需要大量修改它们底层代码
 *
 * 优点：
 * 1.采用装饰模式扩展对象的功能比采用继承方式更加灵活
 * 2.可以设计出不同的具体装饰类创造出多个不同行为的组合
 * 缺点
 * 1.装饰模式增加了许多的子类,如果过度使用会使得程序变得很复杂
 *
 * demo:
 * 1. juqery $.extend
 * 2. redux 中间件
 */

// demo1
;(function() {
  // 车辆 vehicle 构造函数
  function vehicle(vehicleType) {
    this.vehicleType = vehicleType || 'car'
    this.model = 'default'
    this.license = '00000-000'
  }

  // 测试基本的 vehicle 类
  var testInstace = new vehicle('car')
  console.log(testInstace)

  // 创建一个 vehicle 实例进行装饰
  var truck = new vehicle('truck')
  // 给 truck 装饰新的功能
  truck.setModel = function(modelName) {
    this.model = modelName
  }
  truck.setColor = function(color) {
    this.color = color
  }
  // 赋值
  truck.setModel('cat')
  truck.setColor('blue')
  console.log(truck)

  // 重新创建实例 检查 vehicle 依然不会被改变
  var secondInstance = new vehicle('car')
  console.log(secondInstance)
})

// demo2
;(function() {
  // 被装饰对象的构造函数
  function MacBook() {
    this.cost = function() {
      return 997
    }
  }
  // Decorator1
  function Memory(macBook) {
    var v = macBook.cost()
    macBook.cost = function() {
      return v + 75
    }
  }
  // Decorator2
  function Engraving(macBook) {
    var v = macBook.cost()
    macBook.cost = function() {
      return v + 200
    }
  }
  // Decorator3
  function Insurance(macBook) {
    var v = macBook.cost()
    macBook.cost = function() {
      return v + 250
    }
  }

  // 实现
  var mb = new MacBook()
  Memory(mb)
  Engraving(mb)
  Insurance(mb)

  console.log(mb.cost())
})

// demo3
;(function() {
  function ConcreteClass() {
    this.performTask = function() {
      this.preTask()
      console.log('doing something')
      this.postTask()
    }
  }
  function AbstractDecorator(decorated) {
    this.performTask = function() {
      decorated.performTask()
    }
  }
  function ConcreteDecoratorClass(decorated) {
    this.base = AbstractDecorator
    this.base(decorated)
    decorated.preTask = function() {
      console.log('pre-calling....')
    }
    decorated.postTask = function() {
      console.log('post-calling....')
    }
  }

  var concrete = new ConcreteClass()
  var decorator1 = new ConcreteDecoratorClass(concrete)
  var decorator2 = new ConcreteDecoratorClass(decorator1)
  decorator2.performTask()
})()

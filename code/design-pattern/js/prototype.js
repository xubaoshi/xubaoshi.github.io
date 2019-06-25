/**
 * 原型模式
 * 使用 javaScript 特有的原型继承特性，创建一个对象作为另外一个对象的 prototype 属性值。
 */

// Object.create
// `Object.create(prototype, optionalDescriptorObjects)`
;(function() {
  var someCar = {
    drive: function() {},
    name: 'mazda 3'
  }
  var anotherCar = Object.create(someCar)

  // Object.create 第二个参数, 设置对象属性
  var vehicle = {
    getModel: function() {
      console.log('车辆的模具是：' + this.model)
    },
    type: 'car'
  }
  var car = Object.create(vehicle, {
    // 只读属性
    id: {
      value: 12345,
      writable: false, // default true
      enumerable: true
    },
    // 枚举属性
    model: {
      value: '福特',
      enumerable: false
    }
  })
  console.log(car)

  // writable
  console.log('originCarId:', car.id)
  car.id = 45678
  console.log('changedCarId:', car.id)

  // enumerable
  for (var i in car) {
    console.log('car property:', i)
  }
})()

// 不直接使用 Object.create
// 不允许定义只读属性，原型对象可能会被修改
;(function() {
  var vehiclePrototype = {
    init: function(carModel) {
      this.model = carModel
    },
    getModel: function() {
      console.log('the model of this vehicle is ..' + this.model)
    }
  }
  function vehicle(model) {
    function F() {}
    F.prototype = vehiclePrototype
    var f = new F()
    f.init(model)
    return f
  }
  var car = vehicle('Ford Escort')
  console.log(car.getModel())
})()

// 另一种实现模式
// 使用立即执行函数 通过使用闭包的方式隔离原型对象
;(function(){
  var beget = (function(){
    function F() {}
    return function(proto) {
      F.prototype = proto
      return new F()
    }
  })()
}())


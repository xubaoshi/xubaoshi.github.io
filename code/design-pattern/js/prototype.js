/**
 * 原型模式
 * 使用 javaScript 特有的原型继承特性，创建一个对象最为另外一个对象的 prototype 属性值。
 */

// Object.create
;`Object.create(prototype, optionalDescriptorObjects)`

var someCar = {
  drive: function() {},
  name: 'mazda 3'
}
var anotherCar = Object.create(someCar)

// Object.create 第二个参数, 设置对象属性
var vehicle = {
  getModel: function() {
    console.log('车辆的模具是：' + this.model)
  }
}
var car = Object.create(vehicle, {
  id: {
    value: 12345,
    enumerable: true
  },
  model: {
    value: '福特'，
    enumerable: true
  }
})

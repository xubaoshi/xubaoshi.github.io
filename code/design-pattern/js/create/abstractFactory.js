/**
 * 抽象工厂模式
 *
 * 定义：提供一个创建一系列相关或相互依赖的对象的接口
 * 由多个抽象类创建出一个类簇
 * 工厂方法是选择单个产品的实现，但是抽象工厂着重的是为一个产品簇的实现，定义在抽象工厂的方法通常是有联系的。
 * 如果抽象工厂里只定义一个方法，直接创建产品，那么就退化成为工厂方法。
 */

// demo1
;(function() {
  var AMDCPU = function(id) {
    this.id = id
  }
  var MSIMainboard = function(id) {
    this.id = id
  }

  var Schema1 = function() {}
  Schema1.prototype = {
    createCPUApi: function() {
      return new AMDCPU(939)
    },
    createMainboardApi: function() {
      return new MSIMainboard(939)
    }
  }
  var Schema2 = function() {}
  Schema2.prototype = {
    createCPUApi: function() {
      return new AMDCPU(1000)
    },
    createMainboardApi: function() {
      return new MSIMainboard(1000)
    }
  }

  var ComputerEngineer = (function() {
    var cpu
    var mainboard
    function prepareHardWare(schema) {
      cpu = schema.createCPUApi()
      mainboard = schema.createMainboardApi()
      console.log(cpu)
      console.log(mainboard)
    }
    var ComputerEngineer = function() {
      cpu = null
      mainboard = null
    }
    ComputerEngineer.prototype = {
      makeComputer: function(schema) {
        prepareHardWare(schema)
      }
    }
    return ComputerEngineer
  })()

  var enginner = new ComputerEngineer()
  var schema1 = new Schema1()
  var schema2 = new Schema2()
  enginner.makeComputer(schema1)
  enginner.makeComputer(schema2)
})()

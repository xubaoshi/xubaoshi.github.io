/**
 * 生成器(建造者)模式
 * 重心在于分离整体构建算法和部件构造。
 * 将一个复杂对象的构造和它的表示分解为多个简单的对象，然后一步步构建而成
 * 产品 、生成器（具体实现每部的对象）、指导者（指导装配过程）
 */

// demo1
;(function() {
  // Product
  var Product = function() {
    this.partA = null
    this.partB = null
    this.partC = null
    this.setPartA = function(partA) {
      this.partA = partA
    }
    this.setPartB = function(partB) {
      this.partB = partB
    }
    this.setPartC = function(partC) {
      this.partC = partC
    }
    this.show = function() {
      console.log('partA:', this.partA)
      console.log('partB:', this.partB)
      console.log('partC:', this.partC)
    }
  }
  // Builder
  var Builder = function() {
    this.product = new Product()
    this.buildPartA = function() {
      this.product.setPartA('build partA!')
    }
    this.buildPartB = function() {
      this.product.setPartB('build partB!')
    }
    this.buildPartC = function() {
      this.product.setPartC('build partC!')
    }
    this.getResult = function() {
      return this.product
    }
  }
  // Director
  var Director = function(builder) {
    this.builder = builder
    this.construct = function() {
      this.builder.buildPartA()
      this.builder.buildPartB()
      this.builder.buildPartC()
      return builder.getResult()
    }
  }

  // 使用
  var builderInstance = new Builder()
  var directorInstance = new Director(builderInstance)
  var product = directorInstance.construct()
  product.show()
})

// demo2 (生成器模式与简单工厂模式组合使用)
;(function() {
  function Shop() {
    this.construct = function(builder) {
      builder.step1()
      builder.step2()
      return builder.get()
    }
  }
  Shop.prototype = {
    sell: function(model) {
      return this.create(model)
    },
    create: function(model) {
      var product
      switch (model) {
        case 'car':
          var carBuilder = new CarBuilder()
          product = this.construct(carBuilder)
          break
        case 'truck':
          var truckBuilder = new TruckBuilder()
          product = this.construct(truckBuilder)
          break
      }
      return product
    }
  }
  function CarBuilder() {
    this.car = null
    this.step1 = function() {
      this.car = new Car()
    }
    this.step2 = function() {
      this.car.addParts()
    }
    this.get = function() {
      return this.car
    }
  }
  function TruckBuilder() {
    this.truck = null
    this.step1 = function() {
      this.truck = new Truck()
    }
    this.step2 = function() {
      this.truck.addParts()
    }
    this.get = function() {
      return this.truck
    }
  }
  function Car() {
    this.doors = 0
    this.addParts = function() {
      this.doors = 4
    }
    this.say = function() {
      console.log('i am a' + this.doors + '-door car')
    }
  }
  function Truck() {
    this.doors = 0
    this.addParts = function() {
      this.doors = 2
    }
    this.say = function() {
      console.log('i am a' + this.doors + '-truck car')
    }
  }
  function run() {
    var shop = new Shop()
    var car = shop.sell('car')
    var truck = shop.sell('truck')

    car.say()
    truck.say()
  }
  run()
})()

/**
 * 生成器模式创建的是复杂对象，其产品的各个部分经常面临着剧烈的变化，但将他们组合在一起却又相对稳定。
 * 1.创建的对象较复杂，由多个部件构成，各部件面临着复杂的变化，但部件之间构造顺序确实稳定的
 * 2.产品的构建过程和对象内部各个部分的算法是相互独立的
 *
 *
 * 抽象工厂模式的主要目的是创建产品簇，这个产品簇里面的单个产品就相当于是构成一个复杂对象的部件对象，
 * 抽象工厂对象创建完成后就立即返回整个产品簇；而生成器模式的主要目的是按照构造算法，一步一步来构建一个复杂的产品对象。
 */

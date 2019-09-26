/**
 * 工厂模式
 * 创建对象涉及高复杂性，同时针对不同的环境生成不同的实例
 * 简单工厂模式: 使用一个类或者方法来生成一个实例。简单工厂模式是由一个工厂对象决定创建出哪一种产品类的实例
 * 复杂工厂模式：使用子类来决定一个成员变量应该是哪个具体类的实例。
 */

// demo1(简单工厂模式)
// 普通自行車店
;(function() {
  var BicycleShop = function() {}
  BicycleShop.prototype = {
    sellBicycle: function(model) {
      var bicycle
      switch (model) {
        case 'A':
          bicycle = new A()
          break
        case 'B':
          bicycle = new B()
          break
        case 'C':
          bicycle = new C()
          break
      }
      return bicycle
    }
  }
  var A = function() {
    console.log('A bicycle')
  }
  var B = function() {
    console.log('B bicycle')
  }
  var C = function() {
    console.log('C bicycle')
  }

  // 使用
  var shop = new BicycleShop()
  shop.sellBicycle('A')
})()
//  demo2(复杂工厂方法模式)
// 引入專賣店概念，自行車店從哪個生產廠家進貨
// 設計抽象類，讓子類根據各自的進貨渠道實現進貨的工作
;(function() {
  // 抽象類
  var BicycleShop = function() {}
  BicycleShop.prototype = {
    sellBicycle: function(model) {
      // 讓子類來完成這個工作
      var bicycle = this.createBicycle(model)
      return bicycle
    },
    // 抽象方法必須子類實現後才能調用
    createBicycle: function() {
      throw new Error('抽象方法必須子類實現後才能調用')
    }
  }
  // 組合寄生式繼承
  function inheritPrototype(subClass, superClass) {
    function F() {}
    F.prototype = superClass.prototype
    var p = new F()
    p.constructor = subClass
    subClass.prototype = p
  }
  // 工廠1
  var OracleBicycleShop = function() {}
  // 繼承
  inheritPrototype(OracleBicycleShop, BicycleShop)
  // 實現
  OracleBicycleShop.prototype.createBicycle = function(model) {
    var bicycle
    switch (model) {
      case 'speedster':
        bicycle = new OracleSpeedster()
        break
      case 'lowrider':
        bicycle = new OracleLowrider()
        break
      case 'Alien':
        bicycle = new OracleAlien()
        break
    }
    return bicycle
  }
  var OracleSpeedster = function() {
    console.log('oracle speed ster')
  }
  var OracleLowrider = function() {
    console.log('oracle low rider')
  }
  var OracleAlien = function() {
    console.log('oracle alien')
  }

  // 工廠2
  var IBMBicycleShop = function() {}
  // 繼承
  inheritPrototype(IBMBicycleShop, BicycleShop)
  // 實現
  IBMBicycleShop.prototype.createBicycle = function(model) {
    var bicycle
    // 生產自行車
    switch (model) {
      case 'speedster':
        bicycle = new IBMSpeedster()
        break
      case 'lowrider':
        bicycle = new IBMLowrider()
        break
      case 'Alien':
        bicycle = new IBMAlien()
        break
    }
    return bicycle
  }
  var IBMSpeedster = function() {
    console.log('ibm speed ster')
  }
  var IBMLowrider = function() {
    console.log('ibm low rider')
  }
  var IBMAlien = function() {
    console.log('ibm alien')
  }

  // oracle 店購買
  var oracleShop = new OracleBicycleShop()
  var newBicycle1 = oracleShop.sellBicycle('speedster')

  // IBM 店購買
  var ibmShop = new IBMBicycleShop()
  var newBicycle2 = ibmShop.sellBicycle('Alien')
})()
/**
 * 复杂工厂模式和简单工厂模式的区别在于，簡單工厂模式使用一个类或者对象创建实例而复杂工廠模式則是使用一个子类创建实例，
 * 复杂工厂模式是一个将其成员对象的实例化推迟到子类中进行。
 *
 * 适用场合：
 * 1.动态实现
 * 2.节省设置开销
 * 3.用许多小型对象组成一个大对象
 */

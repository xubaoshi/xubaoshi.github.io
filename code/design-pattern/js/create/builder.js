/**
 * 生成器模式
 * 重心在于分离整体构建算法和部件构造。
 * 生成器（具体实现每部的对象） 指导者（指导装配过程）
 */

// demo1
;function() {
  var InsuranceContract = (function() {
    // 指导者
    var InsuranceContract = function(builder) {
      this.contractId = builder.getContractId()
      this.personName = builder.getPersonName()
      this.companyName = builder.getCompanyName()
      this.beginDate = builder.getBeginDate()
      this.endDate = builder.getEndDate()
      this.otherDate = builder.getOtherDate()
    }
    InsuranceContract.prototype = {
      someOperation: function() {
        console.log(
          'Now in Insurance Contact someOperation = ' + this.contractId
        )
      }
    }

    // 构造器
    var ContractBuilder = function(contractId, beginDate, endDate) {
      this.contractId = contractId
      this.beginDate = beginDate
      this.endDate = endDate
    }
    ContractBuilder.prototype = {
      setPersonName: function(personName) {
        this.personName = personName
        return this
      },
      setCompanyName: function(companyName) {
        this.companyName = companyName
        return this
      },
      setOtherDate: function(otherDate) {
        this.otherDate = otherDate
        return this
      },
      getContractId: function() {
        return this.contractId
      },
      getPersonName: function() {
        return this.personName
      },
      getCompanyName: function() {
        return this.companyName
      },
      getBeginDate: function() {
        return this.beginDate
      },
      getEndDate: function() {
        return this.endDate
      },
      getOtherDate: function() {
        return this.otherDate
      },
      // 构建真正的对象并返回
      build: function() {
        if (!this.contractId || this.contractId.trim().length === 0) {
          throw new Error('合同编号不能为空')
        }
        // ...
        return new InsuranceContract(this)
      }
    }

    InsuranceContract.ContractBuilder = ContractBuilder
    return InsuranceContract
  })()

  var builder = new InsuranceContract.ContractBuilder('001', 123456, 6789)
  var contract = builder
    .setCompanyName(11111)
    .setPersonName('luke')
    .setOtherDate(12345678)
    .build()
  console.log(contract)
}

// demo2 (生成器模式与简单工厂模式组合使用)
;function(){
function Shop() {
  this.construct = function(builder) {
    builder.step1()
    builder.step2()
    return builder.get()
  }
}
function CarBuilder () {
  this.car = null
  this.step1 = function(){
    this.car = new Car()
  }
  this.step2 = function() {
    this.car.addParts()
  }
  this.get = function(){
    retun this.car
  }
}
function TruckBuilder() {
  this.truck = null
  this.step1 = function() {
    this.truck = new Truck()
  }
  this.step2 = function(){
    this.truck.addParts()
  }
  this.get =  function() {
    return this.truck
  }
}
function Car() {
  this.doors = 0
  this.addParts = function() {
    this.doors = 4
  }
  this.say = function(){
    console.log('i am a' + this.doors + '-door car')
  }
}
function Truck() {
  this.doors = 0
  this.addParts = function() {
    this.doors = 2
  }
  this.say = function() {
    console.log('i am a' + this.doors + '-door car')
  }
}
function run() {
   var shop = new Shop()

   var carBuilder = new CarBuilder()
   var truckBuilder = new TruckBuilder()

   var car = shop.construct(carBuilder)
   var truck = shop.construct(truckBuilder)

   car.say()
   truck.say()
}
}()
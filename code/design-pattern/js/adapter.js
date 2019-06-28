/**
 * 适配器模式
 * 将一个类或对象的接口转化为客户希望的另一个接口，适配器模式使得原来由于接口不兼容而不能一起工作的那些类和对象可以一起工作。
 */

// demo1
;(function() {
  // 方法函数
  // 鸭子
  var Duck = function() {}
  Duck.prototype.fly = function() {
    throw new Error('该方法必须被重写')
  }
  Duck.prototype.quack = function() {
    throw new Error('该方法必须被重写')
  }
  // 火鸡
  var Turkey = function() {}
  Turkey.prototype.fly = function() {
    throw new Error('该方法必须被重写')
  }
  Turkey.prototype.gobble = function() {
    throw new Error('该方法必须被重写')
  }

  // 绿头鸭子构造函数
  var MallardDuck = function() {
    Duck.apply(this)
    console.log(this)
  }
  MallardDuck.prototype = new Duck()
  MallardDuck.prototype.fly = function() {
    console.log('可以飞翔很长的距离')
  }
  MallardDuck.prototype.quack = function() {
    console.log('嘎嘎！嘎嘎！')
  }
  // 野生火鸡构造函数
  var WildTurkey = function() {
    Turkey.apply(this)
  }
  WildTurkey.prototype = new Turkey()
  WildTurkey.prototype.fly = function() {
    console.log('飞翔的距离貌似有点短')
  }
  WildTurkey.prototype.gobble = function() {
    console.log('咯咯！咯咯！')
  }

  var oMallardDuck = new MallardDuck()
  var oWildTurkey = new WildTurkey()

  // 原有鸭子行为
  oMallardDuck.fly()
  oMallardDuck.quack()
  // 原有火鸡行为
  oWildTurkey.fly()
  oWildTurkey.gobble()

  // 火鸡支持鸭子的 quack 方法
  var TurkeyAdapter = function(oTurkey) {
    Duck.apply(this)
    this.oTurkey = oTurkey
  }
  TurkeyAdapter.prototype = new Duck()
  TurkeyAdapter.prototype.quack = function() {
    this.oTurkey.gobble()
  }
  TurkeyAdapter.prototype.fly = function() {
    this.oTurkey.fly()
  }
  // 适配器火鸡的行为
  var oTurkeyAdapter = new TurkeyAdapter(oWildTurkey)
  oTurkeyAdapter.fly()
  oTurkeyAdapter.quack()
})()

/**
 *  使用场景：
 *  1. 使用一个已经存在的对象，但其方法或属性接口不符合你的要求
 *  2. 创建一个可复用的对象，该对象可以与其它不相关的对象或不可见的对象协同工作
 *  3. 使用已存在的对象，但是不能对每一个都进行原型继承以匹配他都接口。
 *
 *  桥接的目的是将接口部分和实现部分分离，适配器则意味着改变一个已有对象的接口·
 */

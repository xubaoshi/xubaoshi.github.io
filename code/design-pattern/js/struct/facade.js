/**
 * 外观模式
 * 通过为多个复杂的子系统提供一个一致的接口，使这些子系统更加容易被访问，外部应用程序不用关心内部子系统的具体细节。
 *
 * 优点:
 * 1.降低了子系统与客户端之间的耦合度，是的子系统的变化不影响调用它的客户类
 * 2.对客户屏蔽了子系统组件，减少了客户处理的对象数目，使子系统使用起来更加容易
 * 3.降低了大型软件系统编译的依赖性，简化了系统在不同平台的移植过程
 * 缺点：
 * 1.不能很好地限制客户使用子系统类
 * 2.增加新的子系统可能需要修改外观类或客户端的源代码，违背了开闭原则
 *
 *  角色： 1.外观角色
 *        2.子系统角色
 *        3.客户角色
 *
 * 应用场景：
 * 1.对分层机构系统构建时，使用外观模式定义子系统中每层的入口点可以简化子系统之间的依赖关系
 * 2.当一个复杂系统的子系统很多时，外观模式可以为系统设计一个简单的接口供外界访问
 * 3.当客户端与多个子系统之间存在很大的联系时，引入外观模式可以将它们分离，从而提高子系统的独立性和可移植性
 */

// demo1
;(function() {
  var Mortgage = function(name) {
    this.name = name
  }
  Mortgage.prototype = {
    applyFor: function(amount) {
      var result = 'approved'
      if (!new Bank().verify(this.name, amount)) {
        result = 'denied'
      } else if (!new Credit().get(this.name)) {
        result = 'denied'
      } else if (!new Background().check(this.name)) {
        result = 'denied'
      }
      return (
        this.name + ' has been ' + result + ' for a ' + amount + ' mortgage'
      )
    }
  }
  var Bank = function() {
    this.verify = function(name, amount) {
      return true
    }
  }
  var Credit = function() {
    this.get = function(name) {
      return true
    }
  }
  var Background = function() {
    this.check = function(name) {
      return true
    }
  }
  function run() {
    var mortgage = new Mortgage('Joan')
    var result = mortgage.applyFor('$100000')
    console.log(result)
  }
  run()
})()

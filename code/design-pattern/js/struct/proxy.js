/**
 * 代理模式
 *
 * 代理顾名思义帮助别人做事
 * 代理模式使得代理对象控制具体对象的引用
 */

// demo1
// 代人送花
;(function() {
  var girl = function(name) {
    this.name = name
  }
  var boy = function(name,girl) {
    this.name = name
    this.girl = girl
    this.sendGift = function(gift) {
      console.log('Hi ' + girl.name + ', ' + this.name +  '送你一个礼物： ' + gift)
    }
  }
  var proxyMan = function(boyName, girl) {
    this.girl = girl
    this.sendGift = function(gift) {
      new boy(boyName, girl).sendGift(gift)
    }
  }
  var proxyMan1 = new proxyMan('tom',new girl('jerry'))
  proxyMan1.sendGift('鲜花')
})()


// demo2
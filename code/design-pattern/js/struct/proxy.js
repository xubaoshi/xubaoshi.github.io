/**
 * 代理模式
 *
 * 代理顾名思义帮助别人做事, 可以理解为在出发点到目的地之间的中间层
 * 代理模式使得代理对象控制具体对象的引用
 */

// demo1
// 代人送花
;(function() {
  var girl = function(name) {
    this.name = name
  }
  var boy = function(name, girl) {
    this.name = name
    this.girl = girl
    this.sendGift = function(gift) {
      console.log(
        'Hi ' + girl.name + ', ' + this.name + '送你一个礼物： ' + gift
      )
    }
  }
  var proxyMan = function(boyName, girl) {
    this.girl = girl
    this.sendGift = function(gift) {
      new boy(boyName, girl).sendGift(gift)
    }
  }
  var proxyMan1 = new proxyMan('tom', new girl('jerry'))
  proxyMan1.sendGift('鲜花')
})()

/**
 * 代理模式的变体有很多，有：保护代理、虚拟代理、缓存代理、防火墙代理、远程代理、智能引用代理、写时复制代理
 */

/**
 * demo2（保护代理）
 * 说明： 控制不同权限的对象对本体对象的访问权限
 * 游客：         code="000"  不具备任何权限
 * 注册普通用户：  code="001"  发帖
 * 论坛管理者：    code="002"  审核、删帖
 * 系统管理者 ：   code="003"  审核、删帖、发帖
 */
;(function() {
  // 用户本体
  function User(name, code) {
    this.name = name
    this.code = code
  }
  User.prototype = {
    getName: function() {
      return this.name
    },
    getCode: function() {
      return this.code
    },
    post: function() {
      console.log('发帖子')
    },
    remove: function() {
      console.log('删除帖子')
    },
    check: function() {
      console.log('审核帖子')
    },
    comment: function() {
      console.log('回复帖子')
    }
  }

  // 代理类
  function Forum(user) {
    this.user = user
  }
  Forum.prototype = {
    getUser: function() {
      return this.user
    },
    post: function() {
      if (this.user.getCode() === '001' || this.user.getCode() === '003') {
        return this.user.post()
      }
      console.log('没有权限发帖子')
    },
    remove: function() {
      if (this.user.getCode() === '002' || this.user.getCode() === '003') {
        return this.user.remove()
      }
      console.log('没有权限删除帖子')
    },
    check: function() {
      if (this.user.getCode() === '002' || this.user.getCode() === '003') {
        return this.user.check()
      }
      console.log('没有权限审核帖子')
    },
    comment: function() {
      if (this.user.getCode() === '003') {
        return this.user.comment()
      }
      console.log('没有权限回复帖子')
    }
  }

  // 测试
  function ForumClient() {
    this.run = function() {
      new Forum(new User('bigbear', '003'))
    }
  }
})()

/**
 * demo3（虚拟代理）
 * 将调用本体方法的请求进行管理，等到本体合适执行时再执行。
 * 将开销很大的对象，延迟到真正需要它的时候再执行
 */
// 实现图片预加载功能
;(function(){
  var myImage = (function(){
    var imageNode = document.createElement('img')
    document.body.appendChild(imageNode)
    return {
      setSrc: function(src) {
        imageNode.src = src
      }
    }
  })()

  // 代理类
  var proxyImage= (function(){
    var img = new Image()
    img.onload = function() {
      myImage.setSrc(this.src)
    }
    return {
      setSrc: function(src) {
        myImage.setSrc('本地图片地址')
        // 缓存完毕后触发 img 的 onload 事件
        img.src = src
      }
    }
  })() 
}){}

// 合并HTTP请求
// 通过代理函数收集一段时间请求，一次性发送给服务器，减少频繁的网络请求带来的极大开销
;(function(){
  var synchronousFile = function(id) {
    console.log('开始同步上传文件，id为：' + id)
  }

  // 代理收集一段时间的同步请求，统一发送
  var proxySynchronousFile = (function(){
    var cache = [] // 缓存数组
    var timer
    return function(id) {
      cache.push(id)
      if (timer) {
        return
      }
      timer = setTimeout(function(){
        synchronousFile(cache.join(','))
        clearTimeout(timer)
        timer = null
        cache.length = 0
      },2000)
    }
  })()

  var checkbox = document.getElementsByTagName('input')
  for(var i=0;c=checkbox[i++];) {
    c.onclick = function() {
      if (this.check === true) {
        proxySynchronousFile(this.id)
      }
    }
  }
})()

/**
 * 缓存代理
 * 可以为开销大的一些运算结果提供暂时性的存储，如果再次传进相同的参数时，直接返回结果。
 */
;(function(){
  var mult = function() {
    var a = 1
    for(var i=0;i<arguments.length; i++) {
      a = a*arguments[i]
    }
    return a
  }
  var plus = function() {
    var a = 0
    for(c)
  }
})()
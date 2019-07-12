/**
 * 桥接模式
 * 将抽象部分与实现部分分离
 *
 * 优点： 抽象和实现充分的解耦，有利于分层产生更好的结构化系统，可以提高可扩展性, 弱化对象间的耦合程度
 * 缺点： 大量的类将导致开发成本的增加，同时性能方面也会有所减少
 */

// https://zh.wikipedia.org/wiki/%E6%A9%8B%E6%8E%A5%E6%A8%A1%E5%BC%8F

// bad
addEvent(Element, 'click', getBeerById)
function getBeerById(e) {
  // 事件对象作为参数传递给函数， 而本例并没有使用这个参数，只是从 this 中获取id ，如果当前上下文中并没有 id ，或导致当前方法失效。
  var id = this.id
  asyncRequest('GET', `beer.uri?id=${id}`, function(res) {
    console.log(`Request Beer: ${res.responseText}`)
  })
}
// good
function getBeerById(id, callback) {
  asyncRequest('GET', `beer.uri?id=${id}`, function(res) {
    // 回调 传入返回值
    callback(res)
  })
}
addEvent(Element, 'click', getBeerByIdBridge)
function getBeerByIdBridge(e) {
  // 不针对实现编程而针对接口编程
  getBeerById(this.id, function(res) {
    console.log(`Request Beer：${res.responseText}`)
  })
}




/**
 * 与适配器不同之处： 适配器模式主要针对的是同一接口在不同环境中兼容。 （jquery .css 方法）
 * 与门面（Facade）模式不同，门面模式主要针对的是根据用户的需要提供一个简化流程的接口
 */

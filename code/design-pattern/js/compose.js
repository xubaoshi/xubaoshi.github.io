/**
 * 组合模式（compose）
 *
 * 希望表示对象的部分及整体层次结构时，使得对单个对象和组合对象的使用具有一致性
 * jquery addClass $('#') $('.')
 * DOM 父节点子节点都有添加、删除、遍历子节点的通用功能
 */

// 创建菜单为例
// 菜单上列出了该餐厅所有的菜品，有早餐、午餐、晚餐等等，每种餐都有各种各样的菜单项，
// 假设不管是菜单项还是整个菜单都应该是可以打印的，而且可以添加子项，比如午餐可以添加新菜品，而菜单项咖啡也可以添加糖啊什么的

// 抽象类函数
var MenuComponent = function() {}
MenuComponent.prototype.getName = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.getDescription = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.getPrice = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.isVegetarian = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.print = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.add = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.remove = function() {
  throw new Error('该方法必须被重写')
}
MenuComponent.prototype.getChild = function() {
  throw new Error('该方法必须被重写')
}

// 基本的菜品项
var MenuItem = function(sName, sDescription, bVegetarian, nPrice) {
  MenuComponent.apply(this)
  this.sName = sName
  this.sDescription = sDescription
  this.bVegetarian = bVegetarian
  this.nPrice = nPrice
}
MenuItem.prototype = new MenuComponent()
MenuItem.prototype.getName = function() {
  return this.sDescription
}
MenuItem.prototype.getPrice = function() {
  return this.nPrice
}
MenuItem.prototype.isVegetarian = function() {
  return this.bVegetarian
}
MenuItem.prototype.print = function() {
  console.log(
    this.getName() +
      ':' +
      this.getDescription() +
      ',' +
      this.getPrice() +
      'euros'
  )
}

// 菜品
var Menu = function(sName, sDescription) {
  MenuComponent.apply(this)
  this.aMenuComponents = []
  this.sName = sName
  this.sDescription = sDescription
  this.createIterator = function() {
    throw new Error('该方法必须被重写')
  }
}
Menu.prototype = new MenuComponent()
Menu.prototype.add = function(oMenuComponent) {
  // 添加子菜品
  this.aMenuComponents.push(oMenuComponent)
}
Menu.prototype.remove = function(oMenuComponent) {}

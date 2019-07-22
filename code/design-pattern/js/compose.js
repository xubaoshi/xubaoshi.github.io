/**
 * 组合模式（compose）
 *
 * 优点：
 *  1.希望表示对象的部分及整体层次结构时，使得对单个对象和组合对象的使用具有一致性
 *  2.更容易在组合体内加入新的对象，客户端不会因为加入了新的对象而更改源代码，满足‘开闭原则’
 * 缺点：
 * 1.系统中每个对象看起来与其他对象差不多，他们的区别只有在运行时才会显示出来，这会使代码非常难以理解
 * 2.不容易限制容器的构件
 * 3.不容易使用继承的方法来增加构件的新增功能
 * demo：
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
  return this.sName
}
MenuItem.prototype.getDescription = function() {
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
Menu.prototype.remove = function(oMenuComponent) {
  // 删除子菜品
  var aMenuItems = []
  var nLenMenuItemsLength = this.aMenuComponents.length
  var oItem = null
  for (
    var nMenuItemIndex = 0;
    nMenuItemIndex < nLenMenuItemsLength;
    nMenuItemIndex = nMenuItemIndex + 1
  ) {
    oItem = this.aMenuComponents[nMenuItemIndex]
    if (oItem !== oMenuComponent) {
      aMenuItems.push(oItem)
    }
  }
}
Menu.prototype.getChild = function(nIndex) {
  // 获取指定菜品
  return this.aMenuComponents[nIndex]
}
Menu.prototype.getName = function() {
  return this.sName
}
Menu.prototype.getDescription = function() {
  return this.sDescription
}
Menu.prototype.print = function() {
  console.log(this.getName() + ': ' + this.getDescription())
  console.log('-------------------------------------------')

  var nLenMenuComponents = this.aMenuComponents.length
  var oMenuComponent = null

  for (
    var nMenuComponentIndex = 0;
    nMenuComponentIndex < nLenMenuComponents;
    nMenuComponentIndex = nMenuComponentIndex + 1
  ) {
    oMenuComponent = this.aMenuComponents[nMenuComponentIndex]
    oMenuComponent.print()
  }
}

// 指定菜品
var DinnerMenu = function() {
  Menu.apply(this)
}
DinnerMenu.prototype = new Menu()
var CafeMenu = function() {
  Menu.apply(this)
}
CafeMenu.prototype = new Menu()
var PancakeHouseMenu = function() {
  Menu.apply(this)
}
PancakeHouseMenu.prototype = new Menu()

// 菜单本
var Mattress = function(aMenus) {
  this.aMenus = aMenus
}
Mattress.prototype.printMenu = function() {
  this.aMenus.print()
}

// 调用
var oPanCakeHouseMenu = new Menu('Pancake House Menu', 'Breakfast')
var oDinnerMenu = new Menu('Dinner Menu', 'Lunch')
var OCoffeeMenu = new Menu('Cafe Menu', 'Dinner')
var oAllMenus = new Menu('All MENUS', 'All menus combined')

oAllMenus.add(oPanCakeHouseMenu)
oAllMenus.add(oDinnerMenu)

oDinnerMenu.add(
  new MenuItem(
    'Pasta',
    'Spaghtti with Marinara Sauce, and a slice of sourdough bread',
    true,
    3.89
  )
)
oDinnerMenu.add(OCoffeeMenu)

OCoffeeMenu.add(new MenuItem('Express', 'Coffee from machince', false, 0.99))

var oMattress = new Mattress(oAllMenus)
console.log('-------------------------------------------')
oMattress.printMenu()
console.log('-------------------------------------------')

//===========================demo 2==========================================

/**
 * 背景：首页添加一个新闻模块，新闻的内容是根据用户平时关注的内容挖掘的，因此有的人可能会显示文字新闻，
   有的人会显示图片新闻，甚至有的人显示的新闻是一个直播链接，方便用户观看。。
 */

// 寄生式继承
function inheritPrototype(subClass, superClass) {
  function F() {}
  F.prototype = superClass.prototype
  var p = new F()
  p.constrcutor = subClass
  subClass.prototype = p
}

// 抽象类函数
var News = function() {
  // 子组件
  this.children = []
  // 当前元素
  this.element = null
}
News.prototype = {
  init: function() {
    throw new Error('请重写你的方法')
  },
  add: function() {
    throw new Error('请重写你的方法')
  }，
  getElement: function() {
    throw new Error('请重写你的方法')
  }
}

// 容器类（包裹新闻内容）
var Container = function(id,parent) {
  // 继承抽象类
  News.call(this)
  // 模块id
  this.id = id
  // 父容器
  this.parent = parent
  // 初始化
  this.init()
}
inheritPrototype(Container, News)
Container.prototype.init = function() {
  this.element = document.createElement('ul')
  this.element.id = this.id
  this.element.className = 'new-container'
}
Container.prototype.add = function(child) {
  // 在子元素中插入元素
  this.children.push(child)
  // 插入当前元素树中
  this.element.push(child.getElement())
  return this
}
Container.prototype.getElement = function() {
  return this.element
}
Container.prototype.show = function() {
  this.parent.appendChild(this.element)
}
// 子类
var Item = function(classname) {
  News.call(this)
  this.classname = classname || ''
  this.init()
}
inheritPrototype(Item, News)
Item.prototype.init = function() {
  this.element = document.createElement('li')
  this.element.className = this.classname
}
Item.prototype.add = function(child) {
  this.children.push(child)
  this.element.appendChild(child.getElement())
  return this
}
Item.prototype.getElement = function() {
  return this.element
}
// 新闻类组
var NewsGroup = function(classname) {
  News.call(this)
  this.classname = classname || ''
  this.init()
}
inheritPrototype(NewsGroup, News)
NewsGroup.prototype.init = function() {
  this.element = document.createElement('div')
  this.element.classname = this.classname
}
NewsGroup.prototype.add = function() {child} {
  this.children.push(child)
  this.element.appendChild(child.getElement())
  return this
}
NewsGroup.prototype.getElement = function() {
  return this.element
}
// 创建图片新闻类
var ImageNews = function(url,href,classname){
  News.call(this)
  this.url = url || ''
  this.href = href || ''
  this.classname = classname || 'normal'
  this.init()
}
inheritPrototype(ImageNews, News)
ImageNews.prototype.init = function() {
  this.element = document.createElement('a')
  var img = new Image()
  img.src = this.url
  this.element.appendChild(img)
  this.element.className = 'image-news ' + this.classname
  this.element.href = this.href
}
ImageNews.prototype.add = function() {}
ImageNews.prototype.getElement = function() {
  return this.element
}

// video or live 新闻类
var IconNews = function(text, href, type) {
  News.call(this)
  this.text = text || ''
  this.href = href || '#'
  this.type = type || 'video'
  this.init()
}
inheritPrototype(IconNews, News)
IconNews.prototype.init = function() {
  this.element = document.createElement('a')
  this.element.innerHTML = this.text
  this.element.href = this.href
}
IconNews.prototype.add = function() {}
IconNews.prototype.getElement = function() {
  return this.element
}
// 文本 新闻类
var EasyNews = function() {
  News.call(this)
  this.text = text || ''
  this.href = href || ''
  this.init()
}
inheritPrototype(EasyNews,News)
EasyNews.prototype.init =  function() {
  this.element =  document.createElement('a')
  this.element.innerHTML = this.text
  this.element.href = this.href
  this.element.className = 'text'
}
EasyNews.prototype.add = function(){}
EasyNews.prototype.getElement = function() {
  return this.element
}

// 使用

var news1 = new Container('news', document.body);
news1.add(
  new Item('normal').add(
    new IconNews('哈哈哈', '#', 'video')
  )
).add(
  new Item('normal').add(
    new IconNews('呵呵呵', '#', 'live')
  )
).add(
  new Item('normal').add(
    new NewsGroup('has-img').add(
      new ImageNews('img/1.jpg', '#', 'small')
    ).add(
      new EasyNews('aaaa', '#')
    ).add(
      new EasyNews('五大雷人跑步机', '#')
    )
  )
).show();
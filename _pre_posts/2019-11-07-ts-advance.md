---
layout: post
title: 'typescript 学习记录—进阶篇'
date: '2019-12-28'
author: 'XuBaoshi'
header-img: 'img/post-bg-07.jpg'
---

# typescript 学习记录—进阶篇

## 类型别名

类型别名用来给一个类型起个新名字

```typescript
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}
```

## 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个

```typescript
type EventNames = 'click' | 'scroll' | 'mousemove'
function handleEvent(ele: Element, event: EventNames) {}
// right
handleEvent(document.getElementById('hello'), 'scroll')
// error
handleEvent(document.getElementById('world'), 'dbclick')
// index.ts(10,47): error TS2345: Argument of type '"dbclick"' is not assignable to parameter of type 'EventNames'.
```

ps: 类型别名与字符串字面量类型都是使用 type 进行定义

## 元组

数组合并了相同类型的对象，而元祖 （Turple） 合并了不同类型的对象

```typescript
// 定义一对值分别为 string 和 number 的元祖
let tom: [string, number] = ['Tom', 25]
// 赋值与访问
let tom1: [string, number]
tom1[0] = 'Tom'
tom1[1] = 25
// 可以只赋值其中一项
let tom2: [string, number]
tom2[0] = 'Tom'
```

直接对元祖类型初始化或直接赋值时，需要提供所有元祖类型中指定的项

```typescript
let tom3: [string, number]
tom3 = ['Tom']
// Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

当添加越界的元素时，它的类型会被限制为元祖中类型

```typescript
let tom4: [string, number]
tom4 = ['Tom', 25]
tom4.push('male')
tom4.push(355)

tom4.push(true)
// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

## 枚举

枚举类型用于取值被限定在一定范围内的场景，如：一周只能有七天等

```typescript
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
```

枚举成员会被赋值为从 0 开始递增的数字， 同时也会对枚举值到枚举名进行反向映射

```typescript
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
console.log(Days['Sun'] === 0) // true
console.log(Days['Mon'] === 1) // true
console.log(Days['Tue'] === 2) // true

console.log(Days[0] === 'Sun') // true
console.log(Days[1] === 'Mon') // true
console.log(Days[2] === 'Tue') // true
```

编译后的结果

```typescript
;(function(Days) {
  Days[(Days['Sun'] = 0)] = 'Sun'
  Days[(Days['Mon'] = 1)] = 'Mon'
  Days[(Days['Tue'] = 2)] = 'Tue'
  Days[(Days['Wed'] = 3)] = 'Wed'
  Days[(Days['Thu'] = 4)] = 'Thu'
  Days[(Days['Fri'] = 5)] = 'Fri'
  Days[(Days['Sat'] = 6)] = 'Sat'
})(Days || (Days = {}))
```

手动赋值同时未手动赋值的枚举会接着上一个枚举项递增

```typescript
enum Days {
  Sun = 7,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
```

如果手动赋值的枚举项与手动赋值的重复了 ， ts 是不会察觉到的

```typescript
enum Days {
  Sun = 3,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri
}
console.log(Days['Sun'] === 3) // true
console.log(Days['Wed'] === 3) // true
console.log(Days[3] === 'Sun') // false
console.log(Days[3] === 'Wed') // true

// 当递增至 3 时 Wed 的值将 Sun 手动赋值的 3 覆盖了
```

编译结果

```typescript
var Days
;(function(Days) {
  Days[(Days['Sun'] = 3)] = 'Sun'
  Days[(Days['Mon'] = 1)] = 'Mon'
  Days[(Days['Tue'] = 2)] = 'Tue'
  Days[(Days['Wed'] = 3)] = 'Wed'
  Days[(Days['Thu'] = 4)] = 'Thu'
  Days[(Days['Fri'] = 5)] = 'Fri'
  Days[(Days['Sat'] = 6)] = 'Sat'
})(Days || (Days = {}))
```

手动赋值可以不是数字，可以使用类型断言让 tsc 无视类型检查

```typescript
enum Days {
  Sun = 7,
  Mon = 1.5,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
console.log(Days['Sun'] === 7) // true
console.log(Days['Mon'] === 1.5) // true
console.log(Days['Tue'] === 2.5) // true
console.log(Days['Sat'] === 6.5) // true
```

常数项和计算所得项

```typescript
enum Color {
  Red,
  Green,
  Blue = 'blue'.length
}
```

"blue".length 就是一个计算所得项，上面的例子是不会报错的，但是如果紧接在后面的是未赋值的项，那么它会因此无法获得初始值而报错

```typescript
enum Color1 {Red='red'.length , Green, Blue}
index.ts(120,33): error TS1061: Enum member must have initialize
```

常数枚举

常数枚举与普通枚举的区别是，常数枚举会在编译中删除，并且不能计算成员

```typescript
const enum Directions {
  Up,
  Down,
  Left,
  Right
}
let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right
]
```

编译结果

```typescript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */]
```

外部枚举

外部枚举是使用 `declare enum` 定义的枚举类型

```typescript
declare enum Directions {
  Up,
  Down,
  Left,
  Right
}
let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right
]
```

declare 定义的类型只会用于编译时的检查，编译结果中会被删除

编译结果

```typescript
var directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right
]
```

同时使用 `declare` 与 `const`

```typescript
declare const enum Directions2 {
  Up,
  Down,
  Left,
  Right
}
let directions2 = [
  Directions2.Up,
  Directions2.Down,
  Directions2.Left,
  Directions2.Right
]
```

编译结果

```typescript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */]
```

## 类

javascript 通过构造函数实现类的概念，通过原型链实现继承， ts 除了实现了所有 es6 中的功能外，并添加了一些新的功能

### 类的概念

1.  类（Class）：定义了一个事件特点，包含它的属性和方法
2.  对象： 类的实例通过 new 生成

### 面向对象编程的三大特性： 封装、继承、多态

#### 封装

将对数据的操作细节隐藏起来,只暴露对外的接口。使用端不需要知道实现细节，使用端无法任意更改对象内部数据

#### 继承

子类继承父类。子类除了拥有父类的特性外，还有一些具体的属性

#### 多态

由继承产生的相关的不同的类。 如： Cat、Dog 类， 继承自 Animal 类， 但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法

#### 存取器

用以改变属性的读取和赋值行为

#### 修饰符

使用一些关键字限定成员或类型的性质，如 public 等

#### 抽象类

抽象类是供其他类继承的基类，抽象类不允许被实例化，抽象类中抽象方法必须在子类中实现

#### 接口

不同类之间公有的属性或方法可以抽象成一个接口。接口可以被类实现。一个类智能继承另一个类，但是可以实现多个接口

### 类的定义

```typescript
class Animal {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    return `my name is ${this.name}`
  }
}
let a = new Animal('jack')
console.log(a.sayHi())
```

### 类的继承

使用 extends 关键字实现继承， 子类中使用 super 关键字来调用父类的构造函数和方法

```typescript
class Cat extends Animal {
  constructor(name) {
    super(name)
    console.log(this.name)
  }
  sayHi() {
    return `Meow， ${super.sayHi()}`
  }
}
```

### 存取器

```typescript
class Animal {
  constructor(name) {
    this.name = name
  }
  get name() {
    return 'jack'
  }
  set name(value) {
    console.log('setter: ' + value)
  }
}
let a = new Animal('kitty') // setter: Kitty
a.name = 'Tom' // setter: Tom
console.log(a.name) // Jack
```

### 静态方法

static 修饰符修饰的方法为静态方法，他们不需要进行实例化，而是直接通过类来调用

```typescript
class Animal {
  constructor(name) {
    this.name = name
  }
  static isAnimal(a) {
    return a instanceof Animal
  }
}
let b = new Animal('jack')
Animal.isAnimal(b) // true
b.isAnimal(b) // TypeError: a.isAnimal is not a function
```

### es6 继承 实现 class 原理 (es5)

1. class 的构造函数必须使用 new 进行调用，普通构造函数不用 new 也可执行
2. class 不存在变量提升，es5 中的 function 存在变量提升
3. class 内部定义的方法不可枚举，es5 在 prototype 上定义的方法可以枚举

```typescript
function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType
    }
  })
  Object.setPrototypeOf(subType, superType)
}
// Object.setPrototypeOf 方法的作用与 `__proto__` 相同，用来设置一个对象的 prototype 对象，返回参数对象本身。该方法等同于下面的方法
function (obj, proto) {
  obj.__proto__ = proto
  return obj
}
```

### es7 中类的用法

#### 实例属性

es6 中属性使用 this.xxx 定义 es7 中可以直接在类里进行定义

```typescript
class Animal {
  name = 'Jack'
  constructor() {
    // ...
  }
}
```

#### 静态类型

```typescript
class Animal {
  static num = 42
  constructor() {
    // ...
  }
}
```

#### 修饰符 public、private、protected

public

public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性都是 public

```typescript
class Animal {
  public name
  public constructor(name) {
    this.name = name
  }
}
let a6 = new Animal('Tom')
console.log(a6.name) // Tom
a6.name = 'Jack'
```

private

private 修饰的属性和方式是私有的，不能在声明它的类的外部访问（包括子类中）

```typescript
class Animal {
  private name
  public constructor(name) {
    this.name = name
  }
}
let a7 = new Animal('Tom')
console.log(a7.name)
// error TS2341: Property 'name' is private and only accessible within class 'Animal'.
a7.name = 'Jack'
// error TS2341: Property 'name' is private and only accessible within class 'Animal'.

// private 在子类中也是不允许访问的
class Cat7 extends Animal {
  constructor(name) {
    super(name)
    console.log(this.name)
    // error TS2341: Property 'name' is private and only accessible within class 'Animal'.
  }
}

// 当构造函数被修饰为 private 时，它既不能被继承也不能被实例化
class Animal {
  public name
  private constructor(name) {
    this.name = name
  }
}
class Cat8 extends Animal {
  constructor(name) {
    super(name)
  }
}
// TS2675: Cannot extend a class 'Animal'.Class constructor is marked as private.
let a8 = new Animal('Tom')
// TS2673: Constructor of class 'Animal' is private and only accessible within the class declaration.
```

protected

修饰的属性和方法是受保护的，它和 private 类似区别是它在子类中是允许被访问的但是无法在实例中访问

```typescript
class Animal {
  protected name
  public constructor(name) {
    this.name = name
  }
}
class Cat9 extends Animal {
  constructor(name) {
    super(name)
    // protected 允许在子类中访问
    console.log(this.name)
  }
}

// 当构造函数被修饰为 protected 时，它既只能被继承也不能被实例化
class Animal {
  public name
  protected constructor(name) {
    this.name = name
  }
}
class Cat10 extends Animal {
  constructor(name) {
    super(name)
  }
}
let a10 = new Animal()
// TS2674: Constructor of class 'Animal' is protected and only accessible within the class declaration.
```

readonly

readonly 只读属性关键字，只允许出现在属性声明或索引签名中

```typescript
class Animal {
  readonly name
  public constructor(name) {
    this.name = name
  }
}
let a12 = new Animal('Tom')
console.log(a12.name) // Tom
a12.name = 'Jack'
// TS2540: Cannot assign to 'name' because it is a read-only property.
```

如果 readonly 与其他的访问修饰符同时存在的话 需要写在后面

```typescript
class Animal {
  // public readonly name
  public constructor(public readonly name) {
    this.name = name
  }
}
```

### 抽象类（abstract）

abstract 用于定义抽象类和其中的抽象方法, 抽象类不允许被实例化

```typescript
abstract class Animal {
  public name
  public constructor(name) {
    this.name = name
  }
  public abstract sayHi()
}
let a14 = new Animal('Tom')
// error TS2511: Cannot create an instance of the abstract class 'Animal'
```

抽象类中的方法必须被子类实现

```typescript
class Cat14 extends Animal {
  public eat() {
    console.log(`${this.name} is eating.`)
  }
}
// error TS2515: Non - abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
class Cat141 extends Animal {
  public sayHi() {
    console.log(`${this.name} hello.`)
  }
}
let cat14 = new Cat141('Tom')
```

### 类的类型

```typescript
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  sayHi(): string {
    return `My name is ${this.name}`
  }
}
let a15: Animal = new Animal('Tom')
console.log(a15.sayHi())
```

## 类与接口

类实现接口，实现是面向对象中的一个重要概念。一般讲一个类只能继承另一个类，有时候不同类之间可以有一些公有的特性，就可以把特性提取成接口，用 implements 关键字来实现，可以大大提高灵活性。

```typescript
interface Alarm {
  alert()
}
class Door {}
class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log('SecurityDoor alert')
  }
}
class Car implements Alarm {
  alert() {
    console.log('Car alert')
  }
}
```

一个类可以实现多个接口

```typescript
interface Alarm {
  alert()
}
interface Light {
  lightOn()
  lightOff()
}
class Car1 implements Alarm, Light {
  alert() {
    console.log('car alert')
  }
  lightOn() {
    console.log('car light on')
  }
  lightOff() {
    console.log('car light off')
  }
}
```

接口继承接口

```typescript
interface LightableAlarm extends Alarm {
  lightOn()
  lightOff()
}
```

接口继承类

```typescript
class Point {
  x: number
  y: number
}
interface Point3d extends Point {
  z: number
}
let point3d: Point3d = { x: 1, y: 2, z: 3 }
```

混合类型

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean
}
let mySearch: SearchFunc
mySearch = function(source: string, subString: string) {
  return source.search(subString) !== -1
}
```

有时候一个函数还可以有自己的属性和方法

```typescript
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}
function getCounter(): Counter {
  let counter = <Counter>function(start: number) {}
  counter.interval = 123
  counter.reset = function() {}
  return counter
}
let c = getCounter()
c(10)
c.reset()
c.interval = 5.0
```

## 泛型

泛型是指在定义函数。接口或类时，不预先指定类型，而是在使用时再指定

创建一个指定长度的数组同时每一项添加一个默认值

```typescript
function createArray(length: number, value: any): Array<any> {
  let result = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}
// Array<any> 允许数组的每一项为任何值，但是预期的是数组的每一项都应是输入的 value 值
```

使用泛型实现

```typescript
function createArray1<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}
createArray1<string>(3, 'x') // ['x', 'x', 'x']
```

T 用来指代任意输入的类型， 后面的参数类型 value:T 和 Array<T> 才可以使用

上例中 createArray1<string>(3, 'x') 也可以不指定 <string> 可以使用 ts 类型推断自动推断出来

```typescript
createArray1(3, 'x') // ['x', 'x', 'x']
```

### 多个类型参数

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}
swap([7, 'seven']) // ['seven', 7]
```

### 泛型约束

于不知道是哪种类型，所以不能随意操作它的属性和方法

```typescript
// 由于不知道是哪种类型，所以不能随意操作它的属性和方法
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length)
  return arg
}
// error TS2339: Property 'length' does not exist on type 'T'.
```

通过接口可以对泛型进行约束，只允许掺入包含某个属性如上例中 length 属性的变量

```typescript
interface Lengthwise {
  length: number
}
function loggingIdentity1<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

loggingIdentity1(7)
// error TS2345: Argument of type '7' is not assignable to parameter of type 'Lengthwise'.
```

多个类型参数之间的相互约束

```typescript
function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = (<T>source)[id]
  }
  return target
}
let x = { a: 1, b: 2, c: 3, d: 4 }
copyFields(x, { b: 10, d: 20 })
```

### 泛型接口

接口定义函数形状

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean
}
let mySearch: SearchFunc
mySearch = function(source: string, subString: string) {
  return source.search(subString) !== -1
}
```

含有泛型的接口定义

```typescript
nterface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>
}
let createArray2: CreateArrayFunc
createArray2 = function<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}
createArray2(3, 'x') // ['x','x','x']
```

进一步优化

```typescript
interface CreateArrayFunc1<T> {
  (length: number, value: T): Array<T>
}
let createArray3: CreateArrayFunc1<any>
createArray3 = function<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}
createArray3(3, 'x')
```

### 泛型类

与接口类似

```typescript
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}
let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) {
  return x + y
}
// 泛型参数的默认类型
// 当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用
function createArray4<T = string>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}
```

## 声明合并

如果定义了两个相同的名字的函数、接口或类，那么他会合并成一个类型

函数的合并

```typescript
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(
      x
        .toString()
        .split('')
        .reverse()
        .join('')
    )
  } else if (typeof x === 'string') {
    return x
      .split('')
      .reverse()
      .join('')
  }
}
```

接口合并

接口的属性在合并时会简单的合并到一个接口中

```typescript
// 1
interface Alarm {
  price: number
}
interface Alarm {
  weight: number
}

// 相当于
interface Alarm {
  price: number
  weight: number
}

// 2
// 合并的属性的类型必须是唯一的
interface Alarm {
  price: number
}
interface Alarm {
  price: number
  weight: number
}
// 以为 price 类型重复所以不会报错
interface Alarm {
  price: string
  weight: number
}
//  error TS2403: Subsequent variable declarations must have the same type.  Variable 'price' must be of type 'number', but here has type 'string'

// 3
// 接口中方法的合并与函数的合并一样
interface Alram {
  price: number
  alert(s: string): string
}
interface Alarm {
  weight: number
  alert(s: string, n: number): string
}

// 相当于
interface Alram {
  price: number
  alert(s: string): string
  weight: number
  alert(s: string, n: number): string
}
```

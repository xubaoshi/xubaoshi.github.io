# jsplumb 使用说明

## 简介

jsplumb 图表项目和连接的所有参数都是非常精细可控的，因此清楚熟悉使用方法后可以更加得心用手的绘制图表。  
jsplumb 有 2 个版本一个 Toolkit Edition（付费版），另外一个就是 Community Edition（社区版本）。

## 破解 jsplumb toolkit

访问 [ demo 地址](https://jsplumbtoolkit.com/) 下载 tookit 源码, 在源码中找到相关代码如：

![/img/jsplumb/pojie.png](/img/jsplumb/pojie.png)

全局查找并删除就可以使用了，这种收费的商业 js 库使用时注意 ！！！

## jsplumb 基础概念

![/img/jsplumb/basic.png](/img/jsplumb/basic.png)

1. Souce 源节点(node)
2. Target 节点(node)
3. Anchor 锚点 位于源节点或者目标节点上
4. Endpoint 端点 位于连接线上
5. Connector 连接线
6. OverLays 连接线上的文字或者符号（箭头）等

### Anchor 锚点

锚点定义了两个元素如何进行连接，及 Endpoint（端点）的位置

#### 静态锚点

固定到元素上的某个点，不会移动

![/img/jsplumb/anchorStatic.png](/img/jsplumb/anchorStatic.png)

[x,y,dx,dy,offsetX,offsetY]

"[0,0]" 表示节点的左上角
x 表示锚点在横轴上的距离，y 表示锚点在纵轴上的距离，这两个值可以从 0 到 1 来设置，0.5 为 center。
而 dx 表示锚点向横轴射出线，dy 表示锚点向纵轴射出线，有 0，-1，1 三个值来设置。0 为不放射线。
offsetX 表示锚点偏移量 x（px），offsetY 表示锚点偏移量 y（px）

anchor:"Bottom" 等于 anchor:[ 0.5, 1, 0, 1 ]

#### 动态锚点

静态锚的集合，就是 jsPlumb 每次连接时选择最合适的锚

[ [0.2,0,0,0],"Top","Bottom" ]

#### 边缘锚点

这是一种动态锚的形式，其中锚的位置是从给定形状的周长中选择的。jsPlumb 支持六种形状:Circle、Ellipse、Triangle、Diamond、Rectangle、Square

#### 连续锚点

锚点的位置根据元素与元素之间的方向计算， 如果连接中的两个元素都使用了连续锚，则连续锚的效果最好

### Endpoints 端点

#### Dot 圆点

radius，默认为 10px，定义圆点的半径  
cssClass，附加到 Endpoint 创建的元素的 CSS 类  
hoverClass，一个 CSS 类，当鼠标悬停在元素或连接的线上时附加到 EndPoint 创建的元素

#### Rectangle 矩形

width，默认为 20，定义矩形的宽度  
height，默认为 20，定义矩形的高度  
cssClass，附加到 Endpoint 创建的元素的 CSS 类  
hoverClass，当鼠标悬停在元素或连接的线上时附加到 EndPoint 创建的元素

#### Image 图像

src，必选，指定要使用的图像的 URL  
cssClass，附加到 Endpoint 创建的元素的 CSS 类  
hoverClass，当鼠标悬停在元素或连接的线上时附加到 EndPoint 创建的元素

#### Blank 空白

### Connector 连接线

#### Besier 贝塞尔曲线

它有一个配置项，curviness（弯曲度），默认为 150.这定义了 Bezier 的控制点与锚点的距离

#### Straight 直线

在两个端点之间绘制一条直线，支持两个配置参数：stub，默认为 0。gap，默认为 0

#### Flowchart 90 度转角线

由一系列垂直或水平段组成的连接。支持四个参数，stub，默认为 30；alwaysRespectStubs，默认为 false；gap，默认为 ；midpoint，默认为 0.5；cornerRadius，默认为 0

#### State Machine 状态机

支持在同一元素上开始和结束的连接，支持的参数有：margin，默认为 5；curviness，默认为 10；proximityLimit，默认为 80

### Overlays

#### Arrow

width，箭头尾部的宽度  
length，从箭头的尾部到头部的距离  
location，位置，建议使用 0 ～ 1 之间，当作百分比，便于理解  
direction，方向，默认值为 1（表示向前），可选-1（表示向后）  
foldback，折回，也就是尾翼的角度，默认 0.623，当为 1 时，为正三角  
paintStyle，样式对象

#### Label

label，要显示的文本  
cssClass，Label 的可选 css  
labelStyle，标签外观的可选参数：font，适应 canvas 的字体大小参数；color，标签文本的颜色；padding，标签的可选填充，比例而不是 px；borderWidth，标签边框的可选参数，默认为 0；borderStyle，颜色等边框参数  
location，位置，默认 0.5

#### PlainArrow

Arrow 的 foldback 为 1 时的例子，参数与 Arrow 相同

#### Diamand

Arrow 的 foldback 为 2 时的例子，参数与 Arrow 相同

#### Custom

创建自定义的叠加层

```javascript
create:function(component) {
      return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");
}
```

## toolkit 中相关定义

### Nodes

在 jsplumb 中 node 是一个个 dom 节点, 需要手动书写 dom 节点或通过 js 批量添加节点，在 tookit 中可以使用其内置的模板引擎批量生成节点。  
[模板引擎语法](https://docs.jsplumbtoolkit.com/toolkit/current/articles/templating.html)

简单示例如下：

```html
<script type="jtk" id="tmplNode">
  <div>
    <div class="left">
      <img style="width:40px;height:40px;" src="${picUrl}"/>
      <div class="node-name">${name}</div>
    </div>
    <r-if test="tips">
      <ul class="right">
        <r-each in="tips">
          <li>${$data}</li>
        </r-each>
      </ul>
    </r-if>
  </div>
</script>
```

```javascript
jsPlumbToolkit.ready(() => {
  const tookit = jsPlumbToolkit.newInstance()
  const data = {
    nodes: [
      {
        id: '1',
        picUrl: 'http://xxx.png',
        name: 'xxx',
        tips: ['xxxx', '555555']
      }
    ]
  }
  const renderer = tookit.load({ type: 'json', data }).render({
    // ...
    view: {
      nodes: {
        default: {
          template: 'tmplNode',
          events: {
            click: params => {
              console.log(params)
            }
          }
        }
      }
    }
    // ...
  })
})
```

上例中如果在 data 数组元素属性 type 为空默认采用 default 模板， 如果 type 中有值则采用 view 中额外配置的模板

```html
<script type="jtk" id="tmplNode">
  <div>
    <div class="left">
      <img style="width:40px;height:40px;" src="${picUrl}"/>
      <div class="node-name">${name}</div>
    </div>
    <r-if test="tips">
      <ul class="right">
        <r-each in="tips">
          <li>${$data}</li>
        </r-each>
      </ul>
    </r-if>
  </div>
</script>
<script type="jtk" id="tmplNode2">
  <div>
    <div class="left">
      <div class="node-name">${name}</div>
    </div>
  </div>
</script>
```

```javascript
jsPlumbToolkit.ready(() => {
  const tookit = jsPlumbToolkit.newInstance()
  const data = {
    nodes: [
      {
        id: '1',
        picUrl: 'http://xxx.png',
        name: 'xxx',
        tips: ['xxxx', '555555']
      },
      {
        id: '2',
        picUrl: 'http://xxx.png',
        name: 'xxx',
        tips: ['xxxx', '555555'],
        type: 'common'
      }
    ]
  }
  const renderer = tookit.load({ type: 'json', data }).render({
    // ...
    view: {
      nodes: {
        default: {
          template: 'tmplNode',
          events: {
            click: params => {
              console.log(params)
            }
          }
        },
        common: {
          template: 'tmplNode2',
          parent: 'common'
        }
      }
    }
    // ...
  })
})
```

view 中可以添加的属性

1. parent： nodes 中的 key 可以继承其定义的属性
2. template：模板
3. events：定义 node 事件
4. dragOptions： 拖拽设置

同时 nodes 中生成的节点是 dom, 我们可以通过书写 css 样式控制其展现，灵活性上会提高很多。

### Edges

```html
<script type="jtk" id="tmplNode">
  <div>
    <div class="left">
      <img style="width:40px;height:40px;" src="${picUrl}"/>
      <div class="node-name">${name}</div>
    </div>
    <r-if test="tips">
      <ul class="right">
        <r-each in="tips">
          <li>${$data}</li>
        </r-each>
      </ul>
    </r-if>
  </div>
</script>
```

```javascript
jsPlumbToolkit.ready(() => {
  const tookit = jsPlumbToolkit.newInstance()
  const data = {
    nodes: [
      {
        id: '1',
        picUrl: 'http://xxx.png',
        name: 'xxx1',
        tips: ['xxxx', '555555']
      },
      {
        id: '2',
        picUrl: 'http://xxx.png',
        name: 'xxx2',
        tips: ['xxxx', '555555']
      }
    ],
    edges: [{ source: '1', target: '2' }]
  }
  const renderer = tookit.load({ type: 'json', data }).render({
    // ...
    view: {
      nodes: {
        default: {
          template: 'tmplNode',
          events: {
            click: params => {
              console.log(params)
            }
          }
        }
      },
      edges: {
        connector: 'StateMachine',
        paintStyle: { lineWidth: 2, strokeStyle: '#CCC' }
      }
    }
    // ...
  })
})
```

1. parent： nodes 中的 key 可以继承其定义的属性
2. connector：jsplumb 中连接线的类型
3. paintStyle：样式颜色等
4. hoverPaintStyle： 样式颜色等
5. events： 定义 edge 事件
6. label：可以使用此配置定义静态动态的 label
7. labelLocationAttribute： label 位置

### Ports

### Groups

包含在某个其他元素中的一组元素，可以折叠，导致与所有组成员的连接被合并到折叠的组容器上。

![/img/jsplumb/group.png](/img/jsplumb/group.png)

```javascript
var t = jsPlumbToolkit.newInstance()
t.load({
  data: {
    groups: [
      { id: 'g1', type: 'groupType1' },
      { id: 'g2', type: 'groupType1' }
    ],
    nodes: [
      { id: '1', group: 'g1' },
      { id: '2', group: 'g1' },
      { id: '3', group: 'g2' },
      { id: '4', group: 'g2' }
    ],
    edges: [
      { source: '1', target: '2' },
      { source: '1', target: '3' },
      { source: '4', target: '3' },
      { source: '4', target: '2' }
    ]
  }
})
```

## 初始化

引入 jsplumbtoolkit.js 后, 在 jsPlumbToolkit.ready 函数内部调用

```javascript
jsPlumbToolkit.ready(() => {
  // ...
})
```

初始化 toolkit

```javascript
const toolkit = jsPlumbToolkit.newInstance({})
```

加载数据

```javascript
// 方式一
const toolkit = jsPlumbToolkit.newInstance({
  data: [
    ('nodes': [{ id: 'foo', name: 'foo' }, { id: 'bar', name: 'bar' }]),
    ('edges': [{ source: 'foo', target: 'bar' }])
  ]
})
// 方式二
// 先声明 tookit， 使用
toolkit.load({
  data:[ .... ]
})
```

渲染数据

```javascript
const renderer = toolkit.render({
  container: 'id',
  jsPlumb: {}
})
```

jsPlumnb 选项可以配置图表中 节点 锚点 连接线等，最终和 jsPlumb 的默认配置合并到一起。

## 数据结构

## 接口

### surface（tookit render）

addNode 添加节点
centerContent 将视图居中到某个元素上
container 属性是必填的
view

## 原理

## 实现目标

### 缩放

### 小地图

### 全屏

### 详细的交互，线，图标可点击

### 线点击

```javascript
// 请单点击一下连接线,
jsPlumb.bind('click', function(conn, originalEvent) {
  if (window.prompt('确定删除所点击的连接吗？ 输入1确定') === '1') {
    jsPlumb.detach(conn)
  }
})
```

### 自动布局

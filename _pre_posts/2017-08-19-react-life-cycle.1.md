---
layout:     post
title:      "2017-08-19-react生命周"
date:       "2017-08-19"
author:     "XuBaoshi"
header-img: "img/post-bg-08.jpg"
---
# react生命周期 #
所谓的生命周期，就是一个对象从开始生成到最后消亡所经历的状态。<br/>
react组件的生命周期可以分为三个部分：实例期、存在期、和销毁期。这里对react的服务端渲染不做阐述。只针对客户端渲染。<br/>
下面的例子使用es5的语法：
## 实例期 ##
当组件在客户端被第一次创建时，依次调用getDefaultProps、getInitialState、componentWillMount、render、componentDidMonut。
### getDefaultProps() ###
getDefaultPops是对于组件类来说只调用一次，该类的所有后续应用将不会被调用，该方法返回默认的props。
### getInitialState() ###
### componentWillMount() ###
### render() ###
render方法创建一个虚拟的DOM（Visual DOM）,它并不是一个真正的DOM，执行ReactDOM.render方法才会生成真实的DOM。<br/>
render方法是唯一一个必须的方法。使用render方法需要注意以下几点：
- 只能通过 this.props 和 this.state 访问数据。
- render方法可以返回null、false、或任何React组件
- 只能return一个顶级组件，不可以多个。
- 不可以修改组件的状态或者DOM的输出。
### componentDidMonut() ###

## 存在期 ##
## 销毁期 ##


## es5组件生命周期 ##
## es6组件生命周期 ##
在es6中一个React组件是用一个class来表示的。

    // 通过继承React.Component来实现
    class A extends React.Component {
        //...
    }
与其相关的函数如下：
### constructor(props,context) ###


### componentWillRecevieProps(nextProps) ###
### shouldComponentUpdate(nextProps,nextState) ###
### componentWillUpdate(nextProps,nextState) ###
### componentDidUpdate() ###

### componentWillUnmount() ###






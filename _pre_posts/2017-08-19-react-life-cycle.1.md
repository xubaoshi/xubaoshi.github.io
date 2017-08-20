---
layout:     post
title:      "2017-08-19-react生命周"
date:       "2017-08-19"
author:     "XuBaoshi"
header-img: "img/post-bg-08.jpg"
---
# react生命周期 #
react组件的生命周期可以分为三个部分：实例期、存在期、和销毁期。这里对react的服务端渲染不做阐述。只针对客户端渲染。
## es5组件生命周期 ##
## es6组件生命周期 ##
在es6中一个React组件是用一个class来表示的。

    // 通过继承React.Component来实现
    class A extends React.Component {
        //...
    }
与其相关的函数如下：
### constructor(props,context) ###
### void componentWillMount() ###
### void componentDidMonut() ###
### void componentWillRecevieProps(nextProps) ###
### bool shouldComponentUpdate(nextProps,nextState) ###
### void componentWillUpdate(nextProps,nextState) ###
### void coponentDidUpdate() ###
### ReactElement render() ###
### void componentWillUnmount() ###






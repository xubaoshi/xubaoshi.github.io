---
layout:     post
title:      "2017-08-19-react生命周"
date:       "2017-08-19"
author:     "XuBaoshi"
header-img: "img/post-bg-08.jpg"
---
# react生命周期 #

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






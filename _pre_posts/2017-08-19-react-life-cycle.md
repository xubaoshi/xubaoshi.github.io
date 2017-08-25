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
由于未来React版本去除了React.createClass方法，下面的例子使用es5的语法（将来主要使用es6 类Class方式）：
## 实例期 ##
当组件在客户端被第一次创建时，依次调用getDefaultProps、getInitialState、componentWillMount、render、componentDidMonut。
### getDefaultProps() ###
getDefaultPops是对于组件类来说只调用一次，该类的所有后续应用将不会被调用，该方法返回默认的props。如果父组件没有传递其他生命周期函数所需要的属性，将默认采用getDefaultProps返回的属性，通过this.props使用。

    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    var A = createReactClass({
        getDefaultProps: function () {
            console.log('A:default props');
            return {
                name: 'hh',
                age: 20
            }
        },
        render: function () {
            console.log('A render fn');
            return (
                <h1>name:{this.props.name} age:{this.props.age}</h1>
            )
        }
    });

    // 1. basic
    ReactDOM.render(<A></A>, document.getElementById('root'));

    // 2.getDefaultProps只调用一次
    var B = createReactClass({
         render: function () {
             return (
                 <div>
                     <A></A>
                     <A></A>
                 </div>       
             )
         }
     });
     ReactDOM.render(<B></B>, document.getElementById('root'));

    // 3.设置props的其他方式
    // 除了getDefaultProps方法以下方法也可以设置props
    // 3.1 组件挂载时设置组件属性，优先级高于getDefaultProps方法返回的对象属性
    ReactDOM.render(<A name='tt' age='22'></A>, document.getElementById('root'));

### getInitialState() ###
对于组件的每一个实例来说，用来初始化每个实例的state，在这个方法中可以访问组件的props。state与props的区别在于，state存在于组件实例的内部而props存在于组件实例之间。<br/>
getInitialState和getDefaultPops 的调用是有区别的，getDefaultPops 是对于组件类来说只调用一次，后续该类的应用都不会被调用，而getInitialState 是对于每个组件实例来讲都会调用，并且只调一次。

    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    var A = createReactClass({
        getInitialState: function () {
            return {
                active: false
            }
        },
        render: function () {
            return (
                <h1>{this.state.active ? 'Yes' : 'No'}</h1>
            )
        }
    });

    // 1.basic
    ReactDOM.render(<A></A>,document.getElementById('root'));

    // 2. getInitialState 可以访问组件的props
    var B = createReactClass({
        getDefaultProps:function(){
            console.log('this is B default props');
            return {
                name:'hh'
            }
        },
        getInitialState: function () {
            console.log('this is B initial state');
            return {
                propsName:this.props.name,
                active: false
            }
        },
        render: function () {
            return (
                <h1>{this.state.active ? 'Yes' : 'No'} ,this is {this.state.propsName}</h1>
            )
        }
    });

    ReactDOM.render(<B></B>,document.getElementById('root'));

    // 3. getInitialState 每个组件实例来讲都会调用，并且只调一次
    var C = createReactClass({
        render: function(){
            return (
                <div>
                    <B></B>
                    <B></B>
                </div>
            )
        }
    });
    ReactDOM.render(<C></C>,document.getElementById('root'));

    // 4. state存在于组件实例的内部而props存在于组件实例之间
    var D = createReactClass({
        getDefaultProps:function(){
            return {
                name:`props${Math.random()}`
            }
        },
        getInitialState: function () {
            return {
                age:`state${Math.random()}`
            }
        },
        render: function () {
            console.log(`props: ${this.props.name},state: ${this.state.age}`);
            return (
                <h1>{this.props.name} ,{this.state.age}</h1>
            )
        }
    });
    var E = createReactClass({
        render:function(){
            return (
                <div>
                    <D></D>
                    <D></D>
                </div>
            )
        }
    });
    ReactDOM.render(<E></E>,document.getElementById('root'));

    // 5.不要使用this.state直接修改state，使用this.setState
    // 使用this.setState后依次调用以下方法shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate
    var F = createReactClass({
        getInitialState: function () {
            return {
                age:20
            }
        },
        shouldComponentUpdate:function(){
            console.log('shouldComponentUpdate');
            return true;
        },
        componentWillUpdate:function(){
            console.log('componentWillUpdate');
        },
        componentDidUpdate:function(){
            console.log('componentDidUpdate');
        },
        changeHandle:function(){
            this.setState({age:new Date().getSeconds()});
        },
        render: function(){
            console.log('render');
            return (
                <div>
                    <h1>{this.state.age}</h1>
                    <button onClick={this.changeHandle}>change</button>
                </div>
            )
        }
    });
    ReactDOM.render(<F></F>,document.getElementById('root'));

### componentWillMount() ###
该方法在首次渲染之前调用,也是再 render 方法调用之前修改 state 的最后一次机会。

    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');
    var A = createReactClass({
        getInitialState: function () {
            return {
                name: 'hh'
            }
        },
        componentWillMount: function () {
            this.setState({
                name: 'll'
            });
        },
        render: function () {
            return (
                <h1>{this.state.name}</h1>
            )
        }
    });

    ReactDOM.render(<A></A>,document.getElementById('root'));

### render() ###
render方法创建一个虚拟的DOM（Visual DOM）,它并不是一个真正的DOM，执行ReactDOM.render方法才会生成真实的DOM。<br/>
render方法是唯一一个必须的方法。

    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    var Container = createReactClass({
        render: function () {
            return (
                <div>
                    Hello World!
                </div>
            );
        }
    });
    ReactDOM.render(<Container></Container>, document.getElementById('root'));

使用render方法需要注意以下几点：
- 只能通过 this.props 和 this.state 访问数据。
- render方法可以返回null、false、或任何React组件
- 只能return一个顶级组件，不可以多个。
- 不可以修改组件的状态或者DOM的输出。

### componentDidMonut() ###
该方法被调用时，已经渲染出真实的DOM，此时我们可以访问DOM对象，或请求ajax（此时最为合适）。

## 存在期 ##
## 销毁期 ##


## es6 类（class）组件生命周期 ##
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






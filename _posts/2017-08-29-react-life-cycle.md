---
layout:     post
title:      "2017-08-29-react生命周"
date:       "2017-08-29"
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
    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');
    var $ = require('jquery');

    // 1. dom树生成
    var A = createReactClass({
        render:function(){
            return (
                <div className="js-wrap">
                    Hello World!
                </div>
            )
        },
        componentDidMount:function(){
            var $wrap = document.getElementsByClassName('js-wrap')[0];
            console.log($wrap.textContent);
        }
    });

    ReactDOM.render(<A></A>,document.getElementById('root'));

    // 2.ajax
    var B = createReactClass({
        getInitialState:function(){
            return {
                list:[]
            }
        },
        render:function(){
            var str = this.state.list.map(function(topic){
                return (
                    <p key={topic.id + new Date().getTime()}>{obj.id}</p>
                )
            })
            return (
                <div>
                    {str}
                </div>
            )
        },
        componentDidMount:function(){
            let _this = this; 
            let url = 'https://cnodejs.org/api/v1/topics?limit=30';
            $.get(url,function(data){
                _this.setState({list:data.data});
            })
        }
    });
    ReactDOM.render(<B></B>,document.getElementById('root'));

    // 3.refs
    // refs用处
    // 1.可以用于触发焦点事件、文本选择及媒体播放等
    // 2.触发动画
    // 3.集成第三方库（涉及操作DOM的）
    // 4.建议不要过度使用

    // 3.1 basic
    var C = createReactClass({
        render:function(){
            return (
                <input ref="textInput" />
            )
        },
        componentDidMount:function(){
            this.refs.textInput.focus();
        }
    });
    // ReactDOM.render(<C></C>,document.getElementById('root'));

    // 3.2 别名
    var D = createReactClass({
        render:function(){
            return (
                <input ref={(input)=>{this.textInput = input}} />
            )
        },
        componentDidMount:function(){
            this.textInput.focus();
        }
    });
    // ReactDOM.render(<D></D>,document.getElementById('root'));

    // 3.3 refs 无状态组件
    // 如果组件之间ref，ref则表示对应组件的实例  
    // 无状态组件 无法使用refs，因为它没有实例
    // 含有生命周期的组件
    var E = createReactClass({
        render:function(){
            return (
                <input ref={input=>{this.textInput=input}} />
            )
        }
    });

    var F = function(){
        return (
            <input  ref={input=>{this.textInput=input}} />
        )
    };

    var G = createReactClass({
        render:function(){
            return (
                <div>
                    <E ref={(input) => {this.E = input}} value="E"></E>
                    <F ref={(input) => {this.F = input}} value="F"></F>
                </div>
            )
        },
        componentDidMount:function(){
            // 下述代码是推荐的 这样导致了G组件与子组件的强耦合。
            this.E.textInput.focus();
            console.log(this.E);
            console.log(this.F);
        }
    });
    // ReactDOM.render(<G></G>,document.getElementById('root'));

    // 3.4 通过props暴露DOM给父组件
    var H = createReactClass({
        render:function(){
            return (
                <input  ref={this.props.inputRef} />
            )
        }
    });
    var I = function(props){
        return (
            <input  ref={props.inputRef} />
        )
    };
    var J = createReactClass({
        render:function(){
            return (
                <div>
                    <H inputRef={(input) => {this.textInputH = input}}></H>
                    <I inputRef={(input) => {this.textInputI = input}}></I>
                </div>
            )
        },
        componentDidMount:function(){
            this.textInputH.focus();
            this.textInputI.focus();
        }
    });
    ReactDOM.render(<J></J>,document.getElementById('root'));

## 存在期 ##
### componentWillRecevieProps(nextProps) ###
组件的 props 属性可以通过父组件来更改，如果依赖于父组件的props被修改，componentWillReceiveProps 将被调用，接下来依次调用shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate。

    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    var A = createReactClass({
        getInitialState:function(){
            return {
                age:20
            }
        },
        render: function () {
            return (
                <div>
                    <h2>{this.props.name}</h2>
                    <h3>{this.state.age}</h3>
                </div>
            )
        },
        componentWillReceiveProps: function (nextProps) {
            console.log(this.state);
            console.log(this.props);
            console.log('nextProps:');
            console.log(nextProps);
            this.setState({age:30});
        }
    });

    var B = createReactClass({
        getInitialState:function(){
            return {
                name:'hh'
            }
        },
        render:function(){
            return (
                <div>
                    <A name={this.state.name}></A>
                    <button onClick={this.clickHandle}>click</button>
                </div>
            )
        },
        clickHandle:function(){
            this.setState({name:'ll'});
        }
    });
    ReactDOM.render(<B></B>,document.getElementById('root'));

### shouldComponentUpdate(nextProps,nextState) ###
当实例化后组件的props、state发生变化时将调用以下方法：shouldComponentUpdate、componentWillUpdate、render、componentDidUpdate。<br/>
当组件的props、state发生改变时该方法执行，该方法传入两个参数nextProps(变更后的props)及nextState(变更后的state)，按照规则（视业务规则而定）返回true or false，决定组件是否需要重新渲染。。如果返回false,则 componentWillUpdate、render、componentDidUpdate将不会执行。 后期做性能优化时，shouldComponentUpdate是着手点。

    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    // 1.return false 
    // name修改后不重新渲染
    var A = createReactClass({
        getInitialState: function () {
            return {
                name:'hh'
            }
        },
        render: function () {
            return (    
                <div>
                    <h2>{this.state.name}</h2>
                    <button onClick={this.clickHandle}>change</button>
                </div>
            )
        },
        shouldComponentUpdate: function (nextProps, nextState) {
            console.log('shouldComponentUpdate!');
            return false;
        },
        componentWillUpdate:function(nextProps, nextState){
            console.log('this.props:');
            console.log(this.props);
            console.log('this.state:');
            console.log(this.state);
            console.log('nextProps:');
            console.log(nextProps);
            console.log('nextState:');
            console.log(nextState);
        },
        clickHandle: function () {
            this.setState({name:'ll'});
        }
    });
    ReactDOM.render(<A></A>,document.getElementById('root'));

    // 2.props
    // 只有当age发生变化 shouldComponentUpdate才会返回true
    // 修改父组件的age componentWillReceiveProps
    var B = createReactClass({
        getInitialState: function () {
            return {
                name:'hh'
            }
        },
        render: function () {
            return (    
                <div>
                    <h2>{this.state.name}</h2>
                    <h3>{this.props.age}</h3>
                    <button onClick={this.clickHandle}>changeName</button>
                </div>
            )
        },
        componentWillReceiveProps:function(nextProps, nextState){
            console.log('componentWillReceiveProps!');
            this.setState({name:'tt'});
        },
        shouldComponentUpdate: function (nextProps, nextState) {
            console.log('this.props:');
            console.log(this.props);
            console.log('this.state:');
            console.log(this.state);
            console.log('nextProps:');
            console.log(nextProps);
            console.log('nextState:');
            console.log(nextState);
            if(nextProps.age != this.props.age){
                console.log('shouldComponentUpdate return  true');
                return true;
            } else {
                console.log('shouldComponentUpdate return  false');
                return false;
            }
        },
        clickHandle: function () {
            this.setState({name:'ll'});
        }
    });

    var C = createReactClass({
        getInitialState: function () {
            return {
                age: 20
            }
        },
        render:function(){
            return (
                <div>
                    <B age={this.state.age}></B>
                    <button onClick={this.clickHandle}>changeAge</button>
                </div>
            )
        },
        clickHandle: function () {
            this.setState({age:30});
        }
    });

    ReactDOM.render(<C></C>,document.getElementById('root'));
### componentWillUpdate(nextProps,nextState) ###
在组件接收到了新的 props 或者 state 即将进行重新渲染前，componentWillUpdate(object nextProps, object nextState) 会被调用。有一点必须注意不要在该函数内调用this.setState方法。
    
    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    var A = createReactClass({
        getInitialState: function () {
            return {
                name:'hh'
            }
        },
        render: function () {
            return (    
                <div>
                    <h2>{this.state.name}</h2>
                    <button onClick={this.clickHandle}>change</button>
                </div>
            )
        },
        shouldComponentUpdate: function (nextProps, nextState) {
            var num = Math.random() ;
            if(Math.random() > 0.5){
                console.log(true + '  shouldComponentUpdate: ' + num);
                return true;
            }else{
                console.log(false + '  shouldComponentUpdate: ' + num);
                return false;
            }
            // 如果为true 会一直循环走生命周期函数
            // return true;
        },
        componentWillUpdate:function(nextProps, nextState){
            this.setState({name:'ttt'});
            console.log('this.state:');
            console.log(this.state);
            console.log('nextState:');
            console.log(nextState);
        },
        clickHandle: function () {
            this.setState({name:'ll'});
        }
    });
    ReactDOM.render(<A></A>,document.getElementById('root'));

### componentDidUpdate() ###
这个方法和 componentDidMount 类似，在组件重新被渲染之后，componentDidUpdate(object prevProps, object prevState) 会被调用。可以在这里访问并修改 DOM。
## 销毁期 ##
### componentWillUnmount() ###
 组件将要移除时调用的函数， 在componentDidMount 中添加的任务都需要在该方法中撤销，如创建的定时器或事件监听器等。撤销后如果再次使用该组件那么该组件的生命周期从getInitialState => componentWillMount => render =>componentDidMount重新实例化。

    // 下面代码由A组件切换至B组件后，A执行componentWillUnmount方法取消定时器timer
    var React = require('react');
    var ReactDOM = require('react-dom');
    var createReactClass = require('create-react-class');

    var timer;
    var A = createReactClass({
        render: function () {
            return (
                <h1>A</h1>
            )
        },
        componentDidMount: function () {
            timer = setInterval(function () {
                console.log('this is A');
            }, 2000);
        },
        componentWillUnmount: function () {
            console.log('componentWillunmount for A');
            clearInterval(timer);
        }
    });

    var B = createReactClass({
        render: function () {
            return (
                <h1>B</h1>
            )
        }
    });

    var C = createReactClass({
        getInitialState: function () {
            return {
                type: 'A'
            }
        },
        render: function () {
            if (this.state.type == 'A') {
                return (
                    <div>
                        <A></A>
                        <button onClick={this.clickHandle}>change1</button>
                    </div>

                )
            } else {
                return (
                    <div>
                        <B></B>
                        <button onClick={this.clickHandle}>change2</button>
                    </div>

                )
            }
        },
        clickHandle: function () {
            if (this.state.type == 'A') {
                this.setState({ type: 'B' });
            } else {
                this.setState({ type: 'A' });
            }

        }
    });
    ReactDOM.render(<C></C>, document.getElementById('root'));

## 类组件 ##
上述代码主要讲述的是使用es5语法实现react组件，但在react官方文档中推荐ES6类绑定，前面之所以使用es5语法主要是为了方便讲述每一个生命周期函数，下面是有关class组件的相关内容及需要注意的地方：

在es6中一个React组件是用一个class来表示的，语法如下：

    // 继承React.Component来实现
    class A extends React.Component {
        //...
    }

    import React from 'react'
    import ReactDOM from 'react-dom'

    class A extends React.Component {
        render() {
            return (
                <h1>A</h1>
            )
        }
    }
    ReactDOM.render(<A></A>,document.getElementById('root'));

### constructor(props,context) ###
ps:es6类组件内默认constructor方法，参数为props，如果声明组件时不添加constructor默认执行：

    constructor(props){
        super(props)
    }

如果声明组件是添加了constructor，子类必须在constructor方法中调用super方法，否则新建实例时会报错。

### 类组件的state及props ###
使用es6类的方式声明React组件中state及props的声明较es5的语法有些区别如下：<br>
#### state ####
es5使用getInitialState方法返回初始state，但在es6类组件中需通过在constructor方法内使用this.state初始化state。

    // class组件
    class B extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                name: 'hh'
            }
        }
        render() {
            return (
                <h1>
                    {this.state.name}
                </h1>
            )
        }
    }

    // es5 组件
    var C = createReactClass({
        getInitialState: function () {
            return {
                name: 'll'      
            }
        },
        render:function(){
            return (
                <h2>{this.state.name}</h2>
            )
        }
    })
    class D extends React.Component{
        render(){
            return(
                <div>
                    <B></B>
                    <C></C>
                </div>
            )
        }
    }
    ReactDOM.render(<D></D>, document.getElementById('root'));

#### props ####
es5使用getDefaultProps方法返回初始props,es6的类组件初始化默认props略有不同。

    // 1 在组件内部的使用static
    static defaultProps = {
        name:　...
    }

    // 2 在组件外部
    Hello.defaultProps = {
        name: ...
    }

在组件内的写法需要注意的是static是es7的写法需要添加babel-preset-stage-x。

    // 外部
    class L extends React.Component{
        render(){
            return (
                <h1>{this.props.name}</h1>
            )
            
        }
    }
    L.defaultProps = {
        name:'hh'
    }

    class M extends React.Component{
        static defaultProps = {
            name:'ll'
        }
        render(){
            return (
                <h1>{this.props.name}</h1>
            )
            
        }
    }

    class O extends React.Component{
        render(){
            return(
                <div>
                    <L></L>
                    <M></M>
                </div>
            )
        }
    }

    ReactDOM.render(<O></O>, document.getElementById('root'));


### 类组件的this ###
使用es5的React.createClass(v16会被废弃)或 'create-react-class',除了生命周期的钩子函数可以使用this(实例对象),自定义的方法同样可以使用this，是因为react本身帮我们绑定了this，才让我们不用手动去绑定this就能正确的使用。但es6的类组件除了生命周期函数，自定义的函数是不会进行this绑定的。需要手动绑定。

    // 可以访问到this
    var E = createReactClass({
        render:function(){
            return (
                <button onClick={this.clickHandle}>es5</button>
            )
        },
        clickHandle:function(){
            console.log(this);
        }
    });

    // 不可以访问到this为null
    class F extends React.Component{
        render(){
            return (
                <button onClick={this.clickHandle}>es6</button>
            )
            
        }
        clickHandle(){
            console.log(this);
        }
    }

    class G extends React.Component{
        render(){
            return(
                <div>
                    <E></E>
                    <F></F>
                </div>
            )
        }
    }

    ReactDOM.render(<G></G>, document.getElementById('root'));

es6的类组件绑定this可以在constructor函数内部绑定this，也可以使用箭头函数等(绑定方法还有，可参考链接[https://segmentfault.com/a/1190000006133727][https://segmentfault.com/a/1190000006133727])。如下：该文章推荐在constructor函数内部绑定this。

    // 4.2.1 render() .bind(this)
    // bad:每次render都要生成一个匿名函数
    class H extends React.Component{
        render(){
            return (
                <button onClick={this.clickHandle.bind(this)}>render-bind</button>
            )
            
        }
        clickHandle(){
            console.log(this);
        }
    }

    // 4.2.2 arrow function
    // bad: 每次render都要生成一个箭头函数
    class I extends React.Component{
        render(){
            return (
                <button onClick={() => this.clickHandle()}>arrow-bind</button>
            )
            
        }
        clickHandle(){
            console.log(this);
        }
    }

    // 推荐使用这个
    class J extends React.Component{
        constructor(props){
            super(props)
            this.clickHandle = this.clickHandle.bind(this)
        }
        render(){
            return (
                <button onClick={this.clickHandle}>constructor-bind</button>
            )
            
        }
        clickHandle(){
            console.log(this);
        }
    }

    class K extends React.Component{
        render(){
            return(
                <div>
                    <H></H>
                    <I></I>
                    <J></J>
                </div>
            )
        }
    }

    ReactDOM.render(<K></K>, document.getElementById('root'));
















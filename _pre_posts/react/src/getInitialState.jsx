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
// ReactDOM.render(<A></A>,document.getElementById('root'));

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

// ReactDOM.render(<B></B>,document.getElementById('root'));

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
// ReactDOM.render(<C></C>,document.getElementById('root'));

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
// ReactDOM.render(<E></E>,document.getElementById('root'));

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
// ReactDOM.render(<F></F>,document.getElementById('root'));
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

// 1.return false
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
// ReactDOM.render(<A></A>,document.getElementById('root'));

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
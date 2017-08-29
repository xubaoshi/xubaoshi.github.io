import React from 'react'
import ReactDOM from 'react-dom'
import createReactClass from 'create-react-class'

// 1. basic
class A extends React.Component {
    render() {
        return (
            <h1>A</h1>
        )
    }
}

// ReactDOM.render(<A></A>,document.getElementById('root'));

// 2. state
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

// ReactDOM.render(<D></D>, document.getElementById('root'));

// 4.this
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

// ReactDOM.render(<G></G>, document.getElementById('root'));

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

// ReactDOM.render(<K></K>, document.getElementById('root'));

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
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

ReactDOM.render(<D></D>, document.getElementById('root'));
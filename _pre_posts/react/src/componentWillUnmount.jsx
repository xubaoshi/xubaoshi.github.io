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
    componentWillUnMount:function(){
        console.log('componentWillUnMount!');
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
    getInitialState:function(){
        return {
            type:'A'
        }
    },
    render: function () {
        var str = '';
        if(this.state.type == 'A'){
            str = <A></A>;
        } else {
            str = <B></B>;
        }
        return (
            <div>
                {str}
                <button onClick={this.clickHandle}>change</button>
            </div>
        )
    },
    clickHandle:function(){
        this.setState({type:'B'});
    },
    componentWillUnMount:function(){
        console.log('componentWillUnMount!');
    }
});

ReactDOM.render(<C></C>,document.getElementById('root'));
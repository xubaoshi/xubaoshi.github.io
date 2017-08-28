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
                <button onClick={this.clickHandle}>change-parent</button>
            </div>
        )
    },
    clickHandle:function(){
        this.setState({name:'ll'});
    }
});
ReactDOM.render(<B></B>,document.getElementById('root'));

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
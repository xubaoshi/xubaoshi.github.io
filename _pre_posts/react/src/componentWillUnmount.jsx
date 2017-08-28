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
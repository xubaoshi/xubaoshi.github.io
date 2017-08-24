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


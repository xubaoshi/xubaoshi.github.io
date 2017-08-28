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
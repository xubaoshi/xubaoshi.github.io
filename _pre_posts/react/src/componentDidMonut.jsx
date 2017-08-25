var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var $ = require('jquery');

// 1.basic
var A = createReactClass({
    render:function(){
        return (
            <div className="js-wrap">
                Hello World!
            </div>
        )
    },
    componentDidMount:function(){
        var $wrap = document.getElementsByClassName('js-wrap')[0];
        console.log($wrap.textContent);
    }
});

// ReactDOM.render(<A></A>,document.getElementById('root'));

// 2.ajax
var B = createReactClass({
    getInitialState:function(){
        return {
            list:[]
        }
    },
    render:function(){
        var str = this.state.list.map(function(topic){
            return (
                <p key={topic.id + new Date().getTime()}>{obj.id}</p>
            )
        })
        return (
             <div>
                {str}
             </div>
        )
    },
    componentDidMount:function(){
        let _this = this; 
        let url = 'https://cnodejs.org/api/v1/topics?limit=30';
        $.get(url,function(data){
            _this.setState({list:data.data});
        })
    }
});
ReactDOM.render(<B></B>,document.getElementById('root'));
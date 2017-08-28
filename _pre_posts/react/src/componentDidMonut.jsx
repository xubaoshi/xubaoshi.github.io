var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var $ = require('jquery');

// 1. dom树生成
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
// ReactDOM.render(<B></B>,document.getElementById('root'));

// 3.refs
// refs用处
// 1.可以用于触发焦点事件、文本选择及媒体播放等
// 2.触发动画
// 3.集成第三方库（涉及操作DOM的）
// 4.建议不要过度使用

// 3.1 basic
var C = createReactClass({
    render:function(){
        return (
            <input ref="textInput" />
        )
    },
    componentDidMount:function(){
        this.refs.textInput.focus();
    }
});
// ReactDOM.render(<C></C>,document.getElementById('root'));

// 3.2 别名
var D = createReactClass({
    render:function(){
        return (
            <input ref={(input)=>{this.textInput = input}} />
        )
    },
    componentDidMount:function(){
        this.textInput.focus();
    }
});
// ReactDOM.render(<D></D>,document.getElementById('root'));

// 3.3 refs 无状态组件
// 如果组件之间ref，ref则表示对应组件的实例  
// 无状态组件 无法使用refs，因为它没有实例
// 含有生命周期的组件
var E = createReactClass({
    render:function(){
        return (
            <input ref={input=>{this.textInput=input}} />
        )
    }
});

var F = function(){
    return (
        <input  ref={input=>{this.textInput=input}} />
    )
};

var G = createReactClass({
    render:function(){
        return (
            <div>
                <E ref={(input) => {this.E = input}} value="E"></E>
                <F ref={(input) => {this.F = input}} value="F"></F>
            </div>
        )
    },
    componentDidMount:function(){
        // 下述代码是推荐的 这样导致了G组件与子组件的强耦合。
        this.E.textInput.focus();
        console.log(this.E);
        console.log(this.F);
    }
});
// ReactDOM.render(<G></G>,document.getElementById('root'));

// 3.4 通过props暴露DOM给父组件
var H = createReactClass({
    render:function(){
        return (
            <input  ref={this.props.inputRef} />
        )
    }
});
var I = function(props){
    return (
        <input  ref={props.inputRef} />
    )
};
var J = createReactClass({
    render:function(){
        return (
            <div>
                <H inputRef={(input) => {this.textInputH = input}}></H>
                <I inputRef={(input) => {this.textInputI = input}}></I>
            </div>
        )
    },
    componentDidMount:function(){
        this.textInputH.focus();
        this.textInputI.focus();
    }
});
ReactDOM.render(<J></J>,document.getElementById('root'));


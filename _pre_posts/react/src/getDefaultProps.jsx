var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');


var A = createReactClass({
    getDefaultProps: function () {
        console.log('A:default props');
        return {
            name: 'hh',
            age: 20
        }
    },
    render: function () {
        console.log('A render fn');
        return (
            <h1>name:{this.props.name} age:{this.props.age}</h1>
        )
    }
});

// 1. basic
ReactDOM.render(<A></A>, document.getElementById('root'));

// 2.getDefaultProps只调用一次
// var B = createReactClass({
//     render: function () {
//         return (
//             <div>
//                 <A></A>
//                 <A></A>
//             </div>       
//         )
//     }
// });
// ReactDOM.render(<B></B>, document.getElementById('root'));

// 3.设置props的其他方式
// 除了getDefaultProps方法以下方法也可以设置props
// 3.1 组件挂载时设置组件属性，优先级高于getDefaultProps方法返回的对象属性
// ReactDOM.render(<A name='tt' age='22'></A>, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

// constants
const GET_MESSAGE_LIST = 'GET_MESSAGE_LIST';
const ADD_MESSAGE = 'ADD_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';


// reduce
let time = new Date().getTime();
const messagesReducer = (state = [{ id: time, name: `name${time}` }], action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return [{ id: action.addTime, name: `name${action.addTime}` }, ...state];
        case DELETE_MESSAGE:
            const [a, ...newList] = state;
            return newList;
        default:
            return state
    }
}
const reducer = combineReducers({
    messages: messagesReducer
});
let store = createStore(reducer);

// actions
const addMessageAction = (addTime) => {
    return {
        type: ADD_MESSAGE,
        addTime
    }
}
const deleteMessageAction = () => {
    return {
        type: DELETE_MESSAGE
    }
}

// component
// UI 组件
class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.addHandle = this.addHandle.bind(this);
        this.deleteHandle = this.deleteHandle.bind(this);
    }
    render() {
        const { messages } = this.props;
        const str = messages.map(obj =>
            <p key={obj.id}>
                <strong>id:</strong><span style={{ 'marginRight': '50px' }}>{obj.id}</span>
                <strong>name:</strong><span>{obj.name}</span>
            </p>
        );
        return (
            <div>
                {str}
                <button onClick={this.addHandle}>add</button>
                <button onClick={this.deleteHandle}>delete</button>
            </div>
        )
    }
    addHandle() {
        const { addMessage } = this.props;
        addMessage();
    }
    deleteHandle() {
        const { deleteMessage } = this.props;
        deleteMessage();
    }
}

// 手动log state
// class MessageListWrapper extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             messages: store.getState().messages
//         };
//         this.unSubscribeHandle = () => { };
//     }
//     render() {
//         return (
//             <MessageList messages={this.state.messages}
//                 getMessages={this.getMessages}
//                 addMessage={this.addMessage}
//                 deleteMessage={this.deleteMessage}></MessageList>
//         )
//     }
//     componentDidMount() {
//         this.unSubscribeHandle = store.subscribe(() => {
//             // 1.手动log state
//             // console.log('next state',store.getState())
//             this.setState(store.getState())
//         });
//     }
//     componentWillUnmount() {
//         this.unSubscribeHandle();
//     }
//     addMessage() {
//         // 1.console.log('dispatching',addMessageAction(new Date().getTime()));
//         store.dispatch(addMessageAction(new Date().getTime()));

//     }
//     deleteMessage() {
//         // 2.console.log('dispatching',deleteMessageAction());
//         store.dispatch(deleteMessageAction());
//     }
// }



// 函数包裹dispatch
// const dispatchAndLog = (store, action) => {
//     console.log('dispatching', action);
//     store.dispatch(action);
//     console.log('next state', store.getState());
// }
// class MessageListWrapper extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             messages: store.getState().messages
//         };
//         this.unSubscribeHandle = () => { };
//     }
//     render() {
//         return (
//             <MessageList messages={this.state.messages}
//                 getMessages={this.getMessages}
//                 addMessage={this.addMessage}
//                 deleteMessage={this.deleteMessage}></MessageList>
//         )

//     }
//     componentDidMount() {
//         this.unSubscribeHandle = store.subscribe(() => {
//             this.setState(store.getState())
//         });
//     }
//     componentWillUnmount() {
//         this.unSubscribeHandle();
//     }
//     addMessage() {
//         dispatchAndLog(store, addMessageAction(new Date().getTime()));
//     }
//     deleteMessage() {
//         dispatchAndLog(store, deleteMessageAction());
//     }
// }

// 重构dispatch
// const originDispatch = store.dispatch;
// store.dispatch = (action) => {
//     console.log('dispatching', action);
//     originDispatch(action);
//     console.log('next state', store.getState());
// }
// class MessageListWrapper extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             messages: store.getState().messages
//         };
//         this.unSubscribeHandle = () => { };
//     }
//     render() {
//         return (
//             <MessageList messages={this.state.messages}
//                 getMessages={this.getMessages}
//                 addMessage={this.addMessage}
//                 deleteMessage={this.deleteMessage}></MessageList>
//         )

//     }
//     componentDidMount() {
//         this.unSubscribeHandle = store.subscribe(() => {
//             this.setState(store.getState())
//         });
//     }
//     componentWillUnmount() {
//         this.unSubscribeHandle();
//     }
//     addMessage() {
//         store.dispatch(addMessageAction(new Date().getTime()));
//     }
//     deleteMessage() {
//         store.dispatch(deleteMessageAction());
//     }
// }

// 隐藏 dispatch(多个中间件时)
// 隐藏 dispatch 方式1
// const logger1 = function (store) {
//     let next = store.dispatch;
//     store.dispatch = function dispatchAndLog1(action) {
//         console.log('dispatching logger1', action);
//         next(action);
//         console.log('next state logger1', store.getState());
//     }
// }
// const logger2 = function (store) {
//     let next = store.dispatch;
//     store.dispatch = function dispatchAndLog2(action) {
//         console.log('dispatching logger2', action);
//         next(action);
//         console.log('next state logger2', store.getState());
//     }
// }
// logger1(store);
// logger2(store);

// 隐藏 dispatch 方式2
// const logger1 = function (store) {
//     let next = store.dispatch;
//     return function dispatchAndLog1(action) {
//         console.log('dispatching logger1', action);
//         next(action);
//         console.log('next state logger1', store.getState());
//     }
// }
// const logger2 = function (store) {
//     let next = store.dispatch;
//     return function dispatchAndLog2(action) {
//         console.log('dispatching logger2', action);
//         next(action);
//         console.log('next state logger2', store.getState());
//     }
// }
// const applyMiddlewareByMonkeypatching = (store, middlewares) => {
//     middlewares = middlewares.slice();
//     middlewares.reverse();
//     middlewares.forEach((middleware) => {
//         store.dispatch = middleware(store);
//     });
// }
// applyMiddlewareByMonkeypatching(store,[logger2,logger1]);

// next 作为参数传递
// const logger1 = function (store, next) {
//     return function dispatchAndLog1(action) {
//         console.log('dispatching logger1', action);
//         next(action);
//         console.log('next state logger1', store.getState());
//     }
// }
// const logger2 = function (store, next) {
//     return function dispatchAndLog2(action) {
//         console.log('dispatching logger2', action);
//         next(action);
//         console.log('next state logger2', store.getState());
//     }
// }
// let dispatch = store.dispatch;
// dispatch = logger1(store, dispatch);
// dispatch = logger2(store, dispatch);
// store = Object.assign({}, store, { dispatch });

// 修改为applyMiddleware
// function applyMiddleware(originStore, middlewares) {
//     let dispatch = originStore.dispatch;
//     middlewares = middlewares.slice();
//     middlewares.reverse();
//     middlewares.forEach(middleware => {
//         dispatch = middleware(originStore, dispatch);
//     })
//     store = Object.assign({}, originStore, { dispatch });
// }
// applyMiddleware(store, [logger2, logger1]);


// js柯里化
// const logger1 = function (store) {
//     return function (next) {
//         return function dispatchAndLog1(action) {
//             console.log('dispatching logger1', action);
//             next(action);
//             console.log('next state logger1', store.getState());
//         }
//     }
// }
// const logger2 = function (store) {
//     return function (next) {
//         return function dispatchAndLog2(action) {
//             console.log('dispatching logger2', action);
//             next(action);
//             console.log('next state logger2', store.getState());
//         }
//     }
// }

// es6 箭头函数改写
// const logger1 = (store) => (next) => (action) => {
//     console.log('dispatching logger1', action);
//     next(action);
//     console.log('next state logger1', store.getState());
// }

// const logger2 = (store) => (next) => (action) => {
//      console.log('dispatching logger2', action);
//      next(action);
//      console.log('next state logger2', store.getState());
// }


function applyMiddleware(originStore, middlewares) {
    let dispatch = originStore.dispatch;
    middlewares = middlewares.slice();
    middlewares.reverse();
    middlewares.forEach(middleware => {
        dispatch = middleware(originStore)(dispatch);
    })
    store = Object.assign({}, originStore, { dispatch });
}

applyMiddleware(store, [logger2, logger1]);



class MessageListWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: store.getState().messages
        };
        this.unSubscribeHandle = () => { };
    }
    render() {
        return (
            <MessageList messages={this.state.messages}
                getMessages={this.getMessages}
                addMessage={this.addMessage}
                deleteMessage={this.deleteMessage}></MessageList>
        )

    }
    componentDidMount() {
        this.unSubscribeHandle = store.subscribe(() => {
            this.setState(store.getState())
        });
    }
    componentWillUnmount() {
        this.unSubscribeHandle();
    }
    addMessage() {
        store.dispatch(addMessageAction(new Date().getTime()));
    }
    deleteMessage() {
        store.dispatch(deleteMessageAction());
    }
}



// App
class App extends React.Component {
    render() {
        return (
            <div>
                <MessageListWrapper></MessageListWrapper>
            </div>
        )
    }
}

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
)





import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers,applyMiddleware } from 'redux';

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

// middleware
const logger1 = (store) => (next) => (action) => {
    console.log('dispatching logger1', action);
    next(action);
    console.log('next state logger1', store.getState());
}

const logger2 = (store) => (next) => (action) => {
     console.log('dispatching logger2', action);
     next(action);
     console.log('next state logger2', store.getState());
}

let createStoreWithMiddleware = applyMiddleware(logger2,logger1)(createStore);
let store = createStoreWithMiddleware(reducer);

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
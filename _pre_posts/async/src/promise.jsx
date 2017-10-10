import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux'
import reduxPromise from 'redux-promise'
import { createAction } from 'redux-actions'
import logger from 'redux-logger'
import $ from 'jquery'

// constants
const FETCH_CNODE_LIST = 'FETCH_CNODE_LIST';
const FETCH_CNODE_FAILURE = 'FETCH_CNODE_FAILURE';
const FETCH_CNODE_SUCCESS = 'FETCH_CNODE_SUCCESS';

// reduce
const listReducer = (state = { isFetching: false, hasError: false, data: [] }, action) => {
    switch (action.type) {
        case FETCH_CNODE_LIST:
            return Object.assign({}, state, { isFetching: true, hasError: false });
        case FETCH_CNODE_FAILURE:
            return Object.assign({}, state, { hasError: true, isFetching: false });
        case FETCH_CNODE_SUCCESS:
            return Object.assign({}, state, { data: action.payload, isFetching: false, hasError: false });
        default:
            return state
    }
}
const reducer = combineReducers({
    cnode: listReducer
});

let createStoreWithMiddleware = applyMiddleware(reduxPromise, logger)(createStore);
let store = createStoreWithMiddleware(reducer);

// actions
const beginFectch = () => {
    return {
        type: FETCH_CNODE_LIST
    }
}
const fectchFail = () => {
    return {
        type: FETCH_CNODE_FAILURE
    }
}
const fectchSuccess = (data) => {
    return {
        type: FETCH_CNODE_SUCCESS,
        data: data
    }
}
// const fetchNodeList = (dispatch, { tab }) => new Promise(function () {
//     dispatch(beginFectch());
//     if (tab === 'job') {
//         dispatch(fectchFail());
//         return;
//     }
//     return $.get(`https://cnodejs.org/api/v1/topics?tab=${tab}&limit=20`).then(result => {
//         dispatch(fectchSuccess(result.data));
//     });
// });

const fetchNodeList = (dispatch, { tab }) => {
    dispatch(beginFectch());
    if (tab === 'job') {
        dispatch(fectchFail());
        return;
    }
    dispatch(createAction(FETCH_CNODE_SUCCESS)($.get(`https://cnodejs.org/api/v1/topics?tab=${tab}&limit=20`).then(result => result.data)))
}


// component
class CnodeList extends React.Component {
    constructor(props) {
        super(props);
        this.getNodeList = this.getNodeList.bind(this);
    }
    render() {
        const { cnode } = this.props;
        var str = '';
        if (cnode.isFetching) {
            str = '正在查询。。。。';
        }
        else if (cnode.hasError) {
            str = '出现错误，请重试。。。';
        } else {
            if (cnode.data && cnode.data.length > 0) {
                str = cnode.data.map(obj =>
                    <li key={obj.id}>
                        <strong>id:</strong><span style={{ 'marginRight': '50px' }}>{obj.id}</span>
                        <strong>content:</strong><span>{obj.content.slice(100, 250)}</span>
                    </li>
                );
            } else {
                str = <li>请查询。。。</li>;
            }

        }
        return (
            <div>
                <button onClick={this.getNodeList.bind(this, 'ask')}>查询</button>
                <ul>{str}</ul>
                <button onClick={this.getNodeList.bind(this, 'ask')}>1</button>
                <button onClick={this.getNodeList.bind(this, 'share')}>2</button>
                <button onClick={this.getNodeList.bind(this, 'job')}>3</button>
                <button onClick={this.getNodeList.bind(this, 'good')}>4</button>
            </div>
        )
    }
    getNodeList(tab) {
        const { getNodeList } = this.props;
        getNodeList(tab);
    }
}

const mapStateToProps = (state) => {
    return {
        cnode: state.cnode
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getNodeList: (tab) => {
            fetchNodeList(dispatch, { tab })
        }
    }
}
const CnodeListWrapper = connect(mapStateToProps, mapDispatchToProps)(CnodeList);

class App extends React.Component {
    render() {
        return (
            <div>
                <CnodeListWrapper></CnodeListWrapper>
            </div>
        )
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App></App>
    </Provider>,
    document.getElementById('root')
)
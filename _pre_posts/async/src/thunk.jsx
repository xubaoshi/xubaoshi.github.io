import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk'
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
            return Object.assign({}, state, { isFetching: true });
        case FETCH_CNODE_FAILURE:
            return Object.assign({}, state, { hasError: true });
        case FETCH_CNODE_SUCCESS:
            return Object.assign({}, state, { data: action.data, isFetching: false, hasError: false });
        default:
            return state
    }
}
const reducer = combineReducers({
    messages: listReducer
});

let createStoreWithMiddleware = applyMiddleware(ReduxThunk, logger);
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
const fetchNodeList = ({ tab }) => {
    return dispatch => {
        dispatch(beginFectch());
        $.get(`https://cnodejs.org/api/topics?tab=${tab}&limit=20`, function (result) {
            if (result && result.data) {
                if (Math.random() > 0.5) {
                    dispatch(fectchSuccess(result.data));
                } else {
                    dispatch(fectchFail());
                }
            }
        })
    }
}

// component
// UI 组件
class CnodeList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { result } = this.props;
        var str = '';
        if (result.isFetching) {
            str = '正在查询。。。。';
        } else if (result.hasError) {
            str = '出现错误，请重试。。。';
        } else {
            str = result.data.map(obj =>
                <p key={obj.id}>
                    <strong>id:</strong><span style={{ 'marginRight': '50px' }}>{obj.id}</span>
                    <strong>author_id:</strong><span>{obj.author_id}</span>
                </p>
            );
        }

        return (
            <div>
                <div>{str}</div>
                <button onClick={this.getNodeList.bind(this, 1)}>1</button>
                <button onClick={this.getNodeList.bind(this, 2)}>2</button>
                <button onClick={this.getNodeList.bind(this, 3)}>3</button>
                <button onClick={this.getNodeList.bind(this, 4)}>4</button>
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
        result: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getNodeList(tab) {
            dispatch(fetchNodeList(tab))
        }
    }
}

const CnodeListWrapper = connect(mapStateToProps, mapStateToProps)(CnodeList);

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
    <App></App>,
    document.getElementById('root')
)
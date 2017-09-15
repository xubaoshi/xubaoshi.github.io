import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk'
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
            return Object.assign({}, state, { data: action.data, isFetching: false, hasError: false });
        default:
            return state
    }
}
const reducer = combineReducers({
    cnode: listReducer
});

let createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
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
        $.ajax({
            url: `https://cnodejs.org/api/v1/topics?tab=${tab}&limit=20`,
            success: function (result) {
                if (result.success && result.data) {
                    dispatch(fectchSuccess(result.data));
                } else {
                    dispatch(fectchFail());
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                dispatch(fectchFail());
            }
        });
    }
}

// component
// UI 组件
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
                        <strong>author_id:</strong><span>{obj.author_id}</span>
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
        getNodeList(tab) {
            dispatch(fetchNodeList({ tab }))
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
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

// reduce
const listReducer = (state = { hasError: false, data: [] }, action) => {
    switch (action.type) {
        case FETCH_CNODE_LIST:
            if (action.payload.error) {
                return Object.assign({}, state, { hasError: true });
            } else {
                return Object.assign({}, state, { data: action.payload, hasError: false });
            }
        default:
            return state
    }
}

const reducer = combineReducers({
    cnode: listReducer
});

let createStoreWithMiddleware = applyMiddleware(reduxPromise, logger)(createStore);
let store = createStoreWithMiddleware(reducer);

// // 方式1 actions
// const fectcList = (data) => {
//     return {
//         type: FETCH_CNODE_LIST,
//         payload: data
//     }
// }
// const fetchNodeList = ({ tab }) => new Promise(function (resolve, reject) {
//     return $.get(`https://cnodejs.org/api/v1/topics?tab=${tab}&limit=20`).then(result => {
//         resolve(fectcList(result.data));
//     });
// });

// 方式二
const fetchNodeList = createAction(FETCH_CNODE_LIST, ({tab}) => {
    return new Promise(function (resolve, reject) {
        $.get(`https://cnodejs.org/api/v1/topics?tab=${tab}&limit=20`).then(function (result) {
            resolve(result.data);
        }, function () {
            reject({ error: true })
        });
    })
});


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
            dispatch(fetchNodeList({ tab }));
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
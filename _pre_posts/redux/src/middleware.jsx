import React from 'react';
import ReactDOM from 'react-dom';
import { connect , Provider } from 'react-redux'
import { createStore,combineReducers  } from 'redux'


// constants

// reduce
const reducer = (state=[],action) => {
    switch(action.type){
        default:
        return state
    }
}
const store = combineReducers({

});

// action

// component
class App extends React.Component{
    render(){
        return (
            <div>
                <h1>Logger</h1>
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



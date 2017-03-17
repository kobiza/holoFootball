'use strict';

import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import App from './components/App.jsx';

import currentUserReducer from './reducers/currentUserReducer';


const makeStore = initialState => {
    const reducers = combineReducers({
        currentUser: currentUserReducer
    });

    const middleware = applyMiddleware();

    return createStore(reducers, initialState, middleware);
};

const store = makeStore();

class AppWrapper extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );
    }
}

render(<AppWrapper/>, document.getElementById('app'));

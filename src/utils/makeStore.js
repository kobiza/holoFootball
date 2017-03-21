'use strict';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import currentUserReducer from '../reducers/currentUserReducer.js';
import playersReducer from '../reducers/playersReducer.js';

const makeStore = initialState => {
    const reducers = combineReducers({
        currentUser: currentUserReducer,
        players: playersReducer
    });

    const middleware = applyMiddleware(
        thunk
    );

    return createStore(reducers, initialState, middleware);
};

export default makeStore;

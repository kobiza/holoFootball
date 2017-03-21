'use strict';

import {createStore, combineReducers} from 'redux';

import fbReducer from '../reducers/fbReducer.js';

const makeStore = initialState => {
    const reducers = combineReducers({
        fb: fbReducer
    });

    return createStore(reducers, initialState);
};

export default makeStore;

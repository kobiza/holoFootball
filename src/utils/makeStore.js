'use strict';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

// import {currentUser, eventAttendance} from '../reducers/allReducers.js';

import currentUserReducer from '../reducers/currentUserReducer.js';
import eventAttendanceReducer from '../reducers/eventAttendanceReducer.js';

const makeStore = initialState => {
    const reducers = combineReducers({
        currentUser: currentUserReducer,
        eventAttendance: eventAttendanceReducer
    });

    const middleware = applyMiddleware(
        thunk
    );

    return createStore(reducers, initialState, middleware);
};

export default makeStore;

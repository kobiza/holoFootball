'use strict';

import {SET_CURRENT_USER} from '../actions/actionTypes';

const initialState = 'New user';

export default function currentUserReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return action.userName;
        default:
            return state;
    }
}

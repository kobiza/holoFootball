'use strict';

import _ from 'lodash';
import {CURRENT_EVENT_ATTENDANCE_RECEIVED, ATTENDANCE_CHANGED} from '../actions/actionTypes';

const initialState = {};

export default function eventAttendanceReducer(state = initialState, action = {}) {
    switch (action.type) {
        case CURRENT_EVENT_ATTENDANCE_RECEIVED:
            return action.attendance;
        case ATTENDANCE_CHANGED:
            let newState = _.clone(state);
            newState[action.id] = action.value;
            return newState;
        default:
            return state;
    }
}

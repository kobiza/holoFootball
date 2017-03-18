'use strict';

import {CURRENT_EVENT_ATTENDANCE_RECEIVED, ATTENDANCE_CHANGED} from '../actions/actionTypes';

const initialState = {};

export default function eventAttendanceReducer(state = initialState, action = {}) {
    switch (action.type) {
        case CURRENT_EVENT_ATTENDANCE_RECEIVED:
            return action.attendance;
        case ATTENDANCE_CHANGED:
            console.log('ATTENDANCE_CHANGED: ', action);
            return state;
        default:
            return state;
    }
}

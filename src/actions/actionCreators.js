'use strict';

import * as actionTypes from './actionTypes';

export const setCurrentUser = (userName) => {
    return {
        type: actionTypes.SET_CURRENT_USER,
        userName
    };
};

export const currentEventAttendanceReceived = (attendance) => {
    return {
        type: actionTypes.CURRENT_EVENT_ATTENDANCE_RECEIVED,
        attendance
    };
};

export const attendanceChanged = (id, value) => {
    return {
        type: actionTypes.ATTENDANCE_CHANGED,
        id,
        value
    };
};

'use strict';

import * as DAL from './DAL.js';
import {currentEventAttendanceReceived, attendanceChanged} from '../actions/actionCreators'

export const fetchAppData  = () => (dispatch, getState) =>
    DAL.read('/attendance')
        .then((data) => Promise.all([
            dispatch(currentEventAttendanceReceived(data))
        ]));

export const registerForAttendanceChange  = () => (dispatch, getState) =>
    DAL.onChildChanged('/attendance', (itemChangedSnapshot, prevItemKey) => {
        dispatch(attendanceChanged(itemChangedSnapshot.key, itemChangedSnapshot.val()));
    });


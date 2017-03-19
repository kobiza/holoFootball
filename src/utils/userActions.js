'use strict';

import * as DAL from './DAL.js';
import {currentEventAttendanceReceived, attendanceChanged} from '../actions/actionCreators'

const fetchData  = (path, action) => (dispatch, getState) =>
    DAL.read(path)
        .then((data) => Promise.all([
            dispatch(action(data))
        ]));

export const registerToChildChanged  = (path, action) => (dispatch, getState) =>
    DAL.onChildChanged(path, (itemChangedSnapshot) => {
        dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
    });

// export const unRegisterToChildChanged  = (path, action) => (dispatch, getState) =>
//     DAL.onChildChanged(path, (itemChangedSnapshot) => {
//         dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
//     });


export const fetchAttendance  = () => fetchData('/attendance', currentEventAttendanceReceived);
export const registerForAttendanceChange  = () => registerToChildChanged('/attendance', attendanceChanged);







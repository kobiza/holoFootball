'use strict';

import * as DAL from './DAL.js';

export const fetchData  = (path, action) => (dispatch, getState) =>
    DAL.read(path)
        .then((data) => Promise.all([
            dispatch(action(data))
        ]));

export const registerToChildChanged  = (path, action) => (dispatch, getState) =>
    DAL.onChildChanged(path, (itemChangedSnapshot) => {
        dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
    });

export const registerToChildAdded  = (path, action) => (dispatch, getState) =>
    DAL.onChildAdded(path, (itemChangedSnapshot) => {
        dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
    });

export const registerToChildRemoved  = (path, action) => (dispatch, getState) =>
    DAL.onChildRemoved(path, (itemChangedSnapshot) => {
        dispatch(action(itemChangedSnapshot.key));
    });










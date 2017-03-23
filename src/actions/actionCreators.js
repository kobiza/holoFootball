'use strict';

import * as actionTypes from './actionTypes';

export const fbCollectionReceived = (id, value) => {
    return {
        type: actionTypes.FB_COLLECTION_RECEIVED,
        id,
        value
    };
};

export const fbClearCollection = (id) => {
    return {
        type: actionTypes.FB_CLEAR_COLLECTION,
        id
    };
};

export const fbChildChanged = (id, childId, value) => {
    return {
        type: actionTypes.FB_CHILD_CHANGED,
        id,
        childId,
        value
    };
};

export const fbChildAdded = (id, childId, value) => {
    return {
        type: actionTypes.FB_CHILD_ADDED,
        id,
        childId,
        value
    };
};

export const fbChildRemove = (id, childId) => {
    return {
        type: actionTypes.FB_CHILD_REMOVED,
        id,
        childId
    };
};

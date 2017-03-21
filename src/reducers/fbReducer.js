'use strict';

import _ from 'lodash';
import {FB_COLLECTION_RECEIVED, FB_CHILD_CHANGED, FB_CHILD_ADDED} from '../actions/actionTypes';

const initialState = {};

export default function fbReducer(state = initialState, action = {}) {
    let newState, newSubState;
    switch (action.type) {
        case FB_COLLECTION_RECEIVED:
            newState = _.clone(state);
            newState[action.id] = action.value;

            return newState;
        case FB_CHILD_CHANGED:
            newState = _.clone(state);
            newSubState = _.clone(newState[action.id]);

            newSubState[action.childId] = action.value;
            newState[action.id] = newSubState;

            return newState;
        case FB_CHILD_ADDED:
            newState = _.clone(state);
            newSubState = _.clone(newState[action.id]);

            newSubState[action.childId] = action.value;
            newState[action.id] = newSubState;

            return newState;
        default:
            return state;
    }
}

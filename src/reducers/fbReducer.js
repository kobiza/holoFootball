'use strict';

import _ from 'lodash';
import {FB_COLLECTION_RECEIVED, FB_CLEAR_COLLECTION, FB_CHILD_CHANGED, FB_CHILD_ADDED, FB_CHILD_REMOVED} from '../actions/actionTypes';

const initialState = {};

export default function fbReducer(state = initialState, action = {}) {
    let newState, newSubState;
    switch (action.type) {
        case FB_COLLECTION_RECEIVED:
            newState = _.clone(state);
            newState[action.id] = action.value;

            return newState;
        case FB_CLEAR_COLLECTION:
            newState = _.clone(state);
            delete newState[action.id];

            return newState;
        case FB_CHILD_CHANGED:
            if (!_.has(state, action.id)){
                return state;
            }

            newState = _.clone(state);
            newSubState = _.clone(newState[action.id]);

            newSubState[action.childId] = action.value;
            newState[action.id] = newSubState;

            return newState;
        case FB_CHILD_ADDED:
            if (!_.has(state, action.id)){
                return state;
            }

            newState = _.clone(state);
            newSubState = _.clone(newState[action.id]);

            newSubState[action.childId] = action.value;
            newState[action.id] = newSubState;

            return newState;
        case FB_CHILD_REMOVED:
            if (!_.has(state, action.id)){
                return state;
            }

            newState = _.clone(state);
            newSubState = _.clone(newState[action.id]);
            delete newSubState[action.childId];

            newState[action.id] = newSubState;

            return newState;
        default:
            return state;
    }
}

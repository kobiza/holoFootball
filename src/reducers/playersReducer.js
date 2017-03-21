'use strict';

import _ from 'lodash';
import {PLAYERS_RECEIVED, PLAYER_CHANGED, PLAYER_ADDED} from '../actions/actionTypes';

const initialState = {};

export default function playersReducer(state = initialState, action = {}) {
    let newState;
    switch (action.type) {
        case PLAYERS_RECEIVED:
            return action.players;
        case PLAYER_CHANGED:
            newState = _.clone(state);
            newState[action.id] = action.value;
            return newState;
        case PLAYER_ADDED:
            newState = _.clone(state);
            newState[action.id] = action.value;
            return newState;
        default:
            return state;
    }
}

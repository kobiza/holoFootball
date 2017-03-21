'use strict';

import * as actionTypes from './actionTypes';

export const playersReceived = (players) => {
    return {
        type: actionTypes.PLAYERS_RECEIVED,
        players
    };
};

export const playerChanged = (id, value) => {
    return {
        type: actionTypes.PLAYER_CHANGED,
        id,
        value
    };
};

export const playerAdded = (id, value) => {
    return {
        type: actionTypes.PLAYER_ADDED,
        id,
        value
    };
};

'use strict';

import _ from 'lodash';
import * as DAL from './DAL.js';
import {playersReceived, playerChanged, playerAdded} from '../actions/actionCreators'

const fetchData  = (path, action) => (dispatch, getState) =>
    DAL.read(path)
        .then((data) => Promise.all([
            dispatch(action(data))
        ]));

const registerToChildChanged  = (path, action) => (dispatch, getState) =>
    DAL.onChildChanged(path, (itemChangedSnapshot) => {
        dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
    });

const registerToChildAdded  = (path, action) => (dispatch, getState) =>
    DAL.onChildAdded(path, (itemChangedSnapshot) => {
        dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
    });

// export const unRegisterToChildChanged  = (path, action) => (dispatch, getState) =>
//     DAL.onChildChanged(path, (itemChangedSnapshot) => {
//         dispatch(action(itemChangedSnapshot.key, itemChangedSnapshot.val()));
//     });

export const fetchPlayers  = () => fetchData('/players', playersReceived);
export const registerForPlayersChange  = () => registerToChildChanged('/players', playerChanged);
export const registerForPlayerAdded  = () => registerToChildAdded('/players', playerAdded);
export const updatePlayer = (playerId, value) => {
    DAL.setIn('/players/' + playerId, value);
};
const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

const getNewPlayerID = () => {
    return 'player-' + s4();
};

export const addPlayer = (playerName) => {
    var playerId = getNewPlayerID();
    var defaults = {
        isPermanent: true,
        pointsCredit: 0
    };
    var newPlayer = _.defaults({name: playerName}, defaults);

    DAL.setIn('/players/' + playerId, newPlayer);
};








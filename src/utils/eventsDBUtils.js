import _ from 'lodash';
import * as DAL from './DAL.js';
import { Promise } from 'bluebird';
import {addCreditPointsToPlayer} from './playersDBUtils';

const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

const getNewEventID= () => {
    return 'event-' + s4();
};

const getNewTransactionID= () => {
    return 'tran-' + s4();
};

export const createEvent = (date, name) => {
    const eventID = getNewEventID();
    const defaults = {
        players: [],
        status: 'OPEN'
    };
    const newEvent = _.defaults({date: date.getTime(), name}, defaults);

    return DAL.setIn('/events/' + eventID, newEvent);
};

export const addPlayerToEvent = (eventId, playerId) => {
    const eventPath = '/events/' + eventId;

    return DAL.read(eventPath).then((event) => {
        let players = event.players || [];
        players.push(playerId);
        const playersPath = eventPath + '/players';
        return DAL.setIn(playersPath, players)
    });
};

export const addPlayersToEvent = (eventId, playersToAdd) => {
    const eventPath = '/events/' + eventId;

    return DAL.read(eventPath).then((event) => {
        let players = event.players || [];
        players = players.concat(playersToAdd);
        const playersPath = eventPath + '/players';
        return DAL.setIn(playersPath, players)
    });
};

export const removePlayerFromEvent = (eventId, playerId) => {
    const eventPath = '/events/' + eventId;

    return DAL.read(eventPath).then((event) => {
        let players = event.players || [];
        const removed = _.remove(players, (id) => id === playerId);

        if (!_.isEmpty(removed)){
            const playersPath = eventPath + '/players';
            return DAL.setIn(playersPath, players);
        }

        return Promise.resolve();
    });
};

export const closeEvent = (eventId) => {
    const eventPath = '/events/' + eventId;
    const eventStatusPath = eventPath + '/status';



    return DAL.read(eventPath).then((event) => {
        if (event.status !== 'OPEN'){
            return Promise.resolve();
        }

        const transactionsUpdates = _.map(event.players, (playerId) => {
            const newTransactionPath = '/transactions/' + getNewTransactionID();
            return DAL.setIn(newTransactionPath, {playerId, creditPoints: -30, type: 'EVENT', relatedEntity: eventId});
        });

        const playersUpdates = _.map(event.players, (playerId) => addCreditPointsToPlayer(playerId, -30));


        return Promise.all([
            DAL.setIn(eventStatusPath, 'CLOSED'),
            ...transactionsUpdates,
            ...playersUpdates
        ]);
    });
};

export const cancelEvent = (eventId) => {
    const eventPath = '/events/' + eventId;
    const eventStatusPath = eventPath + '/status';

    return DAL.read(eventPath).then((event) => {
        if (event.status !== 'OPEN'){
            return Promise.resolve();
        }

        return DAL.setIn(eventStatusPath, 'CANCELED');
    });
};


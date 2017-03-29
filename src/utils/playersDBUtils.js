import _ from 'lodash';
import * as DAL from './DAL.js';

const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

const getNewPlayerID = () => {
    return 'player-' + s4();
};

const getNewPaymentID= () => {
    return 'pay-' + s4();
};

const getNewTransactionID= () => {
    return 'tran-' + s4();
};

export const addPlayer = (playerName) => {
    var playerId = getNewPlayerID();
    var defaults = {
        isPermanent: true,
        creditPoints: 0
    };
    var newPlayer = _.defaults({name: playerName}, defaults);

    return DAL.setIn('/players/' + playerId, newPlayer);
};

export const updatePlayer = (playerId, value) => {
    return DAL.setIn('/players/' + playerId, value);
};

const calcPoints = (price) => {
    if (price > 0) {
        const bonus = Math.floor(price / 100) * 20;

        return price + bonus;
    }

    return price;
};

export const createPaymentTransaction = (playerId, payment) => {
    const newPaymentID = getNewPaymentID();
    const newPaymentPath = '/payments/' + newPaymentID;
    const newTransactionPath = '/transactions/' + getNewTransactionID();
    const playerPath = '/players/' + playerId;
    const creditPointsPath = playerPath + '/creditPoints';

    return DAL.read(playerPath)
        .then((player) => {
            console.log("player= ", player);
            const pointsToAdd = calcPoints(payment);
            const playerCreditPoints = player.creditPoints + pointsToAdd;
            return Promise.all([
                DAL.setIn(newPaymentPath, {playerId, payment, date: Date.now()}),
                DAL.setIn(newTransactionPath, {playerId, creditPoints: pointsToAdd, type: 'PAYMENT', relatedEntity: newPaymentID}),
                DAL.setIn(creditPointsPath, playerCreditPoints)
        ])});
};

// *
// transactions should be added for payment or event_done actions. to have full story about credit points
// player: id, date: date, creditPoints: +30, type: 'payment', relatedEntity: pay-1z29
// player: id, date: date, creditPoints: -30, type: 'event', relatedEntity: event-d2e3
// */



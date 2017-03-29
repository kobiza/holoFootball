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

const getNewPaymentTransactionID= () => {
    return 'pay-' + s4();
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
    const newPaymentPath = '/payments/' + getNewPaymentTransactionID();
    const playerPath = '/players/' + playerId;
    const creditPointsPath = playerPath + '/creditPoints';

    return DAL.read(playerPath)
        .then((player) => {
            console.log("player= ", player);
            const pointsToAdd = calcPoints(payment);
            let playerCreditPoints = player.creditPoints + pointsToAdd;
            return Promise.all([
                DAL.setIn(newPaymentPath, {playerId, payment, pointsAdded: pointsToAdd, date: Date.now()}),
                DAL.setIn(creditPointsPath, playerCreditPoints)
        ])});
};
//
// export const addCreditPointsToPlayer = (playerId, value) => {
//     const creditPointsPath = '/players/' + playerId + '/creditPoints';
//
//     DAL.read(creditPointsPath)
//         .then((data) => Promise.all([
//             dispatch(action(data))
//         ]));
//
//     DAL.setIn(creditPointsPath, value);
// };

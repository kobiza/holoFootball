'use strict';

import * as actionTypes from './actionTypes';

export const setCurrentUser = (userName) => {
    return {
        type: actionTypes.SET_CURRENT_USER,
        userName
    };
};

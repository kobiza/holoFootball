'use strict';

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {updatePlayer, addPlayer} from '../utils/userActions.js'

import fbConnect from '../hoc/fbConnect.jsx';


function mapStateToProps(state) {
    return {
        players: state.fb.players
    };
}

class Payments extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const players = _.map(this.props.players, (currentPlayer, playerId) => {
            return (
                <div className="player-row" key={'player-' + playerId}>
                    <div className="player-name" style={{display: 'inline-block', width: "100px"}}>{currentPlayer.name}</div>
                    <label>{' Credit: ' + currentPlayer.pointsCredit}</label>
                </div>
            );
        });

        return (
            <div>
                <div className="players-list">
                    {players}
                </div>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect('/players', 'players')(Payments);
export default connect(mapStateToProps)(wrappedWithFb);

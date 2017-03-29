'use strict';

require('./Payments.scss');

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {createPaymentTransaction} from '../utils/playersDBUtils.js'

import fbConnect from '../hoc/fbConnect.jsx';


function mapStateToProps(state) {
    return {
        players: state.fb.players
    };
}

class Payments extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editingPlayer: null,
            editingPrice: 0
        };

        this.startEditMode = (playerId) => {
            this.setState({editingPlayer: playerId});
        };

        this.changeEditingPrice = (event) => {
            const price = Number(event.target.value);

            this.setState({editingPrice: price});
        };

        this.updatePlayerPayments = () => {
            if (this.state.editingPrice !== 0) {
                createPaymentTransaction(this.state.editingPlayer, this.state.editingPrice)
                    .then(() => this.closeEditMode());
            } else {
                this.closeEditMode();
            }
        };

        this.closeEditMode = () => {
            this.setState({
                editingPlayer: null,
                editingPrice: 0
            });
        };
    }

    render() {
        const players = _.map(this.props.players, (currentPlayer, playerId) => {
            const editModeContainer = (this.state.editingPlayer === playerId && (
                <div className="edit-container" key={'editContainer-' + playerId}>
                    <input type="number" value={this.state.editingPrice} onChange={this.changeEditingPrice}/>
                    <input type="button" value="V" onClick={this.updatePlayerPayments}/>
                    <input type="button" value="X" onClick={this.closeEditMode}/>
                </div>
            ));

            return (
                <div className="player-row" key={'player-' + playerId}>
                    <div className="player-name">{currentPlayer.name}</div>
                    <label>{' Credit: ' + currentPlayer.creditPoints}</label>
                    <input type="button" value="edit" onClick={() => {this.startEditMode(playerId)}}/>
                    {editModeContainer}
                </div>
            );
        });

        return (
            <div className="payments-container">
                <div className="players-list">
                    {players}
                </div>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect('/players', 'players')(Payments);
export default connect(mapStateToProps)(wrappedWithFb);

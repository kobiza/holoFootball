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

class PlayersEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newUserName: ''
        };

        this.addUser = () => {
            if(_.isEmpty(this.state.newUserName)){
                return;
            }

            addPlayer(this.state.newUserName);
            this.setState({newUserName: ''});
        };

        this.setNewUserName = (event) => {
            this.setState({newUserName: event.target.value});
        };
    }

    togglePermanent(playerId, playerData) {
        var playerDataToUpdate = _.defaults({isPermanent: !playerData.isPermanent}, playerData);

        updatePlayer(playerId, playerDataToUpdate);
    }

    render() {
        const players = _.map(this.props.players, (currentPlayer, playerId) => {
            return (
                <div className="player-row" key={'player-' + playerId}>
                    <label className="player-name">{currentPlayer.name}</label>
                    <input type="checkbox" checked={currentPlayer.isPermanent} onChange={() => this.togglePermanent(playerId, currentPlayer)}/>
                    <label>Permanent</label>
                    <label>{' Credit: ' + currentPlayer.pointsCredit}</label>
                </div>
            );
        });

        return (
            <div>
                <div className="add-player">
                    <input type="text" placeholder="new player" onChange={this.setNewUserName} value={this.state.newUserName}/>
                    <input type="button" value="add" onClick={this.addUser}/>
                </div>
                <div className="players-list">
                    {players}
                </div>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect('/players', 'players')(PlayersEditor);
export default connect(mapStateToProps)(wrappedWithFb);

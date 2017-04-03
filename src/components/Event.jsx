'use strict';

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {addPlayerToEvent, removePlayerFromEvent, closeEvent} from '../utils/eventsDBUtils.js'

import fbConnect from '../hoc/fbConnect.jsx';


const mapStateToProps = (state) => {
    return {
        editingEvent: state.fb.editingEvent,
        players: state.fb.players
    };
};

class Event extends React.Component {

    constructor(props) {
        super(props);

        this.approve = (playerId) => {
            const eventId = this.props.match.params.id;

            addPlayerToEvent(eventId, playerId);
        };

        this.abortApprove = (playerId) => {
            const eventId = this.props.match.params.id;

            removePlayerFromEvent(eventId, playerId);
        };

        this.closeEvent = () => {
            const eventId = this.props.match.params.id;

            closeEvent(eventId);
        }
    }

    render() {
        if (!this.props.editingEvent){
            return <div className="event-container"></div>
        }

        const approved = _.pick(this.props.players, this.props.editingEvent.players);
        const didNotApproved = _.omit(this.props.players, this.props.editingEvent.players);

        const approvedRows = _.map(approved, (player, playerId) => {
            return (
                <div className="player-row approved" key={'approved-player-' + playerId}>
                    <div className="player-name">{player.name}</div>
                    <input type="button" value="X" onClick={() => this.abortApprove(playerId)}/>
                </div>
            );
        });

        const didNotApprovedRows = _.map(didNotApproved, (player, playerId) => {
            return (
                <div className="player-row did-not-approved" key={'not-approved-player-' + playerId}>
                    <div className="player-name">{player.name}</div>
                    <input type="button" value="V" onClick={() => this.approve(playerId)}/>
                </div>
            );
        });

        return (
            <div className="event-container">
                <h1>{this.props.match.params.id + ' - ' + new Date(this.props.editingEvent.date)}</h1>
                {approvedRows}
                <div className="separator"></div>
                {didNotApprovedRows}
                <input type="button" value="close" onClick={this.closeEvent}/>
            </div>
        );
    }

}

const mapStateToFirebase = (props) => {
    const eventId = props.match.params.id;

    return {
        'editingEvent': '/events/' + eventId,
        'players': '/players'
    };
};

const wrappedWithFb = fbConnect(mapStateToFirebase)(Event);
export default connect(mapStateToProps)(wrappedWithFb);

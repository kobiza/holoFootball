'use strict';

require('./Event.scss');

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {addPlayersToEvent, removePlayerFromEvent, closeEvent} from '../utils/eventsDBUtils.js'
import Select from 'react-select';

import fbConnect from '../hoc/fbConnect.jsx';

import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';

import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import ThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';

const mapStateToProps = (state) => {
    return {
        editingEvent: state.fb.editingEvent,
        players: state.fb.players
    };
};

const dateToString = (date) => (new Date(date)).toLocaleDateString();


class Event extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'status',
            isAddPopupOpen: false,
            playersToAdd: []
        };

        this.addPlayersToEvent = (playerId) => {
            if(_.isEmpty(this.state.playersToAdd)){
                return;
            }

            const eventId = this.props.match.params.id;
            const playersIds = _.map(this.state.playersToAdd, 'value');
            addPlayersToEvent(eventId, playersIds);

            this.closeAddPopup();
        };

        // this.abortApprove = (playerId) => {
        //     const eventId = this.props.match.params.id;
        //
        //     removePlayerFromEvent(eventId, playerId);
        // };

        this.closeEvent = () => {
            const eventId = this.props.match.params.id;

            closeEvent(eventId);
        };

        this.openAddPopup = () => {
            this.setState({isAddPopupOpen: true, playersToAdd: []});
        };

        this.closeAddPopup = () => {
            this.setState({isAddPopupOpen: false, playersToAdd: []});
        };

        this.updatePlayersToAdd = (playersToAdd) => {
            this.setState({ playersToAdd });
        };

        this.handleChange = (selectedTab) => {
            this.setState({ selectedTab });
        }
    }

    render() {
        if (!this.props.editingEvent){
            return <div className="event-container"></div>
        }

        const approved = _.pick(this.props.players, this.props.editingEvent.players);
        const didNotApproved = _.omit(this.props.players, this.props.editingEvent.players);

        const permanentApproved = _.pickBy(approved, (player) => player.isPermanent);
        const guestsApproved = _.omitBy(approved, (player) => player.isPermanent);

        const permanentApprovedRows = _.map(permanentApproved, (player, playerId) => {
            return (
                <ListItem key={playerId} primaryText={player.name}/>
            );
        });

        const guestsApprovedRows = _.map(guestsApproved, (player, playerId) => {
            return (
                <ListItem key={playerId} primaryText={player.name}/>
            );
        });

        const actions = [
            <FlatButton
                label="Add"
                primary={true}
                onTouchTap={this.addPlayersToEvent}
            />
        ];

        const playersToAddDataSource = _.map(didNotApproved, (player, playerId) => ({label: player.name, value: playerId}));

        const playerManageContainer = (
            <div>
                <List>
                    <Subheader>Permanents</Subheader>
                    {permanentApprovedRows}
                </List>
                <Divider />
                <List>
                    <Subheader>Guests</Subheader>
                    {guestsApprovedRows}
                </List>
                <FloatingActionButton mini={true} className="add-button" onTouchTap={this.openAddPopup} >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );

        const numberOfPlayers = _.keys(approved).length;
        let status = 'good';
        if (numberOfPlayers < 10) {
            status = 'bad';
        } else if (numberOfPlayers < 13) {
            status = 'nice';
        }

        const statusContainer = (
            <div>
                <div className={"big-number " + status}>{numberOfPlayers}</div>
                <div className="button-container"><RaisedButton primary={true} onTouchTap={this.closeEvent} style={{display: 'block'}} label="Close event"/></div>
                <div className="button-container cancel-button-container"><RaisedButton style={{display: 'block'}} label="Cancel event"/></div>
            </div>
        );

        return (
            <div className="event-container">
                <h2 className="title">{dateToString(this.props.editingEvent.date)}</h2>

                <Tabs
                    value={this.state.selectedTab}
                    onChange={this.handleChange}
                >
                    <Tab
                        value="status"
                        icon={<ThumbsUpDown/>}
                        label="STATUS"
                    />
                    <Tab
                        value="players"
                        icon={<PermIdentity/>}
                        label="PLAYERS"
                    />
                </Tabs>
                {this.state.selectedTab === 'players' ? playerManageContainer : statusContainer}
                <Dialog
                    className="add-to-event-dialog"
                    title="Add payment"
                    actions={actions}
                    modal={false}
                    open={this.state.isAddPopupOpen}
                    contentStyle={{width: '300px'}}
                    onRequestClose={this.closeAddPopup}>
                    <Select
                        className="dialog-input"
                        multi
                        clearable={false}
                        value={this.state.playersToAdd}
                        placeholder="Select player(s)"
                        options={playersToAddDataSource}
                        onChange={this.updatePlayersToAdd} />
                </Dialog>
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

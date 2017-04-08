'use strict';

require('./Players.scss');

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {updatePlayer, addPlayer} from '../utils/playersDBUtils.js'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import fbConnect from '../hoc/fbConnect.jsx';


function mapStateToProps(state) {
    return {
        players: state.fb.players
    };
}

const isInvalidPlayerData = (playerData) => {
    if (_.isEmpty(playerData.name)){
        return true;
    }

    return false;
};

class Players extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // newUserName: '',
            isAddPopupOpen: false,
            newPlayerData: null
        };

        this.addPlayer = () => {
            if(isInvalidPlayerData(this.state.newPlayerData)){
                return;
            }

            addPlayer(this.state.newPlayerData);
            this.setState({newPlayerData: {name: '', isPermanent: true}});
        };

        this.addPlayerAndClose = () => {
            if(isInvalidPlayerData(this.state.newPlayerData)){
                return;
            }

            addPlayer(this.state.newPlayerData);
            this.closeAddPopup();
        };

        this.setNewUserName = (event) => {
            const newPlayerData = _.defaults({name: event.target.value}, this.state.newPlayerData);

            this.setState({newPlayerData});
        };

        this.setNewUserIsPermanent = (event, value) => {
            const newPlayerData = _.defaults({isPermanent: value}, this.state.newPlayerData);

            this.setState({newPlayerData});
        };

        this.openAddPopup = () => {
            this.setState({isAddPopupOpen: true, newPlayerData: {name: '', isPermanent: true}});
        };

        this.closeAddPopup = () => {
            this.setState({isAddPopupOpen: false, newPlayerData: null});
        };
    }

    togglePermanent(playerData, playerId) {
        var playerDataToUpdate = _.defaults({isPermanent: !playerData.isPermanent}, playerData);

        updatePlayer(playerId, playerDataToUpdate);
    }

    render() {
        const permanentPlayers = _.pickBy(this.props.players, (player) => player.isPermanent);
        const guests = _.omitBy(this.props.players, (player) => player.isPermanent);

        const iconButtonElement = (
            <IconButton touch={true}>
                <MoreVertIcon/>
            </IconButton>
        );

        const gerRightIconMenu = (playerData, playerId) => {
            const togglePermanentButtonText = playerData.isPermanent ? 'Move to Guests' : 'Move to Permanents';
            return (
                <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={() => this.togglePermanent(playerData, playerId)}>{togglePermanentButtonText}</MenuItem>
                </IconMenu>
            );
        };

        const permanentPlayersComps = _.map(permanentPlayers, (currentPlayer, playerId) => {
            return (
                <ListItem primaryText={currentPlayer.name}
                          rightIconButton={gerRightIconMenu(currentPlayer, playerId)}
                          key={'p-player-' + playerId}/>
            );
        });

        const guestsComps = _.map(guests, (currentPlayer, playerId) => {
            return (
                <ListItem primaryText={currentPlayer.name}
                          rightIconButton={gerRightIconMenu(currentPlayer, playerId)}
                          key={'g-player-' + playerId}/>
            );
        });


        const actions = [
            <FlatButton
                label="Add"
                primary={false}
                onTouchTap={this.addPlayer}
            />,
            <FlatButton
                label="Add & close"
                primary={true}
                onTouchTap={this.addPlayerAndClose}
            />
        ];

        return (
            <div className="players-container">
                <List>
                    <Subheader>Permanents</Subheader>
                    {permanentPlayersComps}
                </List>
                <Divider />
                <List>
                    <Subheader>Guests</Subheader>
                    {guestsComps}
                </List>
                <FloatingActionButton className="add-button" onTouchTap={this.openAddPopup} >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    title="Add player"
                    actions={actions}
                    modal={false}
                    open={this.state.isAddPopupOpen}
                    contentStyle={{width: '300px'}}
                    onRequestClose={this.closeAddPopup}>
                    <TextField hintText="New player name"
                               style={{marginBottom: '20px'}}
                               value={this.state.newPlayerData && this.state.newPlayerData.name}
                               onChange={this.setNewUserName}/>
                    <Checkbox label="Permanent"
                              checked={this.state.newPlayerData &&  this.state.newPlayerData.isPermanent}
                              onCheck={this.setNewUserIsPermanent}/>
                </Dialog>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect({'players': '/players'})(Players);
export default connect(mapStateToProps)(wrappedWithFb);

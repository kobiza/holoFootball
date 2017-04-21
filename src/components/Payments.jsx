'use strict';

require('./Payments.scss');
// import 'react-select/dist/react-select.css';

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {createPaymentTransaction} from '../utils/playersDBUtils.js'

import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import Select from 'react-select';

// import AttachMoney from 'material-ui/svg-icons/editor/attach-money';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AutoComplete from 'material-ui/AutoComplete';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import fbConnect from '../hoc/fbConnect.jsx';


function mapStateToProps(state) {
    return {
        players: state.fb.players,
        payments: state.fb.payments
    };
}

const isInvalidPaymentData = (paymentData) => {
    if (_.isEmpty(paymentData.players)){
        return true;
    }

    if (!_.isFinite(paymentData.amount)){
        return true;
    }

    return false;
};

class Payments extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAddPopupOpen: false,
            newPaymentData: null
        };

        this.addPaymentAndClose = () => {
            if(isInvalidPaymentData(this.state.newPaymentData)){
                return;
            }

            _.forEach(this.state.newPaymentData.players, (player) => {
                createPaymentTransaction(player.value, this.state.newPaymentData.amount);

            });
            this.closeAddPopup();
        };

        this.openAddPopup = () => {
            this.setState({isAddPopupOpen: true, newPaymentData: {players: [], amount: ''}});
        };

        this.closeAddPopup = () => {
            this.setState({isAddPopupOpen: false, newPaymentData: null});
        };

        this.updatePlayers = (players) => {
            const newPaymentData = _.defaults({players}, this.state.newPaymentData);

            this.setState({newPaymentData});
        };

        this.updateAmount = (event) => {
            const amount = Number(event.target.value) || '';
            const newPaymentData = _.defaults({amount}, this.state.newPaymentData);

            this.setState({newPaymentData});
        };

    }

    render() {
        const sortedPayments = _.sortBy(this.props.payments, (payment) => payment.date).reverse();
        const paymentsComps = _.map(sortedPayments, (payment, payId) => {
            const date = new  Date(payment.date).toDateString();
            const playerName = this.props.players[payment.playerId] && this.props.players[payment.playerId].name;
            return (
                <ListItem key={'payment-' + payId}
                    primaryText={playerName + ': ' + payment.amount}
                    secondaryText={date} />
            );
        });
        const actions = [
            <FlatButton
                label="Add"
                primary={true}
                onTouchTap={this.addPaymentAndClose}
            />
        ];
        const playersDataSource = _.map(this.props.players, (player, playerId) => ({label: player.name, value: playerId}));

        return (
            <div className="payments-container">
                <List>
                    {paymentsComps}
                </List>
                <FloatingActionButton className="add-button" onTouchTap={this.openAddPopup} >
                    <ContentAdd />
                </FloatingActionButton>
                <Dialog
                    className="add-payment-dialog"
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
                        value={this.state.newPaymentData && this.state.newPaymentData.players}
                        placeholder="Select player(s)"
                        options={playersDataSource}
                        onChange={this.updatePlayers} />
                    <TextField
                        className="dialog-input"
                        hintText="Amount"
                        ref='amountInput'
                        inputStyle={{marginLeft: '10px'}}
                        hintStyle={{marginLeft: '10px'}}
                        value={this.state.newPaymentData && this.state.newPaymentData.amount}
                        onChange={this.updateAmount}/>
                </Dialog>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect({'players': '/players', 'payments': '/payments'})(Payments);
export default connect(mapStateToProps)(wrappedWithFb);

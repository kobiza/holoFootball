'use strict';

require('./Payments.scss');

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {createPaymentTransaction} from '../utils/playersDBUtils.js'

import FloatingActionButton from 'material-ui/FloatingActionButton';

import Select from 'react-select';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


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

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear().toString().substr(-2);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
};

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
        if (!this.props.players || !this.props.payments) {
            return (
                <div className="payments-container"></div>
            );
        }

        const showCheckboxes = false;
        const sortedPayments = _.sortBy(this.props.payments, (payment) => payment.date).reverse();
        const paymentsRows = _.map(sortedPayments, (payment, payId) => {
            const playerName = this.props.players[payment.playerId] && this.props.players[payment.playerId].name;
            return (
                <TableRow key={payId}>
                    <TableRowColumn width={55}>{formatDate(payment.date)}</TableRowColumn>
                    <TableRowColumn>{playerName}</TableRowColumn>
                    <TableRowColumn>{payment.amount}</TableRowColumn>
                </TableRow>
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
                <Table>
                    <TableHeader displaySelectAll={showCheckboxes}
                                 adjustForCheckbox={showCheckboxes}>
                        <TableRow>
                            <TableHeaderColumn width={55}>Date</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Amount</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={showCheckboxes}>
                        {paymentsRows}
                    </TableBody>
                </Table>

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

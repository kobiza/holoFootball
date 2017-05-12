'use strict';

require('./Event.scss');

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import fbConnect from '../hoc/fbConnect.jsx';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';

const mapStateToFirebase = (props) => {
    const playerId = props.match.params.id;

    return {
        'player': '/players/' + playerId,
        'transactions': '/transactions',
        'payments': '/payments',
        'events': '/events'
    };
};

const mapStateToProps = (state) => {
    return {
        player: state.fb.player,
        transactions: state.fb.transactions,
        payments: state.fb.payments,
        events: state.fb.events
    };
};

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear().toString().substr(-2);

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
};

class Player extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.events || !this.props.payments || !this.props.transactions || !this.props.player) {
            return (
                <div className="player-container"></div>
            );
        }
        const showCheckboxes = false;
        const playerId = this.props.match.params.id;

        let totalCreditPoints = 0;
        const tranFullData = _(this.props.transactions)
            .pickBy((transaction, transactionId) => transaction.playerId === playerId)
            .map((transaction, id) => {
                const date = transaction.type === 'PAYMENT' ?
                    this.props.payments[transaction.relatedEntity].date :
                    this.props.events[transaction.relatedEntity].date;
                const icon = transaction.type === 'PAYMENT' ?
                    <ArrowDropUp style={{color: '#2ecc71'}}/> :
                    <ArrowDropDown style={{color: '#e74c3c'}}/>

                return _.assign({ date, id, icon }, transaction);
            })
            .sortBy('date')
            .map((transaction) => {
                totalCreditPoints += transaction.creditPoints;

                return _.assign({ totalCreditPoints }, transaction);
            })
            .value();

        const transactionRows = _(tranFullData)
            .map((transaction) => {
                return (
                    <TableRow key={transaction.id}>
                        <TableRowColumn width={55}>{formatDate(transaction.date)}</TableRowColumn>
                        <TableRowColumn>{transaction.creditPoints}</TableRowColumn>
                        <TableRowColumn>{transaction.totalCreditPoints}</TableRowColumn>
                        <TableRowColumn width={20}>{transaction.icon}</TableRowColumn>
                    </TableRow>
                );
            })
            .reverse()
            .value();

        return (
            <div className="player-container">
                <Table>
                    <TableHeader displaySelectAll={showCheckboxes}
                                 adjustForCheckbox={showCheckboxes}>
                        <TableRow>
                            <TableHeaderColumn width={55}>Date</TableHeaderColumn>
                            <TableHeaderColumn>Amount</TableHeaderColumn>
                            <TableHeaderColumn>Balance</TableHeaderColumn>
                            <TableHeaderColumn width={20}></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={showCheckboxes}>
                        {transactionRows}
                    </TableBody>
                </Table>
            </div>
        ) ;
    }
}

const wrappedWithFb = fbConnect(mapStateToFirebase)(Player);
export default connect(mapStateToProps)(wrappedWithFb);

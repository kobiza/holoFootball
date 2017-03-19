'use strict';

import React from 'react';
import { connect } from 'react-redux';
import {fetchAttendance, registerForAttendanceChange} from '../utils/userActions.js'

import AppHeader from './AppHeader.jsx';
import AttendanceEditor from './AttendanceEditor.jsx';



const mapDispatchToProps = (dispatch) => ({
    fetchAttendance: () => dispatch(fetchAttendance()),
    registerForAttendanceChange: () => dispatch(registerForAttendanceChange())
});


class App extends React.Component {
    componentWillMount() {
        // connect to collection ->
        // willMount -> fetch.then(register)
        // willUnMount -> unregister
        this.props.fetchAttendance();
        this.props.registerForAttendanceChange();
    }

    render() {
        return (
            <div className="index">
                <AppHeader title="Holon football"/>
                <AttendanceEditor/>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(App);

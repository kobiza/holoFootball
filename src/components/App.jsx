'use strict';

import React from 'react';
import { connect } from 'react-redux';
import {fetchAppData, registerForAttendanceChange} from '../utils/userActions.js'

import AppHeader from './AppHeader.jsx';
import AttendanceEditor from './AttendanceEditor.jsx';



const mapDispatchToProps = (dispatch) => ({
    fetchAppData: () => dispatch(fetchAppData()),
    registerForAttendanceChange: () => dispatch(registerForAttendanceChange())
});


class App extends React.Component {
    componentWillMount() {
        this.props.fetchAppData();
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

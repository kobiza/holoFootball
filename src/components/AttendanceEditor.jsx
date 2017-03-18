'use strict';

import React from 'react';
import { connect } from 'react-redux';


function mapStateToProps(state) {
    return {
        eventAttendance: state.eventAttendance
    };
}

class AttendanceEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const attendance = Object.keys(this.props.eventAttendance).map(
            (key, id) => {
                var compKey = 'attendance-' + key;
                return <li key={compKey}>{key + ' - ' + this.props.eventAttendance[key]}</li>
            }
        );

        return (
            <div>
                <ul>
                    {attendance}
                </ul>
            </div>
        );
    }

}

export default connect(mapStateToProps)(AttendanceEditor);

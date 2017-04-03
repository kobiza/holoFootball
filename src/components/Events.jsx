'use strict';

require('./Events.scss');

import _ from 'lodash';
import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {createEvent} from '../utils/eventsDBUtils.js'

import fbConnect from '../hoc/fbConnect.jsx';


function mapStateToProps(state) {
    return {
        events: state.fb.events
    };
}

const dateToString = (date) => (new Date(date)).toLocaleDateString();

class Events extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newEventDate: ''
        };

        this.updateNewEventDate = (e) => {
            // new Date(e.target.value)

            this.setState({newEventDate: e.target.value});
        };

        this.createEvent = () => {
            if (_.isEmpty(this.state.newEventDate)) {
                return;
            }

            const eventDate = new Date(this.state.newEventDate);
            createEvent(eventDate);

            this.setState({newEventDate: ''});

        };
    }

    render() {
        const events = _.map(this.props.events, (currentEvent, eventId) => {
            return (
                <div className="event-row" key={'event-' + eventId}>
                    <div className="event-date">{dateToString(currentEvent.date)}</div>
                    <Link to={"/event/" + eventId}>go to event</Link>
                </div>
            );
        });

        return (
            <div className="events-container">
                <div className="add-event">
                    <input type="date" value={this.state.newEventDate} onChange={this.updateNewEventDate}/>
                    <input type="button" value="add" onClick={this.createEvent}/>
                </div>
                <div className="events-list">
                    {events}
                </div>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect({'events': '/events'})(Events);
export default connect(mapStateToProps)(wrappedWithFb);

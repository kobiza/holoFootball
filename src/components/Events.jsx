'use strict';

require('./Events.scss');

import _ from 'lodash';
import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {createEvent} from '../utils/eventsDBUtils.js'

import fbConnect from '../hoc/fbConnect.jsx';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';


function mapStateToProps(state) {
    return {
        events: state.fb.events
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

const getEventTitle = (eventDateTime, events) => {
    const excitingDates = _.map(events, (event) => formatDate(event.date));
    let newEventTitle = formatDate(eventDateTime);

    const copies = _.filter(excitingDates, (eventTitle) => eventTitle === newEventTitle).length;

    return !copies ? newEventTitle : newEventTitle + ' (' + copies + ')';
};

class Events extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAddPopupOpen: false,
            newEventData: {}
        };

        this.updateNewEventDate = (e, date) => {
            this.setState({newEventData: { date }});
        };

        this.openAddPopup = () => {
            this.setState({isAddPopupOpen: true, newEventData: {date: new Date()}});
        };

        this.closeAddPopup = () => {
            this.setState({isAddPopupOpen: false, newEventData: {}});
        };

        this.addEvent = () => {
            const eventDate = new Date(this.state.newEventData.date);
            const eventName = getEventTitle(eventDate.getTime(), this.props.events);
            createEvent(eventDate, eventName);

            this.closeAddPopup();
        };


    }

    render() {
        const notCanceledEvents = _.pickBy(this.props.events, (event) => event.status !== 'CANCELED');

        //todo - after clear data show always event.name
        const eventsRows = _.map(notCanceledEvents, (currentEvent, eventId) => {
            return (
                <ListItem
                    key={eventId}
                    primaryText={currentEvent.name || formatDate(currentEvent.date)}
                    secondaryText={currentEvent.status}
                    containerElement={<Link to={"/event/" + eventId}/>}
                />
            );
        });

        const actions = [
            <FlatButton
                label="Add"
                primary={true}
                onTouchTap={this.addEvent}
            />
        ];

        return (
            <div className="events-container">
                <List>
                    <Subheader>Events</Subheader>
                    {eventsRows}
                </List>

                <FloatingActionButton className="add-button" onTouchTap={this.openAddPopup} >
                    <ContentAdd />
                </FloatingActionButton>

                <Dialog
                    title="Add Event"
                    actions={actions}
                    modal={false}
                    open={this.state.isAddPopupOpen}
                    contentStyle={{width: '300px'}}
                    onRequestClose={this.closeAddPopup}>
                    <DatePicker
                        hintText="Event date"
                        value={this.state.newEventData.date}
                        onChange={this.updateNewEventDate}
                    />

                </Dialog>
            </div>
        );
    }

}

const wrappedWithFb = fbConnect({'events': '/events'})(Events);
export default connect(mapStateToProps)(wrappedWithFb);

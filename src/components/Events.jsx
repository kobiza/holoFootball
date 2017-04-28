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

const dateToString = (date) => (new Date(date)).toLocaleDateString();

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

        this.createEvent = () => {
            if (_.isEmpty(this.state.newEventDate)) {
                return;
            }

            const eventDate = new Date(this.state.newEventDate);
            createEvent(eventDate);

            this.setState({newEventDate: ''});

        };

        this.openAddPopup = () => {
            this.setState({isAddPopupOpen: true, newEventData: {date: new Date()}});
        };

        this.closeAddPopup = () => {
            this.setState({isAddPopupOpen: false, newEventData: {}});
        };

        this.addEvent = () => {
            const eventDate = new Date(this.state.newEventData.date);
            createEvent(eventDate);

            this.closeAddPopup();
        };
    }

    render() {

        const events = _.map(this.props.events, (currentEvent, eventId) => {
            return (
                <ListItem
                    key={eventId}
                    primaryText={dateToString(currentEvent.date)}
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
                    <Subheader>Permanents</Subheader>
                    {events}
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

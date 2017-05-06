'use strict';

require('./App.scss');

import React from 'react';
import {Provider} from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import makeStore from '../utils/makeStore.js';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Players from './Players.jsx';
import Payments from './Payments.jsx';
import Events from './Events.jsx';
import Event from './Event.jsx';
import Player from './Player.jsx';
import Home from './Home.jsx';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = makeStore();

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider>
                    <div className="app">

                        <Router>
                            <div>
                                <AppBar title="Holon football" iconClassNameRight="muidocs-icon-navigation-expand-more" iconElementLeft = {
                                    <IconMenu iconButtonElement={<IconButton><MenuIcon /></IconButton>}>
                                        {/*<MenuItem primaryText="Home" containerElement={<Link to="/" />}/>*/}
                                        <MenuItem primaryText="Players" containerElement={<Link to="/players" />}/>
                                        <MenuItem primaryText="Payments" containerElement={<Link to="/payments" />}/>
                                        <MenuItem primaryText="Events" containerElement={<Link to="/events" />}/>
                                    </IconMenu>}
                                />

                                <Paper zDepth={2} className="page-content-container">
                                    <Route exact path="/" component={Events}/>
                                    <Route path="/players" component={Players}/>
                                    <Route path="/payments" component={Payments}/>
                                    <Route path="/events" component={Events}/>
                                    <Route path="/event/:id" component={Event}/>
                                    <Route path="/player/:id" component={Player}/>
                                </Paper>
                            </div>
                        </Router>
                    </div>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;

'use strict';

import React from 'react';
import {Provider} from 'react-redux';
import makeStore from '../utils/makeStore.js';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';


import AppHeader from './AppHeader.jsx';
import Players from './Players.jsx';
import Payments from './Payments.jsx';
import Events from './Events.jsx';
import Event from './Event.jsx';
import Home from './Home.jsx';

const store = makeStore();

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <AppHeader title="Holon football"/>

                    <Router>
                        <div>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/players">Players</Link></li>
                                <li><Link to="/payments">Payments</Link></li>
                                <li><Link to="/events">Events</Link></li>
                            </ul>

                            <hr/>

                            <Route exact path="/" component={Home}/>
                            <Route path="/players" component={Players}/>
                            <Route path="/payments" component={Payments}/>
                            <Route path="/events" component={Events}/>
                            <Route path="/event/:id" component={Event}/>
                        </div>
                    </Router>
                </div>
            </Provider>
        );
    }
}

export default App;

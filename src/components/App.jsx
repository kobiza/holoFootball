'use strict';

import React from 'react';
import { connect } from 'react-redux';
import {fetchPlayers, registerForPlayersChange, registerForPlayerAdded} from '../utils/userActions.js'

import AppHeader from './AppHeader.jsx';
import PlayersEditor from './PlayersEditor.jsx';

const mapDispatchToProps = (dispatch) => ({
    fetchPlayers: () => dispatch(fetchPlayers()),
    registerForPlayersChange: () => dispatch(registerForPlayersChange()),
    registerForPlayerAdded: () => dispatch(registerForPlayerAdded())
});


class App extends React.Component {
    componentWillMount() {
        this.props.fetchPlayers();
        this.props.registerForPlayersChange();
        this.props.registerForPlayerAdded();
    }

    render() {
        return (
            <div className="index">
                <AppHeader title="Holon football"/>
                <PlayersEditor/>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(App);

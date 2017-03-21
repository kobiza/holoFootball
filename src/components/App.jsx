'use strict';

import React from 'react';
import { connect } from 'react-redux';

import AppHeader from './AppHeader.jsx';
import PlayersEditor from './PlayersEditor.jsx';

const mapDispatchToProps = (dispatch) => ({
    fetchPlayers: () => dispatch(fetchPlayers()),
    registerForPlayersChange: () => dispatch(registerForPlayersChange()),
    registerForPlayerAdded: () => dispatch(registerForPlayerAdded())
});


class App extends React.Component {
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

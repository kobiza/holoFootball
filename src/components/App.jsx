'use strict';

import React from 'react';

import AppHeader from './AppHeader.jsx';
import PlayersEditor from './PlayersEditor.jsx';

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

export default App;

'use strict';

import React from 'react';
import {render} from 'react-dom';
import {initDB} from './utils/DAL.js';

import App from './components/App.jsx';

class AppWrapper extends React.Component {
    render() {
        return (
            <App/>
        );
    }
}

var fbConfig = {
    apiKey: "AIzaSyC4xry1JzyQ_oK3lzMxi-bPzsqFa5LNloo",
    authDomain: "holon-football.firebaseapp.com",
    databaseURL: "https://holon-football.firebaseio.com",
    storageBucket: "holon-football.appspot.com",
    messagingSenderId: "933361392717"
};


initDB(fbConfig);

render(<AppWrapper/>, document.getElementById('app'));

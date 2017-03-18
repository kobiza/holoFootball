'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {initDB} from './utils/DAL.js';
import makeStore from './utils/makeStore.js';

import App from './components/App.jsx';

const store = makeStore();

class AppWrapper extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
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

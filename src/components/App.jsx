'use strict';

import React from 'react';

import AppHeader from './AppHeader.jsx';
import AttendanceEditor from './AttendanceEditor.jsx';

const App = () => (
    <div className="index">
        <AppHeader title="Holon football"/>
        <AttendanceEditor/>
    </div>
);

export default App;

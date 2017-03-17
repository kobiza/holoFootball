import React from 'react';
import {render} from 'react-dom';
import AttendanceEditor from './AttendanceEditor.jsx';
import AppHeader from './AppHeader.jsx';

class App extends React.Component {
    render() {
        return (
            <div className="index">
                <AppHeader title="Holon football"/>
                <AttendanceEditor/>
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));

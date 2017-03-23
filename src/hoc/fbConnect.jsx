'use strict';

import _ from 'lodash';
import React from 'react';
import {fetchData, registerToChildChanged, registerToChildAdded, registerToChildRemoved} from '../utils/userActions.js';
import {fbCollectionReceived, fbChildChanged, fbChildAdded, fbChildRemove} from '../actions/actionCreators'


const fbConnect = (path, stateKey) => {
    const connector = (Component) => {
        class ContainerComponent extends React.Component {
            constructor(props) {
                super(props);
            }

            componentWillMount() {
                const { store } = this.context;

                registerToChildChanged(path, _.partial(fbChildChanged, stateKey))(store.dispatch);
                registerToChildAdded(path, _.partial(fbChildAdded, stateKey))(store.dispatch);
                registerToChildRemoved(path, _.partial(fbChildRemove, stateKey))(store.dispatch);
                fetchData(path, _.partial(fbCollectionReceived, stateKey))(store.dispatch);

            }

            //unregister on umnount
            // componentWillUnmount() {
            // }

            render() {
                return <Component {...this.props}/>;
            }
        };

        ContainerComponent.contextTypes = {
            store: React.PropTypes.object
        };

        return ContainerComponent;
    };

    return connector;
};

export default fbConnect;

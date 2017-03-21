'use strict';

import _ from 'lodash';
import React from 'react';
import {fetchData, registerToChildChanged, registerToChildAdded} from '../utils/userActions.js';
import {fbCollectionReceived, fbChildChanged, fbChildAdded} from '../actions/actionCreators'


const fbConnect = (path, stateKey) => {
    const connector = (Component) => {
        class ContainerComponent extends React.Component {
            constructor(props) {
                super(props);
            }

            componentWillMount() {
                const { store } = this.context;

                fetchData(path, _.partial(fbCollectionReceived, stateKey))(store.dispatch).then(() => {
                    registerToChildChanged(path, _.partial(fbChildChanged, stateKey))(store.dispatch);
                    registerToChildAdded(path, _.partial(fbChildAdded, stateKey))(store.dispatch);
                });

            }

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

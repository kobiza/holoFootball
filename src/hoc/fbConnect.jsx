'use strict';

import _ from 'lodash';
import React from 'react';
import {fetchData, registerToChildChanged, registerToChildAdded, registerToChildRemoved} from '../utils/generalDBUtils.js';
import {fbCollectionReceived, fbChildChanged, fbChildAdded, fbChildRemove, fbClearCollection} from '../actions/actionCreators'


let connections = {};
let disconnect = {};
let listeners = {};

const validateNewConnection = (path, stateKey) => {
    if (_.has(connections, stateKey) && connections[stateKey] !== path){
        throw 'state already connected to other data';
    }
};

const addNewConnection = (path, stateKey) => {
    listeners[stateKey] = listeners[stateKey] || 0;
    listeners[stateKey]++;

    if (_.has(connections, stateKey)){
        return false;
    }

    connections[stateKey] = path;
    return true;
};

const removeConnection = (path, stateKey) => {
    listeners[stateKey]--;

    if (listeners[stateKey] === 0){
        delete connections[stateKey];
        delete listeners[stateKey];
        return true;
    }

    return false;
};

const fbConnect = (mapStateToFirebase) => {
    const connector = (Component) => {
        class ContainerComponent extends React.Component {
            constructor(props) {
                super(props);

                this.updateMapStateToFirebase = () => {
                    this.mapStateToFirebase = _.isFunction(mapStateToFirebase) ?
                        mapStateToFirebase(this.props) :
                        mapStateToFirebase;
                }
            }

            componentWillMount() {
                const { store } = this.context;
                this.updateMapStateToFirebase();

                const connectFirebaseToState = (path, stateKey) => {
                    validateNewConnection(path, stateKey);
                    var isFirstConnection = addNewConnection(path, stateKey);

                    if (isFirstConnection){
                        const unsubscribeChildChanged = registerToChildChanged(path, _.partial(fbChildChanged, stateKey))(store.dispatch);
                        const unsubscribeChildAdded = registerToChildAdded(path, _.partial(fbChildAdded, stateKey))(store.dispatch);
                        const unsubscribeChildRemoved = registerToChildRemoved(path, _.partial(fbChildRemove, stateKey))(store.dispatch);
                        fetchData(path, _.partial(fbCollectionReceived, stateKey))(store.dispatch);

                        disconnect[stateKey] = () => {
                            unsubscribeChildChanged();
                            unsubscribeChildAdded();
                            unsubscribeChildRemoved();
                            store.dispatch(fbClearCollection(stateKey));
                        };
                    }
                };

                _.forEach(this.mapStateToFirebase, connectFirebaseToState);
            }

            componentWillUnmount() {
                const disconnectFirebaseToState = (path, stateKey) => {
                    const isLastConnection = removeConnection(path, stateKey);

                    if (isLastConnection){
                        disconnect[stateKey]();
                    }
                };

                _.forEach(this.mapStateToFirebase, disconnectFirebaseToState);
            }

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

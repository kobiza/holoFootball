import firebase from 'firebase';
import { Promise } from 'bluebird';

export const initDB = config => {
    firebase.initializeApp(config);
};

export const setIn = (path, data) => new Promise((resolve, reject) => {
    firebase.database().ref(path).set(data)
        .then(resolve)
        .catch(reject);
});

export const read = path => new Promise((resolve, reject) => {
    firebase.database().ref(path).once('value')
        .then(snapshot => resolve(snapshot.val()))
        .catch(reject);
});

export const onChildChanged = (path, callback) => {
    firebase.database().ref(path).on('child_changed', function(childSnapshot, prevChildKey) {
        callback(childSnapshot, prevChildKey);
    });
};

export const onChildAdded = (path, callback) => {
    firebase.database().ref(path).on('child_added', function(childSnapshot, prevChildKey) {
        callback(childSnapshot, prevChildKey);
    });
};

export const onChildRemoved = (path, callback) => {
    firebase.database().ref(path).on('child_removed', function(childSnapshot, prevChildKey) {
        callback(childSnapshot, prevChildKey);
    });
};

//add offChildChanged

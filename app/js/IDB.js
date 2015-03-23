"use strict";

import Testable from './Testable';

const DBNAME = 'idb-test',
    OBJECTSTORENAME = 'customers',
    VERSION = 13;

export default class IDB extends Testable {
    constructor(options = {
        dbname: 'idb-test',
        store: 'customers'
    }) {
        this.dbname = options.dbname;
        this.store = options.store;
        this.idb = getIndexedDBObject('indexedDB');
    }

    destroy() {

    }

    setup(cb) {
        this.dbconn = this.idb.open(DBNAME, VERSION);
        this.dbconn.onerror = function (event) {
            //window.test.log.error('Could not setup an IndexedDB database (' + dbconn.errorCode + ')') ;
            throw 'Could not open the db';
        };

        this.dbconn.onsuccess = function (event) {
            // cleanup
            let db = event.target.result;
            try {
                let transaction = getTransaction('readwrite');

                if (transaction) {
                    if (transaction.db.objectStoreNames.contains(OBJECTSTORENAME)) {
                        let objectStore = transaction.objectStore(OBJECTSTORENAME);
                        let objectStoreRequest = objectStore.clear();
                        objectStoreRequest.onsuccess = (event) => {
                            // TODO: call callback
                        };

                        objectStoreRequest.onerror = (event) => {
                            throw 'Ooops, something went wrond during cleanup';
                        };
                    } else {
                        throw 'Not sure what todo here!!'
                        //window.test.log.error('Could not access the object store (Error: ' + e.message + ')');
                    }

                    transaction.oncomplete = function (e) {
                        //window.test.log.info('Records inserted');
                    };
                    transaction.onerror = function (e) {
                        //window.test.log.error('Could not access the object store (Error: ' + e.message + ')');
                        throw 'Ooops, could not insert records';
                    };
                    transaction.onabort = function (e) {
                        //window.test.log.error('Aborted transaction');
                        throw 'Ooops, insert aborted';
                    };
                } else {
                    throw 'Something went wrong while';
                }
            } catch (e) {
                //window.test.log.error('Could not access the object store (Error: ' + e.message + ')');
                throw 'Not sure what went wrong: ' + e.message;
            }

            this.dbconn.onupgradeneeded = function (event) {
                // Update object stores and indices
                console.info('onupgradeneeded');

                var db = event.target.result;

                while (db.objectStoreNames.length) {
                    console.info('delete object store: ' + db.objectStoreNames[0]);
                    db.deleteObjectStore(db.objectStoreNames[0]);
                }

                var objectStore = db.createObjectStore(OBJECTSTORENAME, {
                    keyPath: "ssn"
                });
                objectStore.createIndex("name", "name", {
                    unique: false
                });
                objectStore.createIndex("email", "email", {
                    unique: true
                });
            };
        }
    }
}


function getIndexedDBObject(name) {
    var upper = name[0].toUpperCase() + name.slice(1);

    return window[name] || window['webkit' + upper] || window['moz' + upper] || window['ms' + upper];
}

function getTransaction(dbconn, mode) {
    try {
        return dbconn.result.transaction([OBJECTSTORENAME], mode);
    } catch (e) {
        //window.test.log.error('Could not create a transaction (Error: ' + e.message + ')');
        throw 'Something went worng';
        return null;
    }
}

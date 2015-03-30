"use strict";

import Testable from './Testable';

const DBNAME = 'idb-test',
    OBJECTSTORENAME = 'customers',
    VERSION = 22;

let dbconn;

export default
class IDB extends Testable {
    constructor(options = {
        dbname: 'idb-test',
        store: 'customers'
    }) {
        this.dbname = options.dbname;
        this.store = options.store;
        this.idb = getIndexedDBObject('indexedDB');
    }

    static isAvailable() {
        return !!getIndexedDBObject('indexedDB');
    }

    static get instance() {
        return new IDB();
    }

    connect(onsuccess, onerror, onupgradeneeded) {
        dbconn = this.idb.open(DBNAME, VERSION);

        dbconn.onsuccess = onsuccess;

        if (onerror) {
            dbconn.onerror = onerror;
        }

        if (onupgradeneeded) {
            dbconn.onupgradeneeded = onupgradeneeded;
        }
    }

    clear(cb) {
        let transaction = getTransaction('readwrite', cb);

        if (transaction) {
            if (transaction.db.objectStoreNames.contains(OBJECTSTORENAME)) {
                let objectStore = transaction.objectStore(OBJECTSTORENAME);
                let objectStoreRequest = objectStore.clear();
                //objectStoreRequest.onsuccess = () => { /* cb is called in transaction.oncomplete */ };

                objectStoreRequest.onerror = (e) => {
                    cb({status: 'fatal', msg: `Could not clear the object store (${e.message})`});
                };
            }

            transaction.oncomplete = function (e) {
                cb(); // continue!
            };
            transaction.onerror = function (e) {
                cb({status: 'fatal', msg: `Could not access object store (${e.message})`});
            };
            transaction.onabort = function (e) {
                cb({status: 'fatal', msg: `Transaction aborted (${e.message})`});
            };

        }
    }


    setup(data, cb) {
        let status = [];

        if (!dbconn) {
            this.connect(
                () => {          // onsuccess
                    cb(status);
                },
                (event) => {    // onerror
                    status.push({fatal: `Could not open the db: ${event.message}, ${dbconn.errorCode}`});
                    cb(status);
                }, (event) => { // onupgradeneeded
                    // Update object stores and indices
                    status.push({info: 'Upgrade needed (onupgradeneeded)'});

                    let db = event.target.result;

                    while (db.objectStoreNames.length) {
                        db.deleteObjectStore(db.objectStoreNames[0]);
                    }

                    let objectStore = db.createObjectStore(OBJECTSTORENAME, {
                        keyPath: "ssn"
                    });
                    objectStore.createIndex("name", "name", {
                        unique: false
                    });
                    objectStore.createIndex("email", "email", {
                        unique: true
                    });
                }
            );
        } else {
           cb();
        }
    }

    /* the last two parameters are ment for internal use only
     clear: if true -> call clear first
     failedMsg: hold a message if clearing failed
     */
    insert(data, cb, clear = true, failedMsg) {
        if (failedMsg) {
            cb(failedMsg);
        }
        else if (dbconn) {
            if (!clear) {
                let transaction = getTransaction('readwrite', cb);

                if (transaction) {
                    transaction.oncomplete = function (e) {
                        cb();
                    };
                    transaction.onerror = function (e) {
                        cb({status: 'fatal', msg: `Could not access object store (${e.message})`});
                    };
                    transaction.onabort = function (e) {
                        cb({status: 'fatal', msg: `Transaction aborted (${e.message})`});
                    };

                    let objectStore = transaction.objectStore('customers');
                    data.records.forEach((record) => {
                        objectStore.put(record);
                    });
                }
            } else {
                this.clear(this.insert.bind(this, data, cb, false));
            }
        } else { // connect first and run test again
            this.connect(this.insert.bind(this, data, cb));
        }
    }

    singleByPK(data, cb) {
        if (dbconn) {
            let transaction = getTransaction('readonly', cb);

            if (transaction) {
                let objectStore = transaction.objectStore(OBJECTSTORENAME);
                let objectStoreRequest = objectStore.get(data.single.pk.ssn);

                objectStoreRequest.onsuccess = function (e) {
                    if (objectStoreRequest.result) {
                        cb();
                    }
                    else {
                        cb({status: 'error', msg: 'Could not find record'});
                    }
                };
                objectStoreRequest.onerror = function (e) {
                    cb({status: 'error', msg: `Error during record lookup by PK ${e.message}`});
                }
            }
        } else { // connect first and run test again
            this.connect(this.singleByPK.bind(this, data, cb));
        }
    }

    singleByUI(data, cb) {
        let transaction = getTransaction('readonly', cb);

        if (transaction) {
            let objectStore = transaction.objectStore(OBJECTSTORENAME);

            let index = objectStore.index('email');
            index.get(data.single.ui.email).onsuccess = function (event) {
                let record = event.target.result;
                if (record.ssn === data.single.ui.ssn) {
                    cb();
                }
                else {
                    cb({state: 'error', msg: 'Wrong record found'})
                }
            };
        }
    }

    multiByPK(data, cb) {
        let transaction = getTransaction('readonly', cb);

        if (transaction) {
            let objectStore = transaction.objectStore(OBJECTSTORENAME);

            let boundKeyRange = getIndexedDBObject('IDBKeyRange').bound(data.multi.pk[0].ssn, data.multi.pk[1].ssn, false, false);

            let count = 0;
            objectStore.openCursor(boundKeyRange).onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    count++;
                    let email = cursor.value.email; // make sure the value is not lazy loaded
                    if (email) {
                        cursor.continue();
                    } else {
                        cb({status: 'error', msg: 'Found weird record without `email`'});
                    }

                }
                else { // ready
                    if (count === data.multi.numberOfMatches) {
                        cb();
                    } else {
                        cb({status: 'error', msg: `Found ${count} matching records`});
                    }
                }
            };
        }
    }

    multiByUI(data, cb) {
        this.multiByI(data, cb, 'ui', 'email');
    }

    multiByI(data, cb, indexName = 'i', columnName = 'name') {
        let transaction = getTransaction('readonly', cb);

        if (transaction) {

            var objectStore = transaction.objectStore(OBJECTSTORENAME);

            var index = objectStore.index(columnName);
            var boundKeyRange = getIndexedDBObject('IDBKeyRange').bound(
                data.multi[indexName][0][columnName],
                data.multi[indexName][1][columnName], false, false);

            var count = 0;
            index.openCursor(boundKeyRange).onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    let ssn = cursor.value.ssn;
                    count++;
                    if (ssn) {
                        cursor.continue();
                    } else {
                        cb({status: 'error', msg: 'Found weird record without `ssn`'});
                    }
                }
                else { // ready
                    if (count === data.multi.numberOfMatches) {
                        cb();
                    } else {
                        cb({status: 'error', msg: `Found ${count} matching records`});
                    }
                }
            };
        }
    }
}


function getIndexedDBObject(name) {
    var upper = name[0].toUpperCase() + name.slice(1);

    return window[name] || window['webkit' + upper] || window['moz' + upper] || window['ms' + upper];
}

function getTransaction(mode, cb) {
    try {
        return dbconn.result.transaction([OBJECTSTORENAME], mode);
    } catch (e) {
        cb({status: 'fatal', msg: `Could not create a transaction: ${transaction}`});
        return null;
    }
}

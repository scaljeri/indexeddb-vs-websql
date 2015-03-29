"use strict";

import Testable from './Testable';

var DBNAME = 'wsql-test', TABLENAME = 'customers', VERSION = 1;
let dbconn;

export default
class WebSql extends Testable {
    constructor(options = {dbname: 'idb-test', store: 'customers'}) {
        this.dbname = options.dbname;
        this.store = options.store;
    }

    static isAvailable() {
        return !!window.openDatabase;
    }

    connect() {
        dbconn = openDatabase(DBNAME, VERSION, 'performance test database', 10 * 1024 * 1024); // 10MB in size
    }

    setup(data, cb) {
        if (!dbconn) {
            this.connect();
        }

        // create database
        dbconn.transaction((tx) => {
            tx.executeSql(`DROP TABLE IF EXISTS ${TABLENAME}`);
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${TABLENAME} (ssn TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT, age INTEGER, UNIQUE(email))`);
            tx.executeSql(`CREATE INDEX email_idx ON ${TABLENAME} (email)`);
        }, (err) => {
            cb([{fatal: `'Could not create table: ${err.message})`}]);
        }, cb);
    }

    insert(data, cb) {
        if (!dbconn) {
            this.connect();
        }

        dbconn.transaction((tx) => {
            tx.executeSql(`DELETE FROM ${TABLENAME}`);

            data.records.forEach((record) => {
                tx.executeSql(`INSERT INTO ${TABLENAME} (ssn, email, name, age) VALUES(?,?,?,?)`,
                    [record['ssn'],
                        record['email'],
                        record['name'],
                        record['age']
                    ]
                );
            });
        }, (err) => {
            cb([{fatal: `'Could not insert records: ${err.message})`}]);
        }, cb);
    }

    singleByPK(data, cb) {
        if (!dbconn) {
            this.connect();
        }

        dbconn.transaction(function (tx) {
            var sql = `SELECT * FROM ${TABLENAME} WHERE ssn="${data.single.pk.ssn}"`;

            tx.executeSql(sql, [], (tx, results) => {
                if (results.rows.length === 1 &&
                    results.rows.item(0).email === data.single.pk.email) {
                    cb();
                } else {
                    cb([{error: results.rows.length === 0 ? 'No record found' : 'Multiple records found'}]);
                }
            }, (t, err) => {
                cb([{fatal: `Could not run query: ${err.message}`}]);
            });
        });
    }
}

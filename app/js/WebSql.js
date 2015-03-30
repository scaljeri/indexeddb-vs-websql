"use strict";

import Testable from './Testable';

var DBNAME = 'wsql-test', TABLENAME = 'customers', VERSION = 1;
let dbconn;
let dbMapper = {
   MySQL: {
       TEXT: 'VARCHAR(30)'
   }
}

export default
class WebSql extends Testable {
    constructor(options = {dbname: 'idb-test', store: 'customers'}) {
        this.dbname = options.dbname;
        this.store = options.store;
    }

    static isAvailable() {
        return !!window.openDatabase;
    }

    static getCreateTableSql(db = 'sqlite') {
        let text = db === 'sqlite' ? 'TEXT' : 'VARCHAR(30)';

        // TODO: Check index usage if tests are implemented
        let output = [`DROP TABLE IF EXISTS ${TABLENAME};`,
            `DROP INDEX IF EXISTS email_idx;`,
            `CREATE TABLE IF NOT EXISTS ${TABLENAME} (ssn ${text} PRIMARY KEY, email TEXT NOT NULL, name ${text}, age REAL);`]; //, UNIQUE(email));`];
            //`CREATE UNIQUE INDEX email_idx ON ${TABLENAME} (email);\n`];

        output
        return output;
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
            WebSql.getCreateTableSql().forEach((statement) => {
                tx.executeSql(statement);
            });
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
                console.log("INSER " + record.age);
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
        this.singleByUI(data, cb, 'pk', 'ssn', 'email');
    }

    singleByUI(data, cb, stype = "ui", searchKey = 'email', validationKey = 'ssn') {
        if (!dbconn) {
            this.connect();
        }

        dbconn.transaction(function (tx) {
            var sql = `SELECT * FROM ${TABLENAME} WHERE ${searchKey}="${data.single[stype][searchKey]}"`;

            tx.executeSql(sql, [], (tx, results) => {
                if (results.rows.length === 1 &&
                    results.rows.item(0)[validationKey] === data.single[stype][validationKey]) {
                    cb();
                } else {
                    cb([{error: results.rows.length === 0 ? 'No record found' : 'Multiple records found'}]);
                }
            }, (t, err) => {
                cb([{fatal: `Could not run query: ${err.message}`}]);
            });
        });
    }

    multiByPK(data, cb) {
        this.multiByUI(data, cb, 'pk', 'ssn');
        /*
        if (!dbconn) {
            this.connect();
        }

        dbconn.transaction(function (tx) {
            var sql = `SELECT * FROM ${TABLENAME} WHERE ssn >= "${data.multi.pk[0].ssn}" AND ssn <= "${data.multi.pk[1].ssn}"`;

            tx.executeSql(sql, [], (tx, results) => {
                if (results.rows.length === data.multi.numberOfMatches) {
                    cb();
                } else {
                    cb([{error: `Found ${results.rows.length} records instead of ${data.multi.numberOfMatches}`}]);
                }
            }, (t, err) => {
                cb([{fatal: `Could not run query: ${err.message}`}]);
            });
        });
        */
    }

    multiByUI(data, cb, stype = 'ui', searchKey = 'email') {
        if (!dbconn) {
            this.connect();
        }

        dbconn.transaction(function (tx) {
            var sql = `SELECT * FROM ${TABLENAME} WHERE ${searchKey} >= "${data.multi[stype][0][searchKey]}" AND ${searchKey} <= "${data.multi[stype][1][searchKey]}"`;

            tx.executeSql(sql, [], (tx, results) => {
                if (results.rows.length === data.multi.numberOfMatches) {
                    cb();
                } else {
                    debugger;
                    cb([{error: `Found ${results.rows.length} records instead of ${data.multi.numberOfMatches}`}]);
                }
            }, (t, err) => {
                cb([{fatal: `Could not run query: ${err.message}`}]);
            });
        });
    }

    multiByI(data, cb) {
        this.multiByUI(data, cb, 'i', 'name');
    }

    multiByNoI(data, cb) {
        if (!dbconn) {
            this.connect();
        }

        dbconn.transaction(function (tx) {
            var sql = `SELECT * FROM ${TABLENAME} WHERE age = ${data.multi.noi[0].age} OR age = ${data.multi.noi[1].age}`;

            tx.executeSql(sql, [], (tx, results) => {
                if (results.rows.length === data.multi.numberOfMatches) {
                    cb();
                } else {
                    cb([{error: `Found ${results.rows.length} records instead of ${data.multi.numberOfMatches}`}]);
                }
            }, (t, err) => {
                cb([{fatal: `Could not run query: ${err.message}`}]);
            });
        });
    }
}

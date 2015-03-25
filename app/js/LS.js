"use strict";

import Testable from './Testable';

export default class LS extends Testable {
    constructor() {}

    static isAvailable() {
        return typeof(Storage) !== void(0);
    }

    setup(cb) {
        localStorage.clear();
        cb();
    }

    insert(records, cb) {
       try {
           records.forEach((record) => {
               localStorage.setItem(record.ssn, JSON.stringify(record)) ;
           });
           cb();
       } catch (e) {
            cb({status: 'error', msg: e.message});
       }
    }

    selectByPK(key, cb) {
        let record = localStorage.getItem(key) ;
        cb(record);
    }
}

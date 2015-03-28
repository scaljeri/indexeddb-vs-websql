"use strict";

import Testable from './Testable';

export default class LS extends Testable {
    constructor() {}

    static isAvailable() {
        return typeof(Storage) !== void(0);
    }

    setup(data, cb) {
        localStorage.clear();
        cb();
    }

    insert(data, cb) {
       try {
           data.records.forEach((record) => {
               localStorage.setItem(record.ssn, JSON.stringify(record)) ;
           });
           cb();
       } catch (e) {
            cb({status: 'error', msg: e.message});
       }
    }

    singleByPK(data, cb) {
        let record = localStorage.getItem(data.single.pk) ;
        if (record) {
            cb();
        } else {
            cb({status: 'error', msg: 'No record found'});

        }
    }
}

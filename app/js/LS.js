"use strict";

import Testable from './Testable';

export default class LS extends Testable {
    constructor() {}

    static isAvailable() {
        return typeof(Storage) !== void(0);
    }

    static get instance() {
        return new LS();
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
        let record = localStorage.getItem(data.single.pk.ssn) ;
        if (record) {
            record = JSON.parse(record);
            if (record.email === data.single.pk.email) {
                cb();
            } else {
                cb();
            }
        } else {
            cb({status: 'error', msg: 'No record found'});

        }
    }
}

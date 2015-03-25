"use strict";

import Testable from './Testable';

export default class LS extends Testable {
    constructor(options = {dbname: 'idb-test', store: 'customers'}) {
        super(options);

        this.dbname = options.dbname;
        this.store = options.store;
    }

    static isAvailable() {
        return typeof(Storage) !== void(0);
    }

    setup() {
    }
}

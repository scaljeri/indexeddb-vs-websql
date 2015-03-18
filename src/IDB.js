"use strict";

import Testable from './Testable';

const VERSION = '1.2';

export default class IDB extends Testable {
  constructor(options={dbname: 'idb-test', store: 'customers'}) {
      this.dbname = options.dbname;
      this.store = options.store;
  }

  setup() {}
}

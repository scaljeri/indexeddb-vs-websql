"use strict";

import Testable from './Testable';

export default class WebSql extends Testable {
  constructor(options={dbname: 'idb-test', store: 'customers'}) {
      this.dbname = options.dbname;
      this.store = options.store;
  }

  setup() {}
}

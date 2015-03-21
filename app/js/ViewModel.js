let singleton = Symbol();
let singletonEnforcer = Symbol()
let storageTests = ['setup', 'insert', 'singleByPK', 'singleByUI', 'multiByPK', 'multiByUI', 'multiByI', 'multiByNoI'];

class ViewModel {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.results = {};
        this.logHistory = ko.observableArray();
        this.config = {
            records: ko.observable(1000),
            seed: ko.observable(2345678901),
            multiple: ko.observable(10)
        };
        this.storage = {
            ls: {
                checked: ko.observable(true),
                tests: {}
            },
            indexedDB: {
                checked: ko.observable(true),
                tests: {}
            },
            webSql: {
                checked: ko.observable(true),
                tests: {}
            }
        };

        storageTests.forEach((name) => {
             this.storage.ls.tests[name] = ko.observable('passed');
             this.storage.indexedDB.tests[name] = ko.observable('failed');
             this.storage.webSql.tests[name] = ko.observable('progress');
        });
        this.tests = {
            dbType: ko.observable(true),
            setup: ko.observable(true),
            insert: ko.observable(true),

            primaryKey: ko.observable(true),
            uniqueIndex: ko.observable(true),

            multiPrimaryKey: ko.observable(true),
            multiUniqueIndex: ko.observable(true),
            multiIndex: ko.observable(true),
            multiNoIndex: ko.observable(true),
        };
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ViewModel(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default ViewModel

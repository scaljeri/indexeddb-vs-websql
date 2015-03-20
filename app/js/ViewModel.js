let singleton = Symbol();
let singletonEnforcer = Symbol()

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

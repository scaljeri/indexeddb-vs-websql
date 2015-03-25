let singleton = Symbol();
let singletonEnforcer = Symbol()

class ViewModel {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.tests = [
            {
                id: 'setup',
                name: 'Setup',
                enabled: true
            },
            {
                id: 'insert',
                name: 'Insert',
                enabled: true
            },
            {
                id: 'singleByPK',
                name: 'PK',
                enabled: true
            },
            {
                id: 'singleByUI',
                name: 'UI',
                enabled: true
            },
            {
                id: 'multiByPK',
                name: 'PK',
                enabled: true
            },
            {
                id: 'multiByUI',
                name: 'UI',
                enabled: true
            },
            {
                id: 'multiByI',
                name: 'I',
                enabled: true
            },
            {
                id: 'multiByNoI',
                name: 'No Index',
                enabled: true
            }
        ];

        this.engines = ko.observableArray([
            {
                name: 'LocalStorage',
                checked: ko.observable(true),
                disabled: ko.observable(true), // TRUE if storage engine is not supported by the browser
                id: 'ls',
                tests: []//ko.observableArray([])
            },
            {
                name: 'IndexedDB',
                checked: ko.observable(true),
                disabled: ko.observable(true),
                id: 'indexeddb',
                tests: []//ko.observableArray([])
            },
            {
                name: 'WebSQL',
                checked: ko.observable(true),
                disabled: ko.observable(true),
                id: 'websql',
                tests: []//ko.observableArray([])
            }
        ]);

        this.engines().forEach((engine) => {
            for(let i = 0; i < this.tests.length; i++) {
                  engine.tests.push({
                    state: null,
                    duration: null
                  });
             }
        });

        this.results = {}; // TODO ????
        this.logHistory = ko.observableArray();
        this.config = {
            records: ko.observable(1000),
            seed: ko.observable(2345678901),
            multiple: ko.observable(10)
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

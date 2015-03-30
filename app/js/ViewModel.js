import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

let singleton = Symbol();
let singletonEnforcer = Symbol()

class ViewModel {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.tests = [
            {
                id: 'setup',
                name: 'Setup',
                enabled: true,
                single: true
            },
            {
                id: 'insert',
                name: 'Insert',
                enabled: true,
                single: true
            },
            {
                id: 'singleByPK',
                name: 'PK',
                enabled: true,
                single: true
            },
            {
                id: 'singleByUI',
                name: 'UI',
                enabled: true,
                single: true
            },
            {
                id: 'multiByPK',
                name: 'PK',
                single: false,
                enabled: true
            },
            {
                id: 'multiByUI',
                name: 'UI',
                single: false,
                enabled: true
            },
            {
                id: 'multiByI',
                name: 'I',
                single: false,
                enabled: true
            },
            {
                id: 'multiByNoI',
                name: 'No Index',
                single: false,
                enabled: true
            }
        ];

        this.engines = ko.observableArray([
            {
                name: 'LocalStorage',
                checked: ko.observable(true),
                disabled: ko.observable(true), // TRUE if storage engine is not supported by the browser
                id: 'ls',
                tests: [],//ko.observableArray([])
                classRef: LS
            },
            {
                name: 'IndexedDB',
                checked: ko.observable(true),
                disabled: ko.observable(true),
                id: 'indexeddb',
                tests: [],//ko.observableArray([])
                classRef: IDB
            },
            {
                name: 'WebSQL',
                checked: ko.observable(true),
                disabled: ko.observable(true),
                id: 'websql',
                tests: [],//ko.observableArray([])
                classRef: WebSql
            }
        ]);

        this.engines().forEach((engine) => {
            for(let i = 0; i < this.tests.length; i++) {
                engine.tests.push({
                    state: ko.observable(),
                    duration: ko.observable()
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

    clearTestData() {
        "use strict";

        this.engines().forEach((engine) => {
            for(let i = 0; i < this.tests.length; i++) {
                engine.tests[i].state(null);
                engine.tests[i].duration(null);
            }
        });
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ViewModel(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default ViewModel

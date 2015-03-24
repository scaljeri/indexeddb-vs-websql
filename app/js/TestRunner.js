import ViewModel from './ViewModel';
import Generator from './Generator';
import Benchmark from './Benchmark';
import Log from './Log';
import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

let callable = Function.bind.bind(Function.call);

let singleton = Symbol();
let singletonEnforcer = Symbol();
let testData = null;

/*
this.idb = new IDB();
new Benchmark().start(callable(IDB.prototype.setup, this.idb, {
    x: 10
}), (duration) => {
    console.log('duration=' + duration);
    Log.instance.info(10, 'hello');
});
*/

function validateStorage(dataSize) {
    "use strict";

    let vm = ViewModel.instance;

    if (vm.storage[0].enabled() && !LS.isAvailable()) {
        Log.error(null, 'This browser does not support LocalStorage');
        vm.storage[0].enabled(false);
    }
    else if (dataSize > 5) {
        Log.warn(null, 'The amount of data might be to for LocalStorage!!');
    }

    if (vm.storage[1].enabled() && !IDB.isAvailable()) {
        Log.error(null, 'This browser does not support IndexedDB');
        vm.storage[1].enabled(false);
    }

    if (vm.storage[2].enabled() && !WebSql.isAvailable()) {
        Log.error(null, 'This browser does not support WebSQL');
        vm.storage[2].enabled(false);
    }

    if (!vm.storage[0].enabled() && !vm.storage[1].enabled() && !vm.storage[2].enabled() ) {
        Log.warn(null, 'Ooops, no engine is checked!!!');
        return false;
    }

}

class TestRunner {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.tests = ViewModel.instance.tests;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new TestRunner(singletonEnforcer);
        }
        return this[singleton];
    }

    get data() {
        let settings = ViewModel.instance.config;

        if (!testData || this.seed !== settings.seed() || this.records !== parseInt(settings.records())) {
            this.seed = settings.seed();
            this.records = parseInt(settings.records());

            let bm = new Benchmark().start();
            testData = Generator.create(settings.records(), settings.seed(), settings.multiple());

            let size = this.dataSize = (sizeof(testData.records[0]) * testData.records.length) / 1024 / 1024,
                units = 'MB';

            if (size < 1000) {
                size *= 1024;
                units = 'KB';
            }
            Log.info(bm.end(), `Created ${this.records} records (${Math.round(size) + units})`);
        }

        return testData;
    }

    run() {
        let storage = {
            indexeddb: new IDB(),
            websql: new WebSql(),
            ls: new LS()
            };
        let vm = ViewModel.instance;
        let tests = vm.tests;
        let data = this.data;
        let bm = new Benchmark().start();

        if (validateStorage(this.dataSize)) {
            // TODO: continue
        }

        /*
        tests.forEach((test) => {
            if (this[test.id]) {
                if (this[test.id].enabled) {
                    ;//Benchmark

                }
            } else {
                throw 'Test "' + test.name + '" not implemented';
            }
        }); */

        //let data = Generator.instance.
        console.log('TEST GO');
    }

    setup() {
        alert('x');
    }

}

export default TestRunner

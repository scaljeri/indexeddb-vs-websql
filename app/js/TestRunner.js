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

function setup(engine, data, log, cb) {
    "use strict";

    let benchmark = new Benchmark().start();
    engine.setup((output) => {
        if (output) {
            // TODO
            throw 'TODO'
        }
        else {
            log.info('Setup done', benchmark.end());
            insert(engine, data, log, cb);
        }
    })
}

function insert(engine, data, log, cb) {
    "use strict";

    let benchmark = new Benchmark().start();
    debugger;
    log.busy('Inserting records');
    engine.insert(data.records, (output) => {
        if (output) {
            if (output.status === 'error') {
                log.error(`Insert - ${output.msg}`, benchmark.end());
                cb(false);
            }
        }
        else {
            log.info('Inserted all records', benchmark.end());
            cb(true);
        }
    })


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

    getData(cb) {
        let settings = ViewModel.instance.config;

        if (!testData || this.seed !== settings.seed() || this.records !== parseInt(settings.records())) {
            this.seed = parseInt(settings.seed());
            this.records = parseInt(settings.records());

            let log = new Log(),
                bm = new Benchmark();

            log.busy(`Creating ${this.records} records`, true);
            bm.start();

            // Start WebWorker
            let w = new Worker("build/data-worker.js");
            w.onmessage = (event) => {
                "use strict";
                let testData = event.data;
                let size = (sizeof(testData.records.slice(0, 100)) * testData.records.length / 100) / 1024 / 1024,
                    units = 'MB';

                if (size < 1) {
                    size *= 1024;
                    units = 'KB';
                }
                log.amend(`Created ${this.records} records (${Math.round(size * 100) / 100 + units})`, 'info', bm.end());
                cb(testData);
            };
            w.postMessage([settings.records(), settings.seed(), settings.multiple()]);
        }

        return testData;
    }

    run(cb) {
        let engines = {
            ls: new LS(),
            indexeddb: new IDB(),
            websql: new WebSql()
        };
        let vm = ViewModel.instance;
        let tests = vm.tests;
        let bm = new Benchmark().start();

        this.getData((data) => {
            "use strict";

            vm.engines().filter((engine) => {
                return engine.checked() && !engine.disabled();
            }).forEach((engine) => {
                let log = new Log({prefix: engine.name});

                setup(engines[engine.id], data, log, (output) => {
                    if (output) {
                        log.info('Tests successful', bm.end());
                    }
                    else {
                        log.info('Test failed', bm.end());
                    }
                    cb();
                })
            });
        });

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
}

export default TestRunner

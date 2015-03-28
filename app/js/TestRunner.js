import ViewModel from './ViewModel';
import Generator from './Generator';
import Benchmark from './Benchmark';
import State from './State';
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
let messages = {
    setup: {
        passed: 'Setup done'
    },
    insert: {
        busy: 'Inserting records',
        error: 'Insert',
        passed: 'Inserted all records'
    },
    singleByPK: {
        error: 'Primary Key record not found',
        passed: 'Primary Key record found'
    },
    singleByUI: {
        error: 'Unique Index record not found',
        passed: 'Unique Index record found'
    },
    multiByPK: {
        error: 'Primary Key records not found',
        passed: 'Primary Key records found'
    },
    multiByUI: {
        error: 'Unique Index records not found',
        passed: 'Unique Index records found'
    },
    multiByI: {
        error: 'Records not found by Index',
        passed: 'Records not found by Index'
    },
    multiByNoI: {
        error: 'Records not found using no Index',
        passed: 'Records not found using no Index'
    }
};


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

        if (this.seed !== parseInt(settings.seed()) || this.records !== parseInt(settings.records())) {
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
                testData = event.data;

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
        } else {
            cb(testData);
        }
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

            let filtered = vm.engines().filter((engine) => {
                return engine.checked() && !engine.disabled();
            });

            if (filtered && filtered.length > 0) {
                filtered.forEach((engine) => {
                    let log = new Log({prefix: engine.name}),
                        state = new State(engine, engines[engine.id]);

                    this.performTest([state.getTest().id], state, log, data, (output) => {
                        if (output) {
                            log.info('Tests successful', bm.end());
                        }
                        else {
                            log.error('Test failed', bm.end());
                        }
                        cb();
                    });
                });
            } else {
                new Log().warn('Not storage engines enabled for testing');
                cb();
            }
        });
    }

    performTest(test, state, log, data, cb) {
        "use strict";

        state.startTest();

        if (state.isTestAvailable()) {
            let benchmark = new Benchmark().start();
            if (messages[test].busy) {
                log.busy(messages[test].busy);
            }

            state.getEngine()[test](data, (output) => {
                let duration = benchmark.end();

                if (output) {
                    if (output.status === 'error') {
                        log.error(`${messages[test].error} - ${output.msg}`, duration);
                        state.endTest('failed', duration);
                        return cb(false);
                    } else if (output.status === 'skip') {
                        //log.info(`${state.getTestName()} not implemented`);
                        state.endTest('skipped');
                    }
                }
                else {
                    state.endTest('passed', duration);
                    log.info(messages[test].passed, duration);
                }

                setTimeout(() => { // Escape from try-catch used in LS
                    if(state.hasNextTest()) {
                        this.performTest(state.nextTest().id, state, log, data, cb);
                    } else {
                        cb(true);
                    }
                });
            })
        } else {
            state.endTest('skip');
            setTimeout(() => { // Escape from try-catch used in LS
                if(state.hasNextTest()) {
                    this.performTest(state.nextTest().id, state, log, data, cb);
                } else {
                    cb(true);
                }
            });
        }
    }
}

export default TestRunner;

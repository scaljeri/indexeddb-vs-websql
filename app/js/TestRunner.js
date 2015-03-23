import ViewModel from './ViewModel';
import Generator from './Generator';
import Benchmark from './Benchmark';
import Log from './Log';
import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

let generator = Generator.instance;
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
            this.records = settings.records();

            Benchmark.start();
            testData = generator.create(settings.records(), settings.seed());
            Log.info(Benchmark.end(), `Created ${this.records} records`);
        }

        return testData;
    }

    run() {
        let idb = new IDB();
        let wsql = new WebSql();
        let ls = new LS();
        let vm = ViewModel.instance;
        let tests = vm.tests;

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

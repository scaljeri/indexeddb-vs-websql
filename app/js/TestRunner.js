import ViewModel from './ViewModel';
import Generator from './Generator';
import Benchmark from './Benchmark';
import Log from './Log';
import IDB from './IDB';

let generator = Generator.instance;
let callable = Function.bind.bind(Function.call);

let singleton = Symbol();
let singletonEnforcer = Symbol()

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
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new TestRunner(singletonEnforcer);
        }
        return this[singleton];
    }

    run() {
        console.log('TEST GO');
    }
}

export default TestRunner

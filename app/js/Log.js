import ViewModel from './ViewModel';

let singleton = Symbol();
let singletonEnforcer = Symbol();

class Log {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.history = ViewModel.instance.logHistory;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Log(singletonEnforcer);
        }

        return this[singleton];
    }
    debug(msg, duration) {
        this.create('debug', msg, duration);
    }

    error(msg, duration) {
        this.create('error', msg, duration);
    }

    info(msg, duration) {
        this.create('info', msg, duration);
    }

    create(ltype, duration, msg) {
        this.history.unshift({
            ltype: ltype,
            duration: duration,
            message: msg
        });
    }
}

export default Log

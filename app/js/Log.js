import ViewModel from './ViewModel';

class Log {

    constructor() {
        throw "This is a static class";
    }

    static debug(msg, duration) {
        this.create('debug', msg, duration);
    }

    static error(msg, duration) {
        this.create('error', msg, duration);
    }

    static info(msg, duration) {
        this.create('info', msg, duration);
    }

    static create(ltype, duration, msg) {
        ViewModel.instance.logHistory.unshift({
            ltype: ltype,
            duration: duration === null ? '-' : `${duration}s`,
            message: msg
        });
    }
}

export default Log

import ViewModel from './ViewModel';

class Log {

    constructor() {
    }

    /*
    This function should be called if the timer is enabled when `busy` is called.
    However, if `amend` is called with a `duration` the timer is also canceled.
     */
    done() {
        "use strict";

        if (this.interId) {
            clearInterval(this.interId);
            this.interId = null;
        }
    }

    /*
    Modify the last log message of this instance
     */
    amend(msg, ltype, duration) {
        "use strict";

        if (msg) {
            this.lastMsg.message(msg);
        }

        if (typeof duration === 'number') {
            this.done();
            this.lastMsg.duration(duration);
            this.pending = null;
        }

        if (ltype) {
            this.lastMsg.ltype(ltype);
        }
    }

    /*
    This function is different from the other. It doesn't accept a duration, but instead you can activate an timer
    NB: If you enable the time make sure to stop it when done by calling `done` or `amend` with a duration!
     */
    busy(msg, timer) {
        "use strict";
        if (this.interId) {
            throw 'This log instance is still busy!!';
        }

        this.lastMsg = Log.create('busy', msg);
        if (timer) {
            this.startTime = new Date();
            this.interId = setInterval(() => {
                let endTime = new Date();
                this.lastMsg.duration(Math.floor((endTime - this.startTime)/1000) + 's');
            }, 1000);
        }
    }

    debug(msg, duration) {
        if (this)
        this.lastMsg = Log.create('debug', msg, duration);
    }

    warn(msg, duration) {
        "use strict";
        this.lastMsg = Log.create('warn', msg, duration);
    }

    error(msg, duration) {
        this.lastMsg = Log.create('error', msg, duration);
    }

    info(msg, duration) {
        this.lastMsg = Log.create('info', msg, duration);
    }

    static create(ltype, msg, duration) {
        var item = {
            ltype:    ko.observable(ltype || 'info'),
            duration: ko.observable(typeof duration === 'number' ? `${duration}s` : (!ltype ? '' : '-')),
            message:  ko.observable(msg)
        };
        ViewModel.instance.logHistory.unshift(item);

        return item;
    }
}

export default Log

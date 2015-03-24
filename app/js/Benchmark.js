"use strict";

let startDate;

export default class Benchmark {
    constructor() {}

    // If `callable` is defined, cb is not optional. Furthermore this.end is called too!
    start(callable, cb) {
        this.startDate = new Date();

        if (callable) {
            callable((output) => {
                cb(this.end(), output);
            });
        }

        return this;
    }

    end() {
        if (!this.startDate) {
            throw 'Benchmark `end` called without a `start` call!';
        }

        let amount = new Date() - this.startDate;
        this.startDate = null;

        return Math.round(amount/1) / 1000;
    }
}

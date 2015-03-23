"use strict";

let startDate;

export default class Benchmark {
    constructor() {}

    static start(callable, cb) {
        startDate = new Date();

        if (callable) {
            callable((output) => {
                cb(new Date() - start, output);
            });
        }
    }

    static end() {
        if (!startDate) {
            throw 'Benchmark `end` called without a `start` call!';
        }

        let sd = startDate;
        startDate = null;

        return Math.round((new Date() - sd) / 1) / 1000;
    }
}

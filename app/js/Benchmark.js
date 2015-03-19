"use strict";

export default class Benchmark {
    constructor() {}

    start(callable, cb) {
        console.log('stary');
        callable();
        setTimeout( () => cb(1000), 2000);
    }
}

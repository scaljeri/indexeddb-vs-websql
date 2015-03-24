export default class Testable {
    constructor() {
    }

    setup () {
        throw this.__proto__.constructor.name + ": Setup is not implemented";
    }

    static isAvailable() {
        "use strict";
        return false;
    }
}

let singleton = Symbol();
let singletonEnforcer = Symbol()

let alphabet = 'abcdefghijklmnopqrstuvwxyz01234567890'.split('');
let names = ['Bill', 'Bob', 'Bratt', 'Donna', 'Joyce', 'Chris', 'Angelina', 'George', 'Obama', 'Jill', 'Thomas', 'Martin', 'Louise', 'Francesca', 'Holly', 'Sarah', 'Zoe'];

class Generator {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Generator(singletonEnforcer);
        }
        return this[singleton];
    }

    create() {
        return "abc";
    }
}

export default Generator

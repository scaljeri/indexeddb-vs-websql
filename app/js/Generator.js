let singleton = Symbol();
let singletonEnforcer = Symbol()

let alphabet = 'abcdefghijklmnopqrstuvwxyz01234567890'.split('');
let names = ['Bill', 'Bob', 'Bratt', 'Donna', 'Joyce', 'Chris', 'Angelina', 'George', 'Obama', 'Jill', 'Thomas', 'Martin', 'Louise', 'Francesca', 'Holly', 'Sarah', 'Zoe'];

class NumberGenerator {
    constructor(seed) {
        this.A = 48271;
        this.M = 2147483647;

        this.Q = this.M / this.A;
        this.R = this.M % this.A;
        this.X = 1.0 / this.M;

        this.seed = seed;
    }

    get(min, max) {
        this.seed = this.A * (this.seed % this.Q) - this.R * (this.seed / this.Q);
        if (this.seed <= 0) {
            this.seed += this.M;
        }

        return Math.round((max - min) * this.seed * this.X + min);
    }
}

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

    create(records, seed) {
        let data = [];
        let rand = new NumberGenerator(seed);

        while(records > data.length) {
            data.push(rand.get(0,1));
        }

        return data;
    }
}

export default Generator

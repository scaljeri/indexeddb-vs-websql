let alphabet = 'abcdefghijklmnopqrstuvwxyz01234567890'.split('');
let names = ['Bill', 'Bob', 'Bratt', 'Donna', 'Joyce', 'Chris', 'Angelina', 'George', 'Obama', 'Jill', 'Thomas', 'Martin', 'Louise', 'Francesca', 'Holly', 'Sarah', 'Zoe'];

function generateSSN(rand) {
    "use strict";

    return '' + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) +
        '-' + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) +
        '-' + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0);
}

function generateString(length, rand) {
    "use strict";

    let str = '';
    for (var i = 0; i < length; i++) {
        str += alphabet[rand.get(35, 0)];
    }

    return str;
}

function shuffleArray(data, rand) {
    let newIndex;
    for (let index = 0; index < data.length; index++) {
        newIndex = rand.get(data.length - 1);
        [data[index], data[newIndex]] = [data[newIndex], data[index]]; // swap items
    }

    return data;
}

function defineBoundsBy(data, key, numberOfMatches, rand) {
    "use strict";

    data.sort((a, b) => {
        return a[key] > b[key] ? 1 : a[key] == b[key] ? 0 : -1;
    });

    let startIndex = rand.get(data.length - numberOfMatches - 1);

    return [data[startIndex][key], data[startIndex + numberOfMatches - 1][key]];
}

class NumberGenerator {
    constructor(seed) {
        this.A = 48271;
        this.M = 2147483647;

        this.Q = this.M / this.A;
        this.R = this.M % this.A;
        this.X = 1.0 / this.M;

        this.seed = seed;
    }

    get(max = 1, min = 0) {
        this.seed = this.A * (this.seed % this.Q) - this.R * (this.seed / this.Q);
        if (this.seed <= 0) {
            this.seed += this.M;
        }

        return Math.round((max - min) * this.seed * this.X + min);
    }
}

class Generator {

    constructor() {
        throw 'Static class!';
    }

    static create(records, seed, boundMatches) {
        let output = {};
        let data = [];
        let rand = new NumberGenerator(seed);

        let name;
        while (records > data.length) {
            data.push({
                ssn: generateSSN(rand), // PK
                name: (name = names[rand.get(16, 0)]), // I
                email: name + '@' + generateString(5, rand) + '.' + generateString(3, rand), // UI
                age: rand.get(100) // No I
            });
        }

        // Choose 4 different records
        let indices = [];
        for(let i = 0; i < 4; i++) {
            let randVal, length = indices.length;
            while (indices.length === length) {
                randVal = rand.get(data.length-1);
                if (indices.indexOf(randVal) === -1) {
                    indices.push(randVal);
                }
            }
        }

        output.single = {
            pk: data[indices[0]].ssn,
            ui: data[indices[1]].email,
            i: data[indices[2]].name,
            noi: data[indices[3]].age
        };

        output.bounds = {
            ssn: defineBoundsBy(data, 'ssn', boundMatches, rand),
            email: defineBoundsBy(data, 'email', boundMatches, rand),
            name: defineBoundsBy(data, 'name', boundMatches, rand),
            age: defineBoundsBy(data, 'age', boundMatches, rand)
        };
        output.records = shuffleArray(data, rand);

        return output;
    }
}

export default Generator

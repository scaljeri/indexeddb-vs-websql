let alphabet = 'abcdefghijklmnopqrstuvwxyz01234567890'.split('');

function generateSSN(rand) {
    "use strict";

    return '' + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) +
        '-' + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) +
        '-' + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0);
}

function generateString(max, min, rand) {
    "use strict";
    let str = '', length = max;

    if (typeof min !== 'number') {
        rand = min;
    }
    else {
        length = rand.get(max, min);
    }

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

    if (key !== 'ssn' && key !== 'email') {
        for (let i = startIndex; i < startIndex + numberOfMatches; i++) {
            data[i][key] = `${data[i][key]}`; // make unique
        }
    }

    return [data[startIndex], data[startIndex + numberOfMatches - 1]];
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

        generateString(8, rand);
        let name;
        // Create some fake records
        while (records > data.length) {
            data.push({
                ssn:   generateSSN(rand), // PK
                name:  `${generateString(8, 3, rand)} ${generateString(10, 5, rand)}`, // I
                email: `${generateString(8, 3, rand)}@${generateString(8, rand)}.${generateString(3, rand)}`, // UI
                age:   rand.get(1000000000) // No I
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
            pk: data[indices[0]],
            ui: data[indices[1]],
            i: data[indices[2]],
            noi: data[indices[3]]
        };

        output.multi = {
            numberOfMatches: boundMatches,
            pk: defineBoundsBy(data, 'ssn', boundMatches, rand),
            ui: defineBoundsBy(data, 'email', boundMatches, rand),
            i: defineBoundsBy(data, 'name', boundMatches, rand),
            noi: defineBoundsBy(data, 'age', boundMatches, rand)
        };
        output.records = shuffleArray(data, rand);

        return output;
    }
}

export default Generator

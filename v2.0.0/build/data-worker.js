(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Generator = _interopRequire(require("./Generator"));

self.addEventListener("message", function (e) {
    "use strict";
    var records = e.data[0];
    var seed = e.data[1];
    var multiple = e.data[2];

    var testData = Generator.create(records, seed, multiple);
    self.postMessage(testData);
});

},{"./Generator":2}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var alphabet = "abcdefghijklmnopqrstuvwxyz01234567890".split("");

function generateSSN(rand) {
    "use strict";

    return "" + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + "-" + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + "-" + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0) + rand.get(9, 0);
}

function generateString(max, min, rand) {
    "use strict";
    var str = "",
        length = max;

    if (typeof min !== "number") {
        rand = min;
    } else {
        length = rand.get(max, min);
    }

    for (var i = 0; i < length; i++) {
        str += alphabet[rand.get(35, 0)];
    }

    return str;
}

function shuffleArray(data, rand) {
    var newIndex = undefined;
    for (var index = 0; index < data.length; index++) {
        newIndex = rand.get(data.length - 1);
        var _ref = [data[newIndex], data[index]];

        // swap items
        var _ref2 = _slicedToArray(_ref, 2);

        data[index] = _ref2[0];
        data[newIndex] = _ref2[1];
    }

    return data;
}

function defineBoundsBy(data, key, numberOfMatches, rand) {
    "use strict";

    data.sort(function (a, b) {
        return a[key] > b[key] ? 1 : a[key] == b[key] ? 0 : -1;
    });

    var startIndex = rand.get(data.length - numberOfMatches - 1);

    if (key !== "ssn" && key !== "email") {
        for (var i = startIndex; i < startIndex + numberOfMatches; i++) {
            data[i][key] = "" + data[i][key]; // make unique
        }
    }

    return [data[startIndex], data[startIndex + numberOfMatches - 1]];
}

var NumberGenerator = (function () {
    function NumberGenerator(seed) {
        _classCallCheck(this, NumberGenerator);

        this.A = 48271;
        this.M = 2147483647;

        this.Q = this.M / this.A;
        this.R = this.M % this.A;
        this.X = 1 / this.M;

        this.seed = seed;
    }

    _prototypeProperties(NumberGenerator, null, {
        get: {
            value: function get() {
                var max = arguments[0] === undefined ? 1 : arguments[0];
                var min = arguments[1] === undefined ? 0 : arguments[1];
                this.seed = this.A * (this.seed % this.Q) - this.R * (this.seed / this.Q);
                if (this.seed <= 0) {
                    this.seed += this.M;
                }

                return Math.round((max - min) * this.seed * this.X + min);
            },
            writable: true,
            configurable: true
        }
    });

    return NumberGenerator;
})();

var Generator = (function () {
    function Generator() {
        _classCallCheck(this, Generator);

        throw "Static class!";
    }

    _prototypeProperties(Generator, {
        create: {
            value: function create(records, seed, boundMatches) {
                var output = {};
                var data = [];
                var rand = new NumberGenerator(seed);

                generateString(8, rand);
                var name = undefined;
                // Create some fake records
                while (records > data.length) {
                    data.push({
                        ssn: generateSSN(rand), // PK
                        name: "" + generateString(8, 3, rand) + " " + generateString(10, 5, rand), // I
                        email: "" + generateString(8, 3, rand) + "@" + generateString(8, rand) + "." + generateString(3, rand), // UI
                        age: rand.get(1000000000) // No I
                    });
                }

                // Choose 4 different records
                var indices = [];
                for (var i = 0; i < 4; i++) {
                    var randVal = undefined,
                        _length = indices.length;
                    while (indices.length === _length) {
                        randVal = rand.get(data.length - 1);
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
                    pk: defineBoundsBy(data, "ssn", boundMatches, rand),
                    ui: defineBoundsBy(data, "email", boundMatches, rand),
                    i: defineBoundsBy(data, "name", boundMatches, rand),
                    noi: defineBoundsBy(data, "age", boundMatches, rand)
                };
                output.records = shuffleArray(data, rand);

                return output;
            },
            writable: true,
            configurable: true
        }
    });

    return Generator;
})();

module.exports = Generator;

},{}]},{},[1])


//# sourceMappingURL=data-worker.js.map
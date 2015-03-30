(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TestRunner = _interopRequire(require("./TestRunner"));

var ViewModel = _interopRequire(require("./ViewModel"));

var Log = _interopRequire(require("./Log"));

var IDB = _interopRequire(require("./IDB"));

var WebSql = _interopRequire(require("./WebSql"));

var LS = _interopRequire(require("./LS"));

var vm = ViewModel.instance;

var View = (function () {
    function View() {
        _classCallCheck(this, View);

        "use strict";
        var refs = {
            ls: LS,
            indexeddb: IDB,
            websql: WebSql
        },
            log = new Log({ removable: false });

        for (var i = vm.engines().length - 1; i >= 0; i--) {
            if (!refs[vm.engines()[i].id].isAvailable()) {
                log.info("" + vm.engines()[i].name + " is not available in your browser");
            } else {
                vm.engines()[i].disabled(false);
            }
        }
        log.info("Ready to go");
    }

    _prototypeProperties(View, null, {
        setup: {
            value: function setup() {
                var _this = this;
                $("[run-tests]").click(function (event) {
                    event.preventDefault();

                    if (!_this.busy) {
                        _this.busy = true;

                        Log.clear();
                        vm.clearTestData();

                        TestRunner.instance.run(function () {
                            "use strict";
                            _this.busy = false;
                        });
                    } else {
                        new Log().warn("In progress already! Please wait (or reload this page)!!");
                    }
                });

                $("[download-data]").click(function (event) {
                    event.preventDefault();
                    //var dialog = document.querySelector('dialog.dialog-sql');
                    //dialogPolyfill.registerDialog(dialog);
                    // Now dialog acts like a native <dialog>.
                    $("dialog.dialog-sql").get(0).showModal();
                    /*TestRunner.instance.getData((data) => {
                        let output = WebSql.getCreateTableSql();
                         data.records.forEach((r) => {
                            "use strict";
                             output.push(`INSERT INTO customers (ssn, email, name, age) VALUES("${r.ssn}", "${r.email}", "${r.name}", ${r.age});`);
                        });
                        var pom = document.createElement('a');
                        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output.join('')));
                        pom.setAttribute('download', 'dump.sql');
                         pom.style.display = 'none';
                        document.body.appendChild(pom);
                         pom.click();
                         document.body.removeChild(pom);
                    }); */
                });
            },
            writable: true,
            configurable: true
        }
    });

    return View;
})();

function download(event) {
    "use strict";
    event.preventDefault();

    if (event.target.textContent === "MySQL") {
        uploadSQL("mysql-dump.sql", WebSql.getCreateTableSql("mysql"));
    } else if (event.target.textContent === "SQLite") {
        uploadSQL("sqlite-dump.sql", WebSql.getCreateTableSql("sqlite"));
    }

    this.closest("dialog").close();
}

function uploadSQL(filename, sql) {
    "use strict";


    TestRunner.instance.getData(function (data) {
        data.records.forEach(function (r) {
            "use strict";

            sql.push("INSERT INTO customers (ssn, email, name, age) VALUES(\"" + r.ssn + "\", \"" + r.email + "\", \"" + r.name + "\", " + r.age + ");");
        });

        var pom = document.createElement("a");
        pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(sql.join("")));
        pom.setAttribute("download", filename);

        pom.style.display = "none";
        document.body.appendChild(pom);

        pom.click();

        document.body.removeChild(pom);
        new Log().info("Uploading file '" + filename + "'");
    });
}

$(function () {
    ko.applyBindings(ViewModel.instance);

    new View().setup();

    $("[supported-db-types]").click(download);
});

},{"./IDB":4,"./LS":5,"./Log":6,"./TestRunner":8,"./ViewModel":10,"./WebSql":11}],2:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var startDate = undefined;

var Benchmark = (function () {
    function Benchmark() {
        _classCallCheck(this, Benchmark);
    }

    _prototypeProperties(Benchmark, null, {
        start: {

            // If `callable` is defined, cb is not optional. Furthermore this.end is called too!
            value: function start(callable, cb) {
                var _this = this;
                this.startDate = new Date();

                if (callable) {
                    callable(function (output) {
                        cb(_this.end(), output);
                    });
                }

                return this;
            },
            writable: true,
            configurable: true
        },
        end: {
            value: function end() {
                if (!this.startDate) {
                    throw "Benchmark `end` called without a `start` call!";
                }

                var amount = new Date() - this.startDate;
                this.startDate = null;

                return Math.round(amount / 1) / 1000;
            },
            writable: true,
            configurable: true
        }
    });

    return Benchmark;
})();

module.exports = Benchmark;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Testable = _interopRequire(require("./Testable"));

var DBNAME = "idb-test",
    OBJECTSTORENAME = "customers",
    VERSION = 22;

var dbconn = undefined;

var IDB = (function (Testable) {
    function IDB() {
        var options = arguments[0] === undefined ? {
            dbname: "idb-test",
            store: "customers"
        } : arguments[0];
        _classCallCheck(this, IDB);

        this.dbname = options.dbname;
        this.store = options.store;
        this.idb = getIndexedDBObject("indexedDB");
    }

    _inherits(IDB, Testable);

    _prototypeProperties(IDB, {
        isAvailable: {
            value: function isAvailable() {
                return !!getIndexedDBObject("indexedDB");
            },
            writable: true,
            configurable: true
        },
        instance: {
            get: function () {
                return new IDB();
            },
            configurable: true
        }
    }, {
        connect: {
            value: function connect(onsuccess, onerror, onupgradeneeded) {
                dbconn = this.idb.open(DBNAME, VERSION);

                dbconn.onsuccess = onsuccess;

                if (onerror) {
                    dbconn.onerror = onerror;
                }

                if (onupgradeneeded) {
                    dbconn.onupgradeneeded = onupgradeneeded;
                }
            },
            writable: true,
            configurable: true
        },
        clear: {
            value: function clear(cb) {
                var transaction = getTransaction("readwrite", cb);

                if (transaction) {
                    if (transaction.db.objectStoreNames.contains(OBJECTSTORENAME)) {
                        var objectStore = transaction.objectStore(OBJECTSTORENAME);
                        var objectStoreRequest = objectStore.clear();
                        //objectStoreRequest.onsuccess = () => { /* cb is called in transaction.oncomplete */ };

                        objectStoreRequest.onerror = function (e) {
                            cb({ status: "fatal", msg: "Could not clear the object store (" + e.message + ")" });
                        };
                    }

                    transaction.oncomplete = function (e) {
                        cb(); // continue!
                    };
                    transaction.onerror = function (e) {
                        cb({ status: "fatal", msg: "Could not access object store (" + e.message + ")" });
                    };
                    transaction.onabort = function (e) {
                        cb({ status: "fatal", msg: "Transaction aborted (" + e.message + ")" });
                    };
                }
            },
            writable: true,
            configurable: true
        },
        setup: {
            value: function setup(data, cb) {
                var status = [];

                if (!dbconn) {
                    this.connect(function () {
                        // onsuccess
                        cb(status);
                    }, function (event) {
                        // onerror
                        status.push({ fatal: "Could not open the db: " + event.message + ", " + dbconn.errorCode });
                        cb(status);
                    }, function (event) {
                        // onupgradeneeded
                        // Update object stores and indices
                        status.push({ info: "Upgrade needed (onupgradeneeded)" });

                        var db = event.target.result;

                        while (db.objectStoreNames.length) {
                            db.deleteObjectStore(db.objectStoreNames[0]);
                        }

                        var objectStore = db.createObjectStore(OBJECTSTORENAME, {
                            keyPath: "ssn"
                        });
                        objectStore.createIndex("name", "name", {
                            unique: false
                        });
                        objectStore.createIndex("email", "email", {
                            unique: true
                        });
                    });
                } else {
                    cb();
                }
            },
            writable: true,
            configurable: true
        },
        insert: {

            /* the last two parameters are ment for internal use only
             clear: if true -> call clear first
             failedMsg: hold a message if clearing failed
             */
            value: function insert(data, cb, _x, failedMsg) {
                var clear = arguments[2] === undefined ? true : arguments[2];
                if (failedMsg) {
                    cb(failedMsg);
                } else if (dbconn) {
                    if (!clear) {
                        var _transaction = getTransaction("readwrite", cb);

                        if (_transaction) {
                            (function () {
                                _transaction.oncomplete = function (e) {
                                    cb();
                                };
                                _transaction.onerror = function (e) {
                                    cb({ status: "fatal", msg: "Could not access object store (" + e.message + ")" });
                                };
                                _transaction.onabort = function (e) {
                                    cb({ status: "fatal", msg: "Transaction aborted (" + e.message + ")" });
                                };

                                var objectStore = _transaction.objectStore("customers");
                                data.records.forEach(function (record) {
                                    objectStore.put(record);
                                });
                            })();
                        }
                    } else {
                        this.clear(this.insert.bind(this, data, cb, false));
                    }
                } else {
                    // connect first and run test again
                    this.connect(this.insert.bind(this, data, cb));
                }
            },
            writable: true,
            configurable: true
        },
        singleByPK: {
            value: function singleByPK(data, cb) {
                if (dbconn) {
                    var _transaction = getTransaction("readonly", cb);

                    if (_transaction) {
                        (function () {
                            var objectStore = _transaction.objectStore(OBJECTSTORENAME);
                            var objectStoreRequest = objectStore.get(data.single.pk.ssn);

                            objectStoreRequest.onsuccess = function (e) {
                                if (objectStoreRequest.result) {
                                    cb();
                                } else {
                                    cb({ status: "error", msg: "Could not find record" });
                                }
                            };
                            objectStoreRequest.onerror = function (e) {
                                cb({ status: "error", msg: "Error during record lookup by PK " + e.message });
                            };
                        })();
                    }
                } else {
                    // connect first and run test again
                    this.connect(this.singleByPK.bind(this, data, cb));
                }
            },
            writable: true,
            configurable: true
        },
        singleByUI: {
            value: function singleByUI(data, cb) {
                var transaction = getTransaction("readonly", cb);

                if (transaction) {
                    var objectStore = transaction.objectStore(OBJECTSTORENAME);

                    var index = objectStore.index("email");
                    index.get(data.single.ui.email).onsuccess = function (event) {
                        var record = event.target.result;
                        if (record.ssn === data.single.ui.ssn) {
                            cb();
                        } else {
                            cb({ state: "error", msg: "Wrong record found" });
                        }
                    };
                }
            },
            writable: true,
            configurable: true
        },
        multiByPK: {
            value: function multiByPK(data, cb) {
                var transaction = getTransaction("readonly", cb);

                if (transaction) {
                    (function () {
                        var objectStore = transaction.objectStore(OBJECTSTORENAME);

                        var boundKeyRange = getIndexedDBObject("IDBKeyRange").bound(data.multi.pk[0].ssn, data.multi.pk[1].ssn, false, false);

                        var count = 0;
                        objectStore.openCursor(boundKeyRange).onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                count++;
                                var email = cursor.value.email; // make sure the value is not lazy loaded
                                if (email) {
                                    cursor["continue"]();
                                } else {
                                    cb({ status: "error", msg: "Found weird record without `email`" });
                                }
                            } else {
                                // ready
                                if (count === data.multi.numberOfMatches) {
                                    cb();
                                } else {
                                    cb({ status: "error", msg: "Found " + count + " matching records" });
                                }
                            }
                        };
                    })();
                }
            },
            writable: true,
            configurable: true
        },
        multiByUI: {
            value: function multiByUI(data, cb) {
                this.multiByI(data, cb, "ui", "email");
            },
            writable: true,
            configurable: true
        },
        multiByI: {
            value: function multiByI(data, cb) {
                var indexName = arguments[2] === undefined ? "i" : arguments[2];
                var columnName = arguments[3] === undefined ? "name" : arguments[3];
                var transaction = getTransaction("readonly", cb);

                if (transaction) {
                    var objectStore = transaction.objectStore(OBJECTSTORENAME);

                    var index = objectStore.index(columnName);
                    var boundKeyRange = getIndexedDBObject("IDBKeyRange").bound(data.multi[indexName][0][columnName], data.multi[indexName][1][columnName], false, false);

                    var count = 0;
                    index.openCursor(boundKeyRange).onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var ssn = cursor.value.ssn;
                            count++;
                            if (ssn) {
                                cursor["continue"]();
                            } else {
                                cb({ status: "error", msg: "Found weird record without `ssn`" });
                            }
                        } else {
                            // ready
                            if (count === data.multi.numberOfMatches) {
                                cb();
                            } else {
                                cb({ status: "error", msg: "Found " + count + " matching records" });
                            }
                        }
                    };
                }
            },
            writable: true,
            configurable: true
        }
    });

    return IDB;
})(Testable);

module.exports = IDB;



function getIndexedDBObject(name) {
    var upper = name[0].toUpperCase() + name.slice(1);

    return window[name] || window["webkit" + upper] || window["moz" + upper] || window["ms" + upper];
}

function getTransaction(mode, cb) {
    try {
        return dbconn.result.transaction([OBJECTSTORENAME], mode);
    } catch (e) {
        cb({ status: "fatal", msg: "Could not create a transaction: " + transaction });
        return null;
    }
}

},{"./Testable":9}],5:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Testable = _interopRequire(require("./Testable"));

var LS = (function (Testable) {
    function LS() {
        _classCallCheck(this, LS);
    }

    _inherits(LS, Testable);

    _prototypeProperties(LS, {
        isAvailable: {
            value: function isAvailable() {
                return typeof Storage !== void 0;
            },
            writable: true,
            configurable: true
        },
        instance: {
            get: function () {
                return new LS();
            },
            configurable: true
        }
    }, {
        setup: {
            value: function setup(data, cb) {
                localStorage.clear();
                cb();
            },
            writable: true,
            configurable: true
        },
        insert: {
            value: function insert(data, cb) {
                try {
                    data.records.forEach(function (record) {
                        localStorage.setItem(record.ssn, JSON.stringify(record));
                    });
                    cb();
                } catch (e) {
                    cb({ status: "error", msg: e.message });
                }
            },
            writable: true,
            configurable: true
        },
        singleByPK: {
            value: function singleByPK(data, cb) {
                var record = localStorage.getItem(data.single.pk.ssn);
                if (record) {
                    record = JSON.parse(record);
                    if (record.email === data.single.pk.email) {
                        cb();
                    } else {
                        cb();
                    }
                } else {
                    cb({ status: "error", msg: "No record found" });
                }
            },
            writable: true,
            configurable: true
        }
    });

    return LS;
})(Testable);

module.exports = LS;

},{"./Testable":9}],6:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ViewModel = _interopRequire(require("./ViewModel"));

var Log = (function () {
    function Log() {
        var setup = arguments[0] === undefined ? { removable: true, prefix: null, subPrefix: null } : arguments[0];
        _classCallCheck(this, Log);

        "use strict";
        this.setup = {
            removable: typeof setup.removable === "undefined" ? true : setup.removable,
            prefix: setup.prefix,
            subPrefix: setup.subPrefix
        };
    }

    _prototypeProperties(Log, {
        create: {
            value: function create(ltype, msg, duration) {
                var item = {
                    ltype: ko.observable(ltype || "info"),
                    duration: ko.observable(typeof duration === "number" ? "" + duration + "s" : !ltype ? "" : "-"),
                    message: ko.observable(this.getPrefix() + msg),
                    removable: this.setup.removable
                };
                ViewModel.instance.logHistory.unshift(item);

                return item;
            },
            writable: true,
            configurable: true
        },
        clear: {

            // Removes all log history except for those items where: removeable === false
            value: function clear() {
                "use strict";

                var history = ViewModel.instance.logHistory();

                for (var i = history.length - 1; i >= 0; i--) {
                    if (history[i].removable) {
                        history.splice(i, 1);
                    }
                }
            },
            writable: true,
            configurable: true
        }
    }, {
        prefix: {
            set: function (prefix) {
                "use strict";

                this.setup.prefix = prefix;
            },
            configurable: true
        },
        subPrefix: {
            set: function (subPrefix) {
                "use strict";

                this.setup.subPrefix = subPrefix;
            },
            configurable: true
        },
        done: {

            /*
             This function should be called if the timer is enabled when `busy` is called.
             However, if `amend` is called with a `duration` the timer is also canceled.
             */
            value: function done() {
                "use strict";

                if (this.interId) {
                    clearInterval(this.interId);
                }

                this.interId = null;
                this.isBusy = false;
            },
            writable: true,
            configurable: true
        },
        amend: {

            /*
             Modify the last log message of this instance
             */
            value: function amend(msg, ltype, duration) {
                "use strict";

                if (this.isBusy) {
                    if (msg) {
                        this.lastMsg.message(msg);
                    }

                    if (typeof duration === "number") {
                        this.done();
                        this.lastMsg.duration("" + duration + "s");
                        this.pending = null;
                    }

                    if (ltype) {
                        this.lastMsg.ltype(ltype);
                    }
                }

                return this;
            },
            writable: true,
            configurable: true
        },
        busy: {

            /*
             This function is different from the other. It doesn't accept a duration, but instead you can activate an timer
             NB: If you enable the time make sure to stop it when done by calling `done` or `amend` with a duration!
             */
            value: function busy(msg, timer) {
                var _this = this;
                "use strict";
                if (this.interId) {
                    throw "This log instance is still busy!!";
                }

                this.create("busy", msg, timer ? 0 : null);
                this.isBusy = true;
                if (timer) {
                    this.startTime = new Date();
                    this.interId = setInterval(function () {
                        var endTime = new Date();
                        _this.lastMsg.duration(Math.floor((endTime - _this.startTime) / 1000) + "s");
                    }, 1000);
                }
            },
            writable: true,
            configurable: true
        },
        getPrefix: {
            value: function getPrefix() {
                "use strict";
                var str = "";

                if (this.setup.subPrefix) {
                    str = "(" + this.setup.subPrefix + ")";
                }
                return this.setup.prefix ? "<strong>" + this.setup.prefix + "" + str + "</strong>: " : "";
            },
            writable: true,
            configurable: true
        },
        create: {
            value: function create(ltype, msg, duration) {
                "use strict";

                if (this.isBusy) {
                    this.amend(this.getPrefix() + msg, ltype, duration).done();
                } else {
                    this.lastMsg = Log.create.call(this, ltype, msg, duration);
                }
            },
            writable: true,
            configurable: true
        },
        debug: {
            value: function debug(msg, duration) {
                this.create("debug", msg, duration);
            },
            writable: true,
            configurable: true
        },
        warn: {
            value: function warn(msg, duration) {
                "use strict";
                this.create("warn", msg, duration);
            },
            writable: true,
            configurable: true
        },
        error: {
            value: function error(msg, duration) {
                this.create("error", msg, duration);
            },
            writable: true,
            configurable: true
        },
        info: {
            value: function info(msg, duration) {
                this.create("info", msg, duration);
            },
            writable: true,
            configurable: true
        }
    });

    return Log;
})();

module.exports = Log;

},{"./ViewModel":10}],7:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ViewModel = _interopRequire(require("./ViewModel"));

var vm = ViewModel.instance;

var State = (function () {
    function State(engine) {
        _classCallCheck(this, State);

        this.testIndex = 0;
        this.engineSettings = engine;
        this.engine = new engine.classRef();
    }

    _prototypeProperties(State, null, {
        getTest: {
            value: function getTest() {
                return vm.tests[this.testIndex];
            },
            writable: true,
            configurable: true
        },
        getEngine: {
            value: function getEngine() {
                return this.engine;
            },
            writable: true,
            configurable: true
        },
        hasNextTest: {
            value: function hasNextTest() {
                return vm.tests.length > this.testIndex + 1;
            },
            writable: true,
            configurable: true
        },
        getTestName: {
            value: function getTestName() {
                return vm.tests[this.testIndex].name;
            },
            writable: true,
            configurable: true
        },
        getDescriptiveName: {
            value: function getDescriptiveName() {
                return (vm.tests[this.testIndex].single ? "" : "Multiple ") + vm.tests[this.testIndex].name;
            },
            writable: true,
            configurable: true
        },
        nextTest: {
            value: function nextTest() {
                return vm.tests[++this.testIndex];
            },
            writable: true,
            configurable: true
        },
        isTestAvailable: {
            value: function isTestAvailable() {
                return vm.tests[this.testIndex].enabled;
            },
            writable: true,
            configurable: true
        },
        startTest: {
            value: function startTest() {
                this.engineSettings.tests[this.testIndex].state("busy");
            },
            writable: true,
            configurable: true
        },
        endTest: {
            value: function endTest(status) {
                var duration = arguments[1] === undefined ? "" : arguments[1];
                this.engineSettings.tests[this.testIndex].state(status);
                this.engineSettings.tests[this.testIndex].duration(duration);
            },
            writable: true,
            configurable: true
        }
    });

    return State;
})();

module.exports = State;

},{"./ViewModel":10}],8:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ViewModel = _interopRequire(require("./ViewModel"));

var Generator = _interopRequire(require("./Generator"));

var Benchmark = _interopRequire(require("./Benchmark"));

var State = _interopRequire(require("./State"));

var Log = _interopRequire(require("./Log"));

var IDB = _interopRequire(require("./IDB"));

var WebSql = _interopRequire(require("./WebSql"));

var LS = _interopRequire(require("./LS"));

var singleton = Symbol();
var singletonEnforcer = Symbol();
var testData = null;

var messages = {
    setup: {
        info: "NB"
    },
    insert: {
        busy: "Inserting records",
        error: "Insert"
    },
    singleByPK: {
        error: "Primary Key record not found"
    },
    singleByUI: {
        error: "Unique Index record not found"
    },
    multiByPK: {
        error: "Primary Key records not found"
    },
    multiByUI: {
        error: "Unique Index records not found"
    },
    multiByI: {
        error: "Records not found by Index"
    },
    multiByNoI: {
        error: "Records not found using no Index"
    }
};


var TestRunner = (function () {
    function TestRunner(enforcer) {
        _classCallCheck(this, TestRunner);

        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.tests = ViewModel.instance.tests;
    }

    _prototypeProperties(TestRunner, {
        instance: {
            get: function () {
                if (!this[singleton]) {
                    this[singleton] = new TestRunner(singletonEnforcer);
                }
                return this[singleton];
            },
            configurable: true
        }
    }, {
        getData: {
            value: function getData(cb) {
                var _this = this;
                var settings = ViewModel.instance.config;

                if (this.seed !== parseInt(settings.seed()) || this.records !== parseInt(settings.records())) {
                    (function () {
                        _this.seed = parseInt(settings.seed());
                        _this.records = parseInt(settings.records());

                        var log = new Log(),
                            bm = new Benchmark();

                        log.busy("Creating " + _this.records + " records", true);
                        bm.start();

                        // Start WebWorker
                        var w = new Worker("build/data-worker.js");
                        w.onmessage = function (event) {
                            "use strict";
                            testData = event.data;

                            var size = sizeof(testData.records.slice(0, 100)) * testData.records.length / 100 / 1024 / 1024,
                                units = "MB";

                            if (size < 1) {
                                size *= 1024;
                                units = "KB";
                            }
                            log.amend("Created " + _this.records + " records (" + (Math.round(size * 100) / 100 + units) + ")", "info", bm.end());
                            cb(testData);
                        };
                        w.postMessage([settings.records(), settings.seed(), settings.multiple()]);
                    })();
                } else {
                    cb(testData);
                }
            },
            writable: true,
            configurable: true
        },
        run: {
            value: function run(cb) {
                var _this = this;
                var vm = ViewModel.instance;
                var tests = vm.tests;

                this.getData(function (data) {
                    "use strict";

                    var filtered = vm.engines().filter(function (engine) {
                        return engine.checked() && !engine.disabled();
                    });

                    if (filtered && filtered.length > 0) {
                        (function () {
                            var log = new Log(),
                                bm = new Benchmark().start();

                            _this.testEngines(data, filtered, function () {
                                log.info("Done", bm.end());
                                cb();
                            });
                        })();
                    } else {
                        new Log().warn("Not storage engines enabled for testing");
                        cb();
                    }
                });
            },
            writable: true,
            configurable: true
        },
        testEngines: {
            value: function testEngines(data, engines, cb) {
                var _this = this;
                var i = arguments[3] === undefined ? 0 : arguments[3];
                "use strict";

                var engine = engines[i];

                if (engine) {
                    (function () {
                        var log = new Log({ prefix: engine.name }),
                            state = new State(engine),
                            bm = new Benchmark().start();

                        _this.performTest([state.getTest().id], state, log, data, function (output) {
                            log.subPrefix = null;

                            if (output) {
                                log.info("Tests successful", bm.end());
                            } else {
                                log.error("Test failed", bm.end());
                            }
                            _this.testEngines(data, engines, cb, ++i);
                        });
                    })();
                } else {
                    cb();
                }
            },
            writable: true,
            configurable: true
        },
        performTest: {
            value: function performTest(test, state, log, data, cb) {
                var _this = this;
                "use strict";

                state.startTest();
                log.subPrefix = state.getDescriptiveName();

                if (state.isTestAvailable()) {
                    (function () {
                        var benchmark = new Benchmark().start();
                        if (messages[test].busy) {
                            log.busy(messages[test].busy, true);
                        }

                        setTimeout(function () {
                            state.getEngine()[test](data, function (output) {
                                var duration = benchmark.end();
                                var containsFatal = false;
                                var containsError = false;
                                var containsSkipped = false;

                                if (output && output.length > 0) {
                                    output.forEach(function (item) {
                                        if (item.fatal) {
                                            containsFatal = true;
                                            log.error("" + messages[test].error + " - " + item.fatal, duration);
                                        }
                                        if (item.error) {
                                            containsError = true;

                                            log.error("" + messages[test].error + " - " + item.error, duration);
                                        }
                                        if (item.info) {
                                            log.info("" + messages[test].info + " - " + item.info, duration);
                                        }
                                        if (item.skipped) {
                                            containsSkipped = true;
                                        }
                                    });

                                    if (containsFatal) {
                                        return cb(false);
                                    }
                                }

                                if (containsError || containsFatal) {
                                    state.endTest("failed", duration);
                                } else if (containsSkipped) {
                                    state.endTest("skipped");
                                } else {
                                    state.endTest("passed", duration);
                                    log.info("Done", duration);
                                }

                                setTimeout(function () {
                                    // Escape from try-catch used in LS
                                    if (state.hasNextTest()) {
                                        _this.performTest(state.nextTest().id, state, log, data, cb);
                                    } else {
                                        cb(true);
                                    }
                                });
                            });
                        }, 1);
                    })();
                } else {
                    state.endTest("skip");
                    setTimeout(function () {
                        // Escape from try-catch used in LS
                        if (state.hasNextTest()) {
                            _this.performTest(state.nextTest().id, state, log, data, cb);
                        } else {
                            cb(true);
                        }
                    });
                }
            },
            writable: true,
            configurable: true
        }
    });

    return TestRunner;
})();

module.exports = TestRunner;

},{"./Benchmark":2,"./Generator":3,"./IDB":4,"./LS":5,"./Log":6,"./State":7,"./ViewModel":10,"./WebSql":11}],9:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var output = [{ skipped: true }];
var Testable = (function () {
    function Testable() {
        _classCallCheck(this, Testable);
    }

    _prototypeProperties(Testable, {
        isAvailable: {
            value: function isAvailable() {
                "use strict";
                return false;
            },
            writable: true,
            configurable: true
        }
    }, {
        setup: {
            value: function setup() {
                "use strict";
                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        insert: {
            value: function insert() {
                "use strict";
                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        singleByPK: {
            value: function singleByPK() {
                "use strict";
                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        singleByUI: {
            value: function singleByUI() {
                "use strict";
                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        multiByPK: {
            value: function multiByPK() {
                "use strict";

                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        multiByUI: {
            value: function multiByUI() {
                "use strict";

                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        multiByI: {
            value: function multiByI() {
                "use strict";

                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        },
        multiByNoI: {
            value: function multiByNoI() {
                "use strict";

                arguments[arguments.length - 1](output);
            },
            writable: true,
            configurable: true
        }
    });

    return Testable;
})();

module.exports = Testable;

},{}],10:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var IDB = _interopRequire(require("./IDB"));

var WebSql = _interopRequire(require("./WebSql"));

var LS = _interopRequire(require("./LS"));

var singleton = Symbol();
var singletonEnforcer = Symbol();

var ViewModel = (function () {
    function ViewModel(enforcer) {
        var _this = this;
        _classCallCheck(this, ViewModel);

        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.tests = [{
            id: "setup",
            name: "Setup",
            enabled: true,
            single: true
        }, {
            id: "insert",
            name: "Insert",
            enabled: true,
            single: true
        }, {
            id: "singleByPK",
            name: "PK",
            enabled: true,
            single: true
        }, {
            id: "singleByUI",
            name: "UI",
            enabled: true,
            single: true
        }, {
            id: "multiByPK",
            name: "PK",
            single: false,
            enabled: true
        }, {
            id: "multiByUI",
            name: "UI",
            single: false,
            enabled: true
        }, {
            id: "multiByI",
            name: "I",
            single: false,
            enabled: true
        }, {
            id: "multiByNoI",
            name: "No Index",
            single: false,
            enabled: true
        }];

        this.engines = ko.observableArray([{
            name: "LocalStorage",
            checked: ko.observable(true),
            disabled: ko.observable(true), // TRUE if storage engine is not supported by the browser
            id: "ls",
            tests: [], //ko.observableArray([])
            classRef: LS
        }, {
            name: "IndexedDB",
            checked: ko.observable(true),
            disabled: ko.observable(true),
            id: "indexeddb",
            tests: [], //ko.observableArray([])
            classRef: IDB
        }, {
            name: "WebSQL",
            checked: ko.observable(true),
            disabled: ko.observable(true),
            id: "websql",
            tests: [], //ko.observableArray([])
            classRef: WebSql
        }]);

        this.engines().forEach(function (engine) {
            for (var i = 0; i < _this.tests.length; i++) {
                engine.tests.push({
                    state: ko.observable(),
                    duration: ko.observable()
                });
            }
        });

        this.results = {}; // TODO ????
        this.logHistory = ko.observableArray();
        this.config = {
            records: ko.observable(1000),
            seed: ko.observable(2345678901),
            multiple: ko.observable(10)
        };
    }

    _prototypeProperties(ViewModel, {
        instance: {
            get: function () {
                if (!this[singleton]) {
                    this[singleton] = new ViewModel(singletonEnforcer);
                }
                return this[singleton];
            },
            configurable: true
        }
    }, {
        clearTestData: {
            value: function clearTestData() {
                var _this = this;
                "use strict";

                this.engines().forEach(function (engine) {
                    for (var i = 0; i < _this.tests.length; i++) {
                        engine.tests[i].state(null);
                        engine.tests[i].duration(null);
                    }
                });
            },
            writable: true,
            configurable: true
        }
    });

    return ViewModel;
})();

module.exports = ViewModel;

},{"./IDB":4,"./LS":5,"./WebSql":11}],11:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Testable = _interopRequire(require("./Testable"));

var DBNAME = "wsql-test",
    TABLENAME = "customers",
    VERSION = 1;
var dbconn = undefined;

var WebSql = (function (Testable) {
    function WebSql() {
        var options = arguments[0] === undefined ? { dbname: "idb-test", store: "customers" } : arguments[0];
        _classCallCheck(this, WebSql);

        this.dbname = options.dbname;
        this.store = options.store;
    }

    _inherits(WebSql, Testable);

    _prototypeProperties(WebSql, {
        isAvailable: {
            value: function isAvailable() {
                return !!window.openDatabase;
            },
            writable: true,
            configurable: true
        },
        getCreateTableSql: {
            value: function getCreateTableSql() {
                var db = arguments[0] === undefined ? "sqlite" : arguments[0];
                var text = db === "sqlite" ? "TEXT" : "VARCHAR(30)";

                // TODO: Check index usage if tests are implemented
                var output = ["DROP TABLE IF EXISTS " + TABLENAME + ";", "DROP INDEX IF EXISTS email_idx;", "CREATE TABLE IF NOT EXISTS " + TABLENAME + " (ssn " + text + " PRIMARY KEY, email TEXT NOT NULL, name " + text + ", age REAL);"]; //, UNIQUE(email));`];
                output.push("CREATE UNIQUE INDEX email_idx ON " + TABLENAME + " (email);\n");
                return output;
            },
            writable: true,
            configurable: true
        }
    }, {
        connect: {
            value: function connect() {
                dbconn = openDatabase(DBNAME, VERSION, "performance test database", 10 * 1024 * 1024); // 10MB in size
            },
            writable: true,
            configurable: true
        },
        setup: {
            value: function setup(data, cb) {
                if (!dbconn) {
                    this.connect();
                }

                // create database
                dbconn.transaction(function (tx) {
                    WebSql.getCreateTableSql().forEach(function (statement) {
                        tx.executeSql(statement);
                    });
                }, function (err) {
                    cb([{ fatal: "'Could not create table: " + err.message + ")" }]);
                }, cb);
            },
            writable: true,
            configurable: true
        },
        insert: {
            value: function insert(data, cb) {
                if (!dbconn) {
                    this.connect();
                }

                dbconn.transaction(function (tx) {
                    tx.executeSql("DELETE FROM " + TABLENAME);

                    data.records.forEach(function (record) {
                        tx.executeSql("INSERT INTO " + TABLENAME + " (ssn, email, name, age) VALUES(?,?,?,?)", [record.ssn, record.email, record.name, record.age]);
                    });
                }, function (err) {
                    cb([{ fatal: "'Could not insert records: " + err.message + ")" }]);
                }, cb);
            },
            writable: true,
            configurable: true
        },
        singleByPK: {
            value: function singleByPK(data, cb) {
                this.singleByUI(data, cb, "pk", "ssn", "email");
            },
            writable: true,
            configurable: true
        },
        singleByUI: {
            value: function singleByUI(data, cb) {
                var stype = arguments[2] === undefined ? "ui" : arguments[2];
                var searchKey = arguments[3] === undefined ? "email" : arguments[3];
                var validationKey = arguments[4] === undefined ? "ssn" : arguments[4];
                if (!dbconn) {
                    this.connect();
                }

                dbconn.transaction(function (tx) {
                    var sql = "SELECT * FROM " + TABLENAME + " WHERE " + searchKey + "=\"" + data.single[stype][searchKey] + "\"";

                    tx.executeSql(sql, [], function (tx, results) {
                        if (results.rows.length === 1 && results.rows.item(0)[validationKey] === data.single[stype][validationKey]) {
                            cb();
                        } else {
                            cb([{ error: results.rows.length === 0 ? "No record found" : "Multiple records found" }]);
                        }
                    }, function (t, err) {
                        cb([{ fatal: "Could not run query: " + err.message }]);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        multiByPK: {
            value: function multiByPK(data, cb) {
                this.multiByUI(data, cb, "pk", "ssn");
            },
            writable: true,
            configurable: true
        },
        multiByUI: {
            value: function multiByUI(data, cb) {
                var stype = arguments[2] === undefined ? "ui" : arguments[2];
                var searchKey = arguments[3] === undefined ? "email" : arguments[3];
                if (!dbconn) {
                    this.connect();
                }

                dbconn.transaction(function (tx) {
                    var sql = "SELECT * FROM " + TABLENAME + " WHERE " + searchKey + " >= \"" + data.multi[stype][0][searchKey] + "\" AND " + searchKey + " <= \"" + data.multi[stype][1][searchKey] + "\"";

                    tx.executeSql(sql, [], function (tx, results) {
                        if (results.rows.length === data.multi.numberOfMatches) {
                            cb();
                        } else {
                            cb([{ error: "Found " + results.rows.length + " records instead of " + data.multi.numberOfMatches }]);
                        }
                    }, function (t, err) {
                        cb([{ fatal: "Could not run query: " + err.message }]);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        multiByI: {
            value: function multiByI(data, cb) {
                this.multiByUI(data, cb, "i", "name");
            },
            writable: true,
            configurable: true
        },
        multiByNoI: {
            value: function multiByNoI(data, cb) {
                this.multiByUI(data, cb, "noi", "age");
            },
            writable: true,
            configurable: true
        }
    });

    return WebSql;
})(Testable);

module.exports = WebSql;

},{"./Testable":9}]},{},[1])


//# sourceMappingURL=bundle.js.map
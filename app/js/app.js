import Generator from './Generator';
import Benchmark from './Benchmark';
import IDB from './IDB';

let generator = Generator.instance;
let callable = Function.bind.bind(Function.call);

/*
let viewModel = {
    results: {},
    logger: {},
    config: {
        numberOfRecord: ko.observable(1000)
    }
};*/

let viewModel = {
    results: {},
    logger: {},
    config: {
        records: ko.observable(1000),
        seed: ko.observable(2345678901)
    }
};

class View {
    constructor(options) {
        this.idb = new IDB();
        new Benchmark().start(callable(IDB.prototype.setup, this.idb, {
            x: 10
        }), (duration) => {
            console.log('duration=' + duration);
        });


        $('[app-go]').click(() => {
            alert('x');
        });
    }

    render() {
        $('body').append('<h1>Hello</h1>');
        return this;
    }
}

$(() => {
    console.log("SETUP KO");
    ko.applyBindings(viewModel);
});

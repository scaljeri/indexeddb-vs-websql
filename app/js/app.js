import Generator from './Generator';
import Benchmark from './Benchmark';
import Log from './Log';
import IDB from './IDB';
import ViewModel from './ViewModel';

debugger;
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

/*
let viewModel = {
    results: {},
    logger: {},
    config: {
        records: ko.observable(1000),
        seed: ko.observable(2345678901),
        multiple: ko.observable(10)
    },
    tests: {
        dbType: ko.observable(true),
        setup: ko.observable(true),
        insert: ko.observable(true),

        primaryKey: ko.observable(true),
        uniqueIndex: ko.observable(true),

        multiPrimaryKey: ko.observable(true),
        multiUniqueIndex: ko.observable(true),
        multiIndex: ko.observable(true),
        multiNoIndex: ko.observable(true),
    }
};*/

class View {
    constructor(options) {
        this.viewModel = ViewModel.instance;

        /*
        this.idb = new IDB();
        new Benchmark().start(callable(IDB.prototype.setup, this.idb, {
            x: 10
        }), (duration) => {
            console.log('duration=' + duration);
            Log.instance.info(10, 'hello');
        });
        */
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        Log.instance.info(10, 'hello aes aerwgser gse rg sefawwegwe gweg');
        window.x = ViewModel.instance;


        $('[app-go]').click(() => {
            alert('x');
        });
    }

    render() {
        $('body').append('<h1>Hello</h1>');
        return this;
    }

    getViewModel() {
         return this.viewModel;
    }
}

$(() => {
    console.log("SETUP KO");
    ko.applyBindings(new View().getViewModel());
});

import Generator from './Generator';
import Benchmark from './Benchmark';
import Log from './Log';
import IDB from './IDB';
import ViewModel from './ViewModel';

let generator = Generator.instance;
let callable = Function.bind.bind(Function.call);

class View {
    constructor(options) {
        /*
        this.idb = new IDB();
        new Benchmark().start(callable(IDB.prototype.setup, this.idb, {
            x: 10
        }), (duration) => {
            console.log('duration=' + duration);
            Log.instance.info(10, 'hello');
        });
        */
        Log.instance.info(null, 'Ready to go');

        $(".config-form form").submit((event) => {
            event.preventDefault();

            this.go();
        });
    }

    go() {
    }
}

new View();

$(() => {
    ko.applyBindings(ViewModel.instance);
});

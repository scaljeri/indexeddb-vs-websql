import Generator from './Generator';
import Benchmark from './Benchmark';
import IDB from './IDB';

let generator = Generator.instance;
let callable = Function.bind.bind(Function.call);

class View {
    constructor(options) {
        this.idb = new IDB();
        new Benchmark().start(callable(IDB.prototype.setup, this.idb, {
            x: 10
        }), (duration) => {
            console.log('duration=' + duration);
        });


        $('[app-go]').click(() => {

        });
    }

    render() {
        $('body').append('<h1>Hello</h1>');
    }
}

new View().render();

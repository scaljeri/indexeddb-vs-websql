import TestRunner from './TestRunner';
import ViewModel from './ViewModel';
import Log from './Log';
import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

class View {
    constructor(options) {}

    setup() {
        $('[run-tests]').click((event) => {
            event.preventDefault();

            TestRunner.instance.run();
        });

        $('[download-data]').click((event) => {
            event.preventDefault();
            console.log('download');
        });

        Log.info(null, 'Ready to go!')
    }
}

$(() => {
    ko.applyBindings(ViewModel.instance);

    new View().setup();
});

import TestRunner from './TestRunner';
import ViewModel from './ViewModel';
import Log from './Log';

class View {
    constructor(options) {}

    setup() {
        Log.instance.info(null, 'Ready to go');

        $('[run-tests]').click((event) => {
            event.preventDefault();
            TestRunner.instance.run();
        });

        $('[download-data]').click((event) => {
            event.preventDefault();
            console.log('download');
        });
    }
}

$(() => {
    ko.applyBindings(ViewModel.instance);

    new View().setup();
});

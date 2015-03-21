import TestRunner from './TestRunner';
import ViewModel from './ViewModel';
import Log from './Log';

class View {
    constructor(options) {}

    setup() {
        Log.instance.info(null, 'Ready to go');

        $('.config-form form').submit((event) => {
            event.preventDefault();
            TestRunner.instance.run();
        });
    }
}

$(() => {
    ko.applyBindings(ViewModel.instance);

    new View().setup();
});

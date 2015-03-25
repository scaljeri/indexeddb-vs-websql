import TestRunner from './TestRunner';
import ViewModel from './ViewModel';
import Log from './Log';
import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

class View {
    constructor(options) {
    }

    setup() {
        $('[run-tests]').click((event) => {
            event.preventDefault();

            if (!this.busy) {
                this.busy = true;

                TestRunner.instance.run(() => {
                    "use strict";
                    this.busy = false;
                });
            }
            else {
                new Log().warn(null, 'In progress already! Please wait!');
            }
        });

        $('[download-data]').click((event) => {
            event.preventDefault();
            console.log('download');
        });

        new Log().info('Ready to go!');
    }
}

$(() => {
    ko.applyBindings(ViewModel.instance);

    new View().setup();
});

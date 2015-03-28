import TestRunner from './TestRunner';
import ViewModel from './ViewModel';
import Log from './Log';
import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

let vm = ViewModel.instance;

class View {
    constructor() {
        "use strict";
        let refs = {
                ls: LS,
                indexeddb: IDB,
                websql: WebSql
            },
            log = new Log({removable: false});

        for (let i = vm.engines().length - 1; i >= 0; i--) {
            if (!refs[vm.engines()[i].id].isAvailable()) {
                log.info(`${vm.engines()[i].name} is not available in your browser`);
            } else {
                vm.engines()[i].disabled(false);
            }
        }
        log.info('Ready to go');
    }

    setup() {
        $('[run-tests]').click((event) => {
            event.preventDefault();

            if (!this.busy) {
                this.busy = true;

                Log.clear();
                vm.clearTestData();

                TestRunner.instance.run(() => {
                    "use strict";
                    this.busy = false;
                });
            }
            else {
                new Log().warn('In progress already! Please wait (or reload this page)!!');
            }
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

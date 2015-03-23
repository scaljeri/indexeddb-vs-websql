import TestRunner from './TestRunner';
import ViewModel from './ViewModel';
import Log from './Log';
import IDB from './IDB';
import WebSql from './WebSql';
import LS from './LS';

class View {
    constructor(options) {}

    setup() {
        Log.create(
            LS.supported ? 'info' : 'error',
            null,
            'LocalStorage is ' + (LS.supported ? '' : 'not') + ' supported');

        Log.create(
            IDB.supported ? 'info' : 'error',
            null,
            'IndexedDB is ' + (IDB.supported ? '' : 'not') + ' supported');

        Log.create(
            WebSql.supported ? 'info' : 'error',
            null,
            'WebSQL is ' + (WebSql.supported ? '' : 'not') + ' supported');

        $('[run-tests]').click((event) => {
            event.preventDefault();
            console.log("NOF=" + ViewModel.instance.config.records());
            //TestRunner.instance.run();
            console.log(TestRunner.instance.data[1]);
            console.log(TestRunner.instance.data.length);
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

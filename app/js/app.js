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
            //var dialog = document.querySelector('dialog.dialog-sql');
            //dialogPolyfill.registerDialog(dialog);
            // Now dialog acts like a native <dialog>.
            $('dialog.dialog-sql').get(0).showModal();
            /*TestRunner.instance.getData((data) => {
                let output = WebSql.getCreateTableSql();

                data.records.forEach((r) => {
                    "use strict";

                    output.push(`INSERT INTO customers (ssn, email, name, age) VALUES("${r.ssn}", "${r.email}", "${r.name}", ${r.age});`);
                });
                var pom = document.createElement('a');
                pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output.join('')));
                pom.setAttribute('download', 'dump.sql');

                pom.style.display = 'none';
                document.body.appendChild(pom);

                pom.click();

                document.body.removeChild(pom);
            }); */
        });
    }
}

function download(event) {
    "use strict";
    event.preventDefault();

    if (event.target.textContent === 'MySQL') {
       uploadSQL('mysql-dump.sql', WebSql.getCreateTableSql('mysql'));

    } else if (event.target.textContent === 'SQLite') {
        uploadSQL('sqlite-dump.sql', WebSql.getCreateTableSql('sqlite'));
    }

    this.closest('dialog').close();
}

function uploadSQL(filename, sql) {
    "use strict";


    TestRunner.instance.getData((data) => {
        data.records.forEach((r) => {
            "use strict";

            sql.push(`INSERT INTO customers (ssn, email, name, age) VALUES("${r.ssn}", "${r.email}", "${r.name}", ${r.age});`);
        });

        let pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sql.join('')));
        pom.setAttribute('download', filename);

        pom.style.display = 'none';
        document.body.appendChild(pom);

        pom.click();

        document.body.removeChild(pom);
        new Log().info(`Uploading file '${filename}'`);
    });
}

$(() => {
    ko.applyBindings(ViewModel.instance);

    new View().setup();

    $('[supported-db-types]').click(download);
});

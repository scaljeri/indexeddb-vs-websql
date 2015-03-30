import Generator from './Generator';

self.addEventListener('message', (e) => {
    "use strict";
    let records = e.data[0];
    let seed = e.data[1];
    let multiple = e.data[2];

    let testData = Generator.create(records, seed, multiple);
    self.postMessage(testData);
});


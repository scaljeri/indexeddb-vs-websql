"use strict";

import ViewModel from './ViewModel';

let vm = ViewModel.instance;

export default class State {
    constructor(engineSettings, engine) {
        this.testIndex = 0;
        this.engineSettings = engineSettings;
        this.engine = engine;
    }

    getTest() {
        return vm.tests[this.testIndex];
    }

    getEngine() {
        return this.engine;
    }

    hasNextTest() {
        return vm.tests.length > (this.testIndex + 1);
    }
    getTestName() {
        return vm.tests[this.testIndex].name;
    }

    nextTest() {
        return vm.tests[++this.testIndex];
    }

    isTestAvailable() {
        return vm.tests[this.testIndex].enabled;
    }

    startTest() {
        this.engineSettings.tests[this.testIndex].state('busy');
    }

    endTest(status, duration='') {
        this.engineSettings.tests[this.testIndex].state(status);
        this.engineSettings.tests[this.testIndex].duration(duration);
    }
}

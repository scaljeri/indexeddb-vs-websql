let output = [{skipped: true}];
export default class Testable {
    constructor() {
    }

    setup () {
        throw this.__proto__.constructor.name + ": Setup is not implemented";
    }

    static isAvailable() {
        "use strict";
        return false;
    }

    setup() {
        "use strict";
        arguments[arguments.length - 1](output);
    }

    insert() {
        "use strict";
        arguments[arguments.length - 1](output);
    }

    singleByPK() {
        "use strict";
        arguments[arguments.length - 1](output);
    }

    singleByUI() {
        "use strict";
        arguments[arguments.length - 1](output);
    }

    multiByPK() {
        "use strict";

        arguments[arguments.length - 1](output);
    }

    multiByUI() {
        "use strict";

        arguments[arguments.length - 1](output);
    }

    multiByI() {
        "use strict";

        arguments[arguments.length - 1](output);
    }

    multiByNoI() {
        "use strict";

        arguments[arguments.length - 1](output);
    }
}

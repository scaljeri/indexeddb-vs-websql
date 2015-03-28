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
        arguments[arguments.length - 1]({status: 'skip'});
    }

    insert() {
        "use strict";
        arguments[arguments.length - 1]({status: 'skip'});
    }

    singleByPK() {
        "use strict";
        arguments[arguments.length - 1]({status: 'skip'});
    }

    singleByUI() {
        "use strict";
        arguments[arguments.length - 1]({status: 'skip'});
    }

    multiByPK() {
        "use strict";

        arguments[arguments.length - 1]({status: 'skip'});
    }

    multiByUI() {
        "use strict";

        arguments[arguments.length - 1]({status: 'skip'});
    }

    multiByI() {
        "use strict";

        arguments[arguments.length - 1]({status: 'skip'});
    }

    multiByNoI() {
        "use strict";

        arguments[arguments.length - 1]({status: 'skip'});
    }
}

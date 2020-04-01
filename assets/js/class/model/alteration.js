const __status = {};

class State {
    constructor (params) {}
}

class Status extends State {
    constructor (params) {
        super(params);
        params = params || {};
        this.techName = params.techName;
        this.name = params.name;
        this.description = params.description;
        this.states = params.states;

        __status[this.techName] = this;
    }

    /**
     * Returns the instance of the wanted status.
     *
     * @static
     * @param {string} name The `techName` of the wanted `Status`
     * @returns {Status|boolean} The status or false if it doesn't exist.
     */
    static get(name) {
        return __status[name] || false;
    }
}

class Alteration extends State {
    constructor (params) {}
}


// Creation of status.
new Status({
    techName: 'ko',
    name: "KO",
    description: "A GenoSprite cannot stand anymore during a fight if it's KO.",
    states: {
        canAttack: false,
        canBeHealed: false,
        canBeTargetet: false,
        gainPE: false
    }
});
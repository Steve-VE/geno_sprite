const skillList = {};

class Skill {
    constructor (params) {
        this.techName = params.techName;
        this.name = params.name;
        this.categ = params.categ;
        this.numberOfTarget = params.numberOfTarget || 1;
        this.description = params.description;
        this.cost = params.cost;
        this.power = params.power;
        this.numberOfTarget = params.numberOfTarget || 1;

        skillList[this.techName] = this;
    }

    /**
     * Is called when the skill is selected in the combat menu.
     *
     * @param {GenoSprite} caster
     */
    isSelected (caster) {
        gameContainer.battleZone.waitingSkill = this;
        const prom = new Promise((resolve, reject) => {
            // Waiting for a target
            this.resolveSelection = resolve;
            this.rejectSelection = reject;
        });
        return prom.then((target) => {
            if (gameContainer.battleZone.waitingSkill === this) {
                gameContainer.battleZone.waitingSkill = undefined;
            }
            return {
                caster: caster,
                skill: this,
                target: target,
            };
        });
    }
}


if (GAME.DEBUG_MODE) {
    console.log(
        '%c-- Loading Skills',
        'font-weight: bold; font-size: 1.2em;'
    );
}
for (const attack of Object.entries(SKILL_DATA.ATTACK)) {
    const data = attack[1];
    data.techName = attack[0];

    if (GAME.DEBUG_MODE) {
        console.groupCollapsed(`[${data.techName}] data`);
        console.table(data);
        console.groupEnd();
    }
    new Skill(data);
}

class SelfTargetingSkill extends Skill {
    constructor (params) {
        super(params);
        this.numberOfTarget = 0;
    }

    /**
     * @override
     */
    isSelected (caster) {
        return Promise.resolve({
            caster: caster,
            skill: this,
            target: caster,
        });
    }
}


for (const attack of Object.entries(SKILL_DATA.SELF)) {
    const data = attack[1];
    data.techName = attack[0];

    if (GAME.DEBUG_MODE) {
        console.groupCollapsed(`[${data.techName}] data`);
        console.table(data);
        console.groupEnd();
    }
    new SelfTargetingSkill(data);
}

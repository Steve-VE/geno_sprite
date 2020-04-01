const skillList = {};

class Skill {
    constructor (params) {
        const options = params.options || {};
        this.sentence = params && params.sentence;
        this.techName = params.techName;
        this.icon = params.icon;
        this.name = params.name;
        this.categ = params.categ;
        this.description = params.description;
        this.cost = params.cost;
        this.power = params.power;
        this.numberOfTarget = params.numberOfTarget || 1;
        this.canTargetSelf = options.selfTargeting || false;
        this.canTargetGenoSprite = this.techName === 'move' ? false : true;

        skillList[this.techName] = this;
    }

    canTarget (target) {
        const caster = gameContainer.battleZone.activeGenoSprite;
        if (target === caster) {
            return this.canTargetSelf;
        }
        return target.isNot('ko');
    }

    /**
     * Computes and returns the damage made by the caster to the target.
     *
     * @param {GenoSprite} caster
     * @param {GenoSprite} target
     * @returns {integer}
     */
    computeDamage (caster, target) {
        let coef = 1;
        if (this.categ === 'cerebral') {
            if (caster.psy > target.psy) {
                coef = 1.2;
            } else if (caster.psy < target.psy) {
                coef = 0.8;
            }
            return Math.round(this.power * coef);
        } else if (this.categ === 'magic') {
            if (caster.atk > target.def) {
                coef = 1.2;
            } else if (caster.atk < target.def) {
                coef = 0.8;
            }
            return Math.round(this.power * coef);
        } else if (this.categ === 'physical') {
            const targetDef = (target.def * 0.3) + (target.mgc * 0.7);
            if (caster.mgc > targetDef) {
                coef = 1.2;
            } else if (caster.mgc < targetDef) {
                coef = 0.8;
            }
            return Math.round(this.power * coef);
        }
    }

    /**
     * Returns how fast this skill wil be cast .
     *
     * @param {GenoSprite} caster
     */
    defineSpeed (caster) {
        return caster.spd;
    }

    getDisclaimer (caster, target) {
        let disclaimer = this.sentence;
        if (!disclaimer) {
            if (this.categ === 'magic') {
                disclaimer = "{c} casts {s} on {t} !";
            } else {
                disclaimer = "{c} attacks {t} with {s} !";
            }
        }
        return this._formatDisclaimer(disclaimer, ...arguments);
    }

    /**
     * Is called when the skill is selected in the combat menu.
     *
     * @param {GenoSprite} caster
     * @param {GenoSprite} target
     */
    isSelected (caster, target) {
        if (target) {
            return Promise.resolve({
                caster: caster,
                skill: this,
                target: target,
            });
        } else {
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

    resolveEffect (caster, target) {
        if (this.cost) {
            caster.pe -= this.cost;
        }
        const damage = this.computeDamage(...arguments);
        if (damage) {
            return target.takeDamage(damage);
        } else {
            return Promise.resolve();
        }
    }

    _formatDisclaimer (disclaimer, caster, target) {
        const casterName = caster && `<span class='caster'>${caster.name}</span>`;
        const targetName = target && `<span class='target'>${target.name}</span>`;
        const skillName = `<span class='skill'>${this.name}</span>`;
        disclaimer = disclaimer.replace('{c}', casterName);
        disclaimer = disclaimer.replace('{t}', targetName);
        disclaimer = disclaimer.replace('{s}', skillName);
        return disclaimer;
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
        this.canTargetSelf = true;
    }

    /**
     * @override
     */
    computeDamage () { return 0; }

    getDisclaimer (caster) {
        const disclaimer = this.sentence || "{c} casts {s} !";
        return this._formatDisclaimer(disclaimer, ...arguments);
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

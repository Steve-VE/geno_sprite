const skillList = {};

class Skill {
    constructor (techName, name, categ, numberOfTarget=1) {
        this.techName = techName;
        this.name = name;
        this.categ = categ;
        this.numberOfTarget = numberOfTarget;

        skillList[this.techName] = this;
    }

    /**
     * Is called when the skill is selected in the combat menu.
     */
    isSelected () {
        gameContainer.battleZone.waitingSkill = this;
        const prom = new Promise((resolve, reject) => {
            // Waiting for a target
            this.resolveSelection = resolve;
        });
        prom.then((target) => {
            this.target = target;
            if (gameContainer.battleZone.waitingSkill === this) {
                gameContainer.battleZone.waitingSkill = undefined;
            }
        });
        return prom;
    }
}

new Skill('bite', 'Bite', 'physical');
new Skill('psy_shock', 'Psy Shock', 'mental');
new Skill('punch', 'Punch', 'physical');
new Skill('sparkle_pop', 'Sparkle Pop', 'magic');

class SelfTargetingSkill extends Skill {
    /**
     * Is called when the skill is selected in the combat menu.
     */
    isSelected () {
        gameContainer.battleZone.waitingSkill = this;
        const prom = new Promise((resolve, reject) => {
            // Waiting for a target
            this.resolveSelection = resolve;
        });
        prom.then(() => {
            if (gameContainer.battleZone.waitingSkill === this) {
                gameContainer.battleZone.waitingSkill = undefined;
            }
        });
        return prom;
    }
}

new Skill('defend', 'Defend', 'physical');
new Skill('energizer', 'Energizer', 'magic');
new Skill('focus', 'Focus', 'mental');

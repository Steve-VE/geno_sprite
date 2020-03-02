const skillList = {};

class Skill {
    constructor (techName, name, categ, numberOfTarget=1) {
        this.techName = techName;
        this.name = name;
        this.categ = categ;
        this.numberOfTarget = numberOfTarget;

        skillList[this.techName] = this;
    }
}

new Skill('bite', 'Bite', 'physical');
new Skill('defend', 'Defend', 'physical');
new Skill('energizer', 'Energizer', 'magic');
new Skill('focus', 'Focus', 'mental');
new Skill('psy_shock', 'Psy Shock', 'mental');
new Skill('punch', 'Punch', 'physical');
new Skill('sparkle_pop', 'Sparkle Pop', 'magic');

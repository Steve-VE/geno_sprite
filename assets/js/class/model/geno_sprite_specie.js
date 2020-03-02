const specieList = {};

class GenoSpriteSpecie {
    constructor (techName, name, defaultSkillList, extendedSkillList) {
        this.techName = techName;
        this.name = name;
        this.defaultSkillList = defaultSkillList || [];
        this.extendedSkillList = extendedSkillList || [];

        specieList[techName] = this;
    }
}

new GenoSpriteSpecie('punch_boy', 'PunchBoy', ['punch', 'defend', 'focus']);
new GenoSpriteSpecie('smarty', 'Smarty', ['psy_shock', 'focus', 'energizer']);
new GenoSpriteSpecie('magic_hat', 'MagicHat', ['sparkle_pop', 'energizer', 'defend']);
new GenoSpriteSpecie('biter_bug', 'BiterBug', ['bite']);

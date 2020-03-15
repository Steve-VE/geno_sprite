const specieList = {};

class GenoSpriteSpecie {
    constructor (params) {
        this.techName = params.techName;
        this.name = params.name;
        this.stat = params.stat;
        this.defaultSkillList = params.skill || [];
        this.extendedSkillList = params.skill || [];

        specieList[this.techName] = this;
    }
}


if (GAME.DEBUG_MODE) {
    console.log(
        '%c-- Loading Species',
        'font-weight: bold; font-size: 1.2em;'
    );
}
for (const specie of Object.entries(SPECIE_DATA)) {
    const data = specie[1];
    data.techName = specie[0];

    if (GAME.DEBUG_MODE) {
        console.groupCollapsed(`[${data.techName}] data`);
        console.log('Stats:');
        console.table(data.stat);
        console.log('Skills:');
        console.table(data.skill);
        console.groupEnd();
    }

    new GenoSpriteSpecie(data);
}

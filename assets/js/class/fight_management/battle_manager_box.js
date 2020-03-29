class BattleManagerBox {
    constructor () {
        this.html = document.createElement('div');
        this.html.classList.add('battle-manager-box');
        this.choiceBoxes = [];

        // Skill selection zone.
        this.skillSelectionBox = document.createElement('div');
        this.skillSelectionBox.classList.add('skill-select-box');

        // GenoSprite stats zone.
        this.statBox = document.createElement('div');
        this.statBox.classList.add('stat-box');

        this.genoSprites = [];

        this.html.append(this.skillSelectionBox, this.statBox);
        document.body.append(this.html);
    }

    createSkillBox (genoSprite) {
        const choiceBox = new ChoiceBox({
            parent: this,
            owner: genoSprite,
        });
        // const choiceList = document.createElement('ul');
        // choiceList.dataset.genoSpriteId = genoSprite.id;
        for (const skill of genoSprite.skills) {
            choiceBox.addChoice({skill: skill});
        }
        // if (this.genoSprites.length === 1) {
        //     choiceList.classList.add('active');
        // }
        this.choiceBoxes.push(choiceBox);
        this.skillSelectionBox.append(choiceBox.html);
    }

    reset () {
        for (const choiceBox of this.choiceBoxes) {
            choiceBox.unselectChoice();
        }
    }

    /**
     * Add the tracking for a GenoSprite (skills list + PV/PE bar).
     *
     * @param {GenoSprite} genoSprite
     */
    track (genoSprite) {
        this.genoSprites.push(genoSprite);
        const statBar = genoSprite.statBar;
        const name = document.createElement('h3');
        name.classList.add('name');
        name.innerText = genoSprite.name;
        const container = document.createElement('div');
        container.classList.add('container');
        container.append(statBar.html, name);
        this.statBox.append(container);

        this.createSkillBox(genoSprite);
    }
}

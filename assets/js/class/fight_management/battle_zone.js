class BattleZone {
    constructor () {
        gameContainer.battleZone = this;
        this.disclaimer = new Disclaimer();

        this.state = 'skill_selection';
        this.turnCount = 0;
        this.tiles = [];
        for (let y = 0; y < 3; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < 3; x++) {
                this.tiles[y][x] = new BattleTile(x, y, true);
                this.tiles[y][x + 3] = new BattleTile(x + 3, y, false);
            }
        }
        this.battlegroundWidth = fightTile.width * 6;
        this.battlegroundHeight = fightTile.height * 3;
        this.x = (GAME.WIDTH - this.battlegroundWidth) * 0.5;
        // this.y = (GAME.HEIGHT - this.battlegroundHeight) * 0.8;
        this.y = 200;
        this.skillStack = {};
        this.team = [[], []];
        this.battleManagerBox = new BattleManagerBox();
        this.nbreOfActiveGenoSprites = 0;
        this.addGenoSprite(2, 0, '01', 'punch_boy');
        this.addGenoSprite(0, 1, '02', 'smarty');
        this.addGenoSprite(1, 2, '03', 'magic_hat');
        this.addGenoSprite(3, 0, '04', 'biter_bug');
        // this.addGenoSprite(4, 1, '04', 'biter_bug');
        this.addGenoSprite(3, 2, '04', 'biter_bug');

        this.opponentsMakeChoice();
        this.needToBeRedraw = true;
    }

    addGenoSprite (x, y, spriteIndex, name) {
        const teamIndex = (x < 3) ? 0: 1;
        const genoSprite = new GenoSprite({
            x: x,
            y: y,
            specie: name,
            spriteIndex: spriteIndex,
            playerTeam: (teamIndex === 0),
        });
        if (teamIndex === 0){
            this.battleManagerBox.track(genoSprite);
            if (!this.activeGenoSprite) {
                genoSprite.select();
                this.activeTile = this.tiles[y][x];
            }
        }
        this.nbreOfActiveGenoSprites++;
        this.team[teamIndex].push(genoSprite);
        genoSprite.attachToTile(this.tiles[y][x]);
    }

    addSkillToStack (skill) {
        const casterId = skill.caster.id;
        this.skillStack[casterId] = skill;
        console.log(this.skillStack);
    }

    draw () {
        if (this.needToBeRedraw) {
            gameContainer.context.fillStyle = 'rgb(230, 200, 150)';
            gameContainer.context.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
        }
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 6; x++) {
                this.tiles[y][x].draw(this.x, this.y, this.needToBeRedraw);
            }
        }
        this.needToBeRedraw = false;
    }

    get genoSprites () {
        return this.team[0].concat(this.team[1]);
    }

    /**
     * Unselects the current selected GenoSprite and selects the next one.
     */
    nextGenoSprite () {
        const readyGenoSpriteIds = Object.keys(this.skillStack);
        for (const genoSprite of this.team[0]) {
            if (genoSprite.is('ko')) {
                continue;
            }
            if (readyGenoSpriteIds.indexOf(genoSprite.id) === -1) {
                genoSprite.select();
                return;
            }
        }
        if (this.state === 'skill_selection') {
            this.state = 'fight_setup';
        }
    }

    opponentsMakeChoice () {
        const playerTeam = this.team[0];
        const opponentTeam = this.team[1];
        for (const caster of opponentTeam) {
            const selectedSkill = caster.choiceSkill();

            if (selectedSkill.constructor.name === 'SelfTargetingSkill') {
                // Self targeting skill, easy to define.
                selectedSkill.isSelected(caster).then((result) => {
                    this.skillStack[caster.id] = result;
                });
            } else {
                // For other skills, needs target(s) !
                const targetIndex = Math.floor(Math.random() * playerTeam.length);
                selectedSkill.isSelected(caster, playerTeam[targetIndex]).then((result) => {
                    this.skillStack[caster.id] = result;
                });
            }
        }
    }

    prepareNewTurn () {
        this.turnCount++;
        // No more skill in the stack, prepares to a new turn.
        for (const genoSprite of this.genoSprites) {
            genoSprite.upkeep();
        }
        this.battleManagerBox.reset();
        this.opponentsMakeChoice();
        this.nextGenoSprite();
        this.state = 'skill_selection';
    }

    resetTargetable () {
        this.waitingSkill = undefined;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 6; x++) {
                this.tiles[y][x].isTargetable = false;
            }
        }
        for (const genoSprite of this.genoSprites) {
            genoSprite.isTargetable = false;
        }
        refresh();
    }

    selectGenoSprite (genoSprite) {
        if (!genoSprite.playerTeam) {
            // Can't select an opponent GenoSprite.
            return;
        }
        if (this.activeGenoSprite === genoSprite) {
            // Can't select the GenoSprite who is already selected.
            return;
        }
        genoSprite.select();
    }

    update () {
        if (this.state === 'skill_selection') {
            if (Object.keys(this.skillStack).length >= this.nbreOfActiveGenoSprites) {
                this.state = 'fight_setup';
            }
        } else if (this.state === 'fight_setup') {
            // Removes dialogBoxes.
            for (const genoSprite of this.team[0]) {
                genoSprite.hideDialogBox();
            }
            this.activeGenoSprite.unselect();

            // Sorts the skills' stack to resolve faster skill before.
            const sortedSkills = [];
            for (const data of Object.entries(this.skillStack)) {
                const skillChoice = data[1];
                const caster = skillChoice.caster;
                const skill = skillChoice.skill;
                const speed = skill.defineSpeed(caster);

                if (!sortedSkills.length) {
                    sortedSkills.push([speed, skillChoice]);
                } else {
                    let mustBeAdded = true;
                    for (const index in sortedSkills) {
                        const sortedData = sortedSkills[index];
                        if (sortedData[0] <= speed) {
                            sortedSkills.splice(index, 0, [speed, skillChoice]);
                            mustBeAdded = false;
                            break;
                        }
                    }
                    if (mustBeAdded) {
                        sortedSkills.push([speed, skillChoice]);
                    }
                }
            }
            this.skillStack = sortedSkills;
            this.state = 'damage_step';
        } else if (this.state === 'damage_step') {
            if (this.skillStack.length) {
                // Get back the skill from the stack.
                if (this.currentSkill === undefined) {
                    const item = this.skillStack.splice(0, 1)[0];
                    const [priority, choice] = [item[0], item[1]];
                    let {caster, skill, target} = choice;
                    let promMessage = Promise.resolve();
                    // The GenoSprite can act only if it isn't KO.
                    if (caster.isNot('ko')) {
                        // If the GenoSprite can't cast anymore the selected skill,
                        // it will do nothing instead.
                        if (!caster.canPayTheCost(skill)) {
                            skill = skillList.do_nothing;
                        }
                        // Resolves the skill effect.
                        this.currentSkill = skill.resolveEffect(caster, target);
                        promMessage = this.disclaimer.setMessage(skill.getDisclaimer(caster, target));
                    }

                    Promise.all([this.currentSkill, promMessage]).then(() => {
                        this.currentSkill = undefined;

                        if (this.skillStack.length === 0) {
                            this.state = 'prepare_next_turn';
                            this.prepareNewTurn();
                        }
                    });
                }
            }
        }
    }
}

class Disclaimer {
    constructor () {
        this.html = document.createElement('div');
        this.html.classList.add('disclaimer');
        this.message = document.createElement('div');
        this.message.classList.add('message');
        this.message.innerText = "Coucou Bilou !";
        this.html.append(this.message);
        document.body.append(this.html);
    }

    setMessage(msg) {
        const prom = new Promise((resolve, reject) => {
            this.message.innerHTML = msg;
            this.message.addEventListener('animationend', () => {
                this.message.innerHTML = '';
                this.message.classList.remove('fade-out');
                resolve();
            });
            this.message.classList.add('fade-out');
        });
        return prom;
    }
}

class BattleZone {
    constructor () {
        gameContainer.battleZone = this;

        this.state = 'skill_selection';
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
        this.skillStack = {};
        this.team = [[], []];
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
        if (teamIndex === 0 && !this.activeGenoSprite) {
            genoSprite.isActive = true;
            this.activeGenoSprite = genoSprite;
            this.activeTile = this.tiles[y][x];
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
            this.needToBeRedraw = false;
            gameContainer.context.fillStyle = 'rgb(230, 200, 150)';
            gameContainer.context.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
        }
        const posX = (GAME.WIDTH - this.battlegroundWidth) * 0.5;
        const posY = (GAME.HEIGHT - this.battlegroundHeight) * 0.8;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 6; x++) {
                this.tiles[y][x].draw(posX, posY);
            }
        }
    }

    /**
     * Unselects the current selected GenoSprite and selects the next one.
     */
    nextGenoSprite () {
        const genoSprite = this.searchNextGenoSprite(this.activeTile.pos.x, this.activeTile.pos.y);
        if (genoSprite) {
            this.selectGenoSprite(genoSprite);
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

    searchNextGenoSprite (x, y) {
        x += 1;
        if (x >= this.tiles[y].length) {
            x = 0;
            y += 1;
        }
        if (y >= this.tiles.length) {
            return undefined;
        }
        const tile = this.tiles[y][x];
        if (tile.genoSprite && tile.genoSprite.playerTeam) {
            return tile.genoSprite;
        } else {
            return this.searchNextGenoSprite(x, y);
        }
    }

    selectGenoSprite (genoSprite) {
        if (!genoSprite.playerTeam) {
            return;
        }
        if (this.activeGenoSprite) {
            if (this.activeGenoSprite === genoSprite) {
                return;
            }
            this.activeGenoSprite.isActive = false;
        }
        this.activeGenoSprite = genoSprite;
        this.activeGenoSprite.select();
        this.activeTile = this.tiles[this.activeGenoSprite.position.y][this.activeGenoSprite.position.x];
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

            // Resolves skills' stack.
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
                    if (caster.pv <= 0) {
                        skill = skillList.do_nothing;
                    }
                    // Resolves the skill effect.
                    this.currentSkill = skill.resolveEffect(caster, target);

                    this.currentSkill.then(() => {
                        this.currentSkill = undefined;
                    });
                }
            } else {
                // No more skill in the stack, prepares to a new turn.
                for (const genoSprite of this.team[0].concat(this.team[1])) {
                    genoSprite.pe += Math.round(genoSprite.peMax / 10);
                    if (genoSprite.playerTeam) {
                        genoSprite.resetDialogBox();
                    }
                }
                this.selectGenoSprite(this.team[0][0]);
                this.opponentsMakeChoice();
                this.state = 'skill_selection';
            }
        }
    }
}

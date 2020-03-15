class BattleZone {
    constructor () {
        gameContainer.battleZone = this;

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
        this.addGenoSprite(4, 1, '04', 'biter_bug');
        this.addGenoSprite(3, 2, '04', 'biter_bug');

        this.opponentsMakeChoice();
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
        const posX = (GAME.WIDTH - this.battlegroundWidth) * 0.5;
        const posY = (GAME.HEIGHT - this.battlegroundHeight) * 0.8;

        gameContainer.context.fillStyle = 'rgb(230, 200, 150)';
        gameContainer.context.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

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
        this.activeGenoSprite.isActive = false;
        let x = this.activeTile.x;
        let y = this.activeTile.y;

        const genoSprite = this.searchNextGenoSprite(x, y);
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
                const targetIndex = Math.floor(Math.random() * (playerTeam.length + 1));
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
        this.activeGenoSprite = genoSprite;
        this.activeGenoSprite.isActive = true;
        this.activeGenoSprite.displayDialogBox();
        this.activeTile = this.tiles[this.activeGenoSprite.position.y][this.activeGenoSprite.position.x];
    }

    update () {
        if (Object.keys(this.skillStack).length < this.nbreOfActiveGenoSprites) {
            // Skill selection state.
        } else {
            // Resolves skills' stack.
        }
    }
}

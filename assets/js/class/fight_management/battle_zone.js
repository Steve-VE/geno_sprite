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
        this.team = [[], []];
        this.addGenoSprite(2, 0, '01', 'punch_boy');
        this.addGenoSprite(0, 1, '02', 'smarty');
        this.addGenoSprite(1, 2, '03', 'magic_hat');
        this.addGenoSprite(3, 0, '04', 'biter_bug');
        this.addGenoSprite(4, 1, '04', 'biter_bug');
        this.addGenoSprite(3, 2, '04', 'biter_bug');
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
        this.team[teamIndex].push(genoSprite);
        genoSprite.attachToTile(this.tiles[y][x]);
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
}

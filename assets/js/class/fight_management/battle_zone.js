class BattleZone {
    constructor () {
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

        this.addGenoSprite(2, 0, '01');
        this.addGenoSprite(0, 1, '02');
        this.addGenoSprite(1, 2, '03');
        this.addGenoSprite(3, 0, '04');
        this.addGenoSprite(4, 1, '04');
        this.addGenoSprite(3, 2, '04');
    }

    addGenoSprite (x, y, spriteIndex) {
        const genoSprite = new GenoSprite({
            x: x,
            y: y,
            spriteIndex: spriteIndex,
        })
        const tile = this.tiles[y][x];
        genoSprite.attachToTile(tile);
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
}

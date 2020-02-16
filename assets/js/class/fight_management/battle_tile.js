class BattleTile {
    constructor (x, y, camp) {
        this.x = x;
        this.y = y;
        this.camp = camp; // true = player, false = opponent
        this.genoSprite = undefined;
    }

    draw (shiftX, shiftY) {
        const x = shiftX + (fightTile.width * this.x);
        const y = shiftY + (fightTile.height * this.y);
        if (GAME.DEBUG_MODE) {
            gameContainer.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
            gameContainer.context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            gameContainer.context.fillRect(x, y, fightTile.width, fightTile.height);
            gameContainer.context.strokeRect(x, y, fightTile.width, fightTile.height);
        } else {
            const margin = 4;
            const margin_x_2 = margin * 2;
            if (this.isActive) {
                gameContainer.context.fillStyle = 'rgba(255, 255, 255, 0.4)';
                gameContainer.context.strokeStyle = 'rgb(255, 255, 255)';
                gameContainer.context.strokeRect(
                    x + margin,
                    y + margin,
                    fightTile.width - (margin_x_2),
                    fightTile.height - (margin_x_2)
                );
            } else {
                gameContainer.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
            }
            gameContainer.context.fillRect(
                x + margin,
                y + margin,
                fightTile.width - (margin_x_2),
                fightTile.height - (margin_x_2)
            );
        }
        if (this.genoSprite) {
            this.genoSprite.draw(shiftX, shiftY);
        }
    }

    get isActive () {
        return (this.genoSprite && this.genoSprite.playerTeam && this.genoSprite.isActive);
    }
}

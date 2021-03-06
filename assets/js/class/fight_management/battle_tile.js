class BattleTile {
    constructor (x, y, camp) {
        this.pos = {
            x: x,
            y: y
        };
        this.x = x;
        this.y = y;
        this.camp = camp; // true = player, false = opponent
        this.genoSprite = undefined;

        clickableElement.push(this);
        this.needToBeRedraw = true;
    }

    draw (shiftX, shiftY, forced=false) {
        if (this.needToBeRedraw || forced) {
            this.x = shiftX + (fightTile.width * this.pos.x);
            this.y = shiftY + (fightTile.height * this.pos.y);
            this.needToBeRedraw = false;
            const margin = 4;
            const doubleMargin = margin * 2;
            if (this.isActive || this.isTargetable) {
                gameContainer.context.strokeStyle = 'rgb(255, 255, 255)';
                gameContainer.context.strokeRect(
                    this.x + margin,
                    this.y + margin,
                    fightTile.width - (doubleMargin),
                    fightTile.height - (doubleMargin)
                );
            }
            if (this.isActive) {
                gameContainer.context.fillStyle = 'rgba(255, 255, 255, 0.4)';
            } else {
                gameContainer.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
            }
            gameContainer.context.fillRect(
                this.x + margin,
                this.y + margin,
                fightTile.width - (doubleMargin),
                fightTile.height - (doubleMargin)
            );
        }
        if (this.genoSprite) {
            this.genoSprite.draw(shiftX, shiftY, forced);
        }
    }

    get isActive () {
        return (this.genoSprite && this.genoSprite.playerTeam && this.genoSprite.isActive);
    }

    get isFree () {
        return !this.genoSprite;
    }

    isClickedOn (x, y) {
        if (x < this.x || x > (this.x + fightTile.width) || y < this.y || y > (this.y + fightTile.height)) {
            return false;
        }
        return true;
    }

    onClick () {
        if (gameContainer.battleZone.state !== 'skill_selection') {
            return;
        }
        if (gameContainer.battleZone.waitingSkill) {
            // Targets the tile if the skill can.
            if (gameContainer.battleZone.waitingSkill.canTarget(this)) {
                gameContainer.battleZone.waitingSkill.resolveSelection(this);
            }
        } else if (this.genoSprite) {
            // Selects the GenoSprite standing on this tile.
            gameContainer.battleZone.selectGenoSprite(this.genoSprite);
        }
    }

    /**
     * Checks the given GenoSprite is the same team as the tile.
     *
     * @param {GenoSprite} genoSprite
     * @returns {boolean}
     */
    sameTeamAs (genoSprite) {
        return (this.pos.x < 3 === genoSprite.playerTeam);
    }
}

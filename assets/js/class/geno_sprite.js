let __geno_sprite_count = 0;

class GenoSprite {
    /**
     * @param {object} data
     * @param {string} data.name
     * @param {number} data.x
     * @param {number} data.y
     * @param {number} data.spriteIndex
     */
    constructor (data) {
        data = data || {};
        this.specie = specieList[data.specie];
        this.stat = this.specie.copyStat();

        this.name = data.name || this.specie.name || 'unnamed';
        this.id = this.getUniqId();
        console.log(this.id);
        this.position = {
            x: data.x || 0,
            y: data.y || 0,
        };
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.spriteIndex = data.spriteIndex || '01';

        this.sprite = new SpriteSheet({
            path: `battlesprites/${this.spriteIndex}.png`,
        });

        this.playerTeam = data.playerTeam || false;
        this.skill = [];
        clickableElement.push(this);
    }

    attachToTile (tile) {
        this.position = {
            x: tile.x,
            y: tile.y,
        };
        tile.genoSprite = this;
        if (this.playerTeam) {
            this.displayDialogBox();
        }
    }

    /**
     * Creates and displays the `DialogBox` to make the attac choice.
     */
    displayDialogBox () {
        // If the dialog box already exists, just activate it...
        if (this.dialogBox) {
            this.dialogBox.activate();
        } else { // ...otherwise, creates a new one.
            const dialogBox = new ChoiceBox(
                40,
                40 + (dialogBoxes.length * 200),
                true,
                this
            );
            for (const skillName of this.specie.defaultSkillList) {
                const skill = skillList[skillName];
                dialogBox.addChoice({
                    skill: skill,
                });
            }
            if (!activeDialogBox) {
                dialogBox.activate();
            }
            dialogBoxes.push(DialogBox);
            this.dialogBox = dialogBox;
        }
    }

    draw (shiftX, shiftY) {
        let posX = shiftX + (this.position.x * fightTile.width);
        let posY = shiftY + (this.position.y * fightTile.height);
        let spriteWidth = this.sprite.width * GAME.BATTLE_SPRITE_RATIO;
        const spriteHeight = this.sprite.height * GAME.BATTLE_SPRITE_RATIO;
        posX += (fightTile.width - spriteWidth) / 2;
        posY -= (fightTile.height  * 0.5);
        if (GAME.DEBUG_MODE) {
            gameContainer.context.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            gameContainer.context.strokeRect(
                posX,
                posY,
                spriteWidth,
                spriteHeight
            );
        }
        gameContainer.context.drawImage(
            this.sprite.image,
            0, 0,
            this.sprite.width,
            this.sprite.height,
            posX,
            posY,
            spriteWidth,
            spriteHeight
        );
        this.x = posX;
        this.y = posY;
        this.width = spriteWidth;
        this.height = spriteHeight;
    }


    isClickedOn (x, y) {
        if (x < this.x || x > (this.x + this.width) || y < this.y || y > (this.y + this.height)) {
            return false;
        }
        return true;
    }


    getUniqId () {
        __geno_sprite_count++;
        const number = String(__geno_sprite_count).padStart(4, 0);
        return `${this.specie.techName}_${number}`;
    }

    onClick () {
        if (gameContainer.battleZone.waitingSkill) {
            // Target a GenoSprite for a skill.
            gameContainer.battleZone.waitingSkill.resolveSelection(this);
        } else if (this.playerTeam) {
            // Click on a player's GenoSprite.
            this.displayDialogBox();
        }
    }
}

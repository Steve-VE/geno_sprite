class GenoSprite {
    constructor (data) {
        data = data || {};
        this.name = data.name || 'unnamed';
        this.position = {
            x: data.x || 0,
            y: data.y || 0,
        };
        this.spriteIndex = data.spriteIndex || '01';

        this.sprite = new SpriteSheet({
            path: `battlesprites/${this.spriteIndex}.png`,
        });

        this.playerTeam = data.playerTeam || false;
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

    displayDialogBox () {
        // Create the dialog box for the attack choice.
        if (this.dialogBox) {
            this.dialogBox.activate();
        } else {
            const dialogBox = new ChoiceBox(40, 40 + (dialogBoxes.length * 200));
            dialogBox.addChoice('Attaquer');
            dialogBox.addChoice('Se Défendre');
            dialogBox.addChoice('Se Concentrer');
            dialogBox.setTitle(this.name);
            if (!activeDialogBox) {
                dialogBox.activate();
            }
            dialogBoxes.push(DialogBox);
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
    }
}

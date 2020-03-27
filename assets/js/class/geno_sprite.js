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
        this.setStats();

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
        this.skills = [];
        for (const skillName of this.specie.defaultSkillList) {
            this.skills.push(skillList[skillName]);
        }
        clickableElement.push(this);
        this.needToBeRedraw = true;
        this.sprite.onLoad(() => {
            this.needToBeRedraw = true;
        });
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

    choiceSkill () {
        const availableSkills = [];
        for (const skill of this.skills) {
            if (skill.cost < this.pe) {
                availableSkills.push(skill);
            }
        }

        if (availableSkills.length === 1) {
            return availableSkills[0];
        } else if (availableSkills.length > 1) {
            const skillIndex = Math.floor(Math.random() * availableSkills.length);
            return availableSkills[skillIndex];
        } else {
            return skillList.do_nothing;
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
            for (const skill of this.skills) {
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
        if (this.needToBeRedraw) {
            console.log(this.name + " is redraw");
            if (this.sprite.image.complete) {
                this.needToBeRedraw = false;
            } else {
                return;
            }
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
            // Draws the shadow.
            gameContainer.context.fillStyle = 'rgba(0, 0, 0, 0.22';
            gameContainer.context.beginPath();
            gameContainer.context.ellipse(
                shiftX + (this.position.x * fightTile.width) + (fightTile.width / 2),
                shiftY + (this.position.y * fightTile.height) + (fightTile.height / 1.5),
                40, 20,
                0, 0, 360);
            gameContainer.context.fill();
            // Draws the sprite.
            gameContainer.context.setTransform(1, 0, 0, 1, posX + (spriteWidth / 2), posY + (spriteHeight / 2));
            if (this.pv <= 0) {
                const mirror = this.playerTeam ? -1 : 1;
                gameContainer.context.rotate((45 * mirror) * Math.PI / 180);
            }
            gameContainer.context.drawImage(
                this.sprite.image,
                0, 0,
                this.sprite.width,
                this.sprite.height,
                -(spriteWidth / 2),
                -(spriteHeight / 2),
                spriteWidth,
                spriteHeight
            );
            gameContainer.context.setTransform(1, 0, 0, 1, 0, 0);
            this.x = posX;
            this.y = posY;
            this.width = spriteWidth;
            this.height = spriteHeight;

            // Draw PV/PE bars.
            gameContainer.context.fillStyle = '#333';
            gameContainer.context.fillRect(posX, posY - 40, 80, 40);
            gameContainer.context.fillText(`${this.pv} /${this.pvMax} PV`, posX + 84, posY - 25);
            gameContainer.context.fillText(`${this.pe} /${this.peMax} PE`, posX + 84, posY - 5);
            // PV
            gameContainer.context.fillStyle = '#8ee06d';
            gameContainer.context.fillRect(posX, posY - 40, (80 / this.pvMax * this.pv), 20);
            // Temp Damage
            gameContainer.context.fillStyle = '#c53d26';
            gameContainer.context.fillRect(posX + (80 / this.pvMax * this.pv), posY - 40, (80 / this.pvMax * this.damage), 20);
            // PE
            gameContainer.context.fillStyle = '#7becff';
            gameContainer.context.fillRect(posX, posY - 20, (80 / this.peMax * this.pe), 20);
        }
    }

    hideDialogBox () {
        if (this.dialogBox) {
            this.dialogBox.remove();
        }
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
            if (gameContainer.battleZone.waitingSkill.canTargetGenoSprite) {
                if (gameContainer.battleZone.activeGenoSprite === this) {
                    if (gameContainer.battleZone.waitingSkill.canTargetSelf) {
                        gameContainer.battleZone.waitingSkill.resolveSelection(this);
                    }
                } else {
                    gameContainer.battleZone.waitingSkill.resolveSelection(this);
                }
            }
        } else if (this.playerTeam) {
            // Click on a player's GenoSprite.
            gameContainer.battleZone.selectGenoSprite(this);
        }
    }

    resetDialogBox () {
        this.dialogBox.unselectChoice();
        this.displayDialogBox();
    }

    select () {
        this.isActive = true;
        this.displayDialogBox();
    }

    setStats () {
        const stat = this.specie.stat;
        this.pvMax = stat.pv;
        this.pv = this.pvMax;
        this.peMax = stat.pe;
        this.pe = this.peMax * 0.2;

        this.atk = stat.atk;
        this.def = stat.def;
        this.psy = stat.psy;
        this.mgc = stat.mgc;
        this.spd = stat.spd;
        this.lck = stat.lck;
    }

    /**
     * Deals damage to the GenoSprite and updates its damage count (temporary
     * visible in its PV bar).
     *
     * @param {integer} damage
     * @returns {Promise} resolved when the damage bar is empty.
     */
    takeDamage (damage) {
        this.damage = damage;
        this.pv = Math.max(this.pv - damage, 0);

        return new Promise((resolve, reject) => {
            let decreaseDamage = setInterval(() => {
                this.needToBeRedraw = true;
                this.damage--;
                if (this.damage <= 0) {
                    this.damage = 0;
                    clearInterval(decreaseDamage);
                    resolve();
                }
            }, 30);
        });
    }
}

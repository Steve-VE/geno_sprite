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
        this.status = [];
        this.alterations = [];

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
        // Wait the sprite is actually loaded before to draw the GenoSprite.
        this.needToBeRedraw = false;
        this.sprite.onLoad(() => {
            this.needToBeRedraw = true;
        });
        this.statBar = new StatBar(this, 50, 50 + 50 * __geno_sprite_count);
    }

    attachToTile (tile) {
        if (this.tile) {
            this.tile.genoSprite = undefined;
            this.tile = undefined;
        }
        this.position = {
            x: tile.pos.x,
            y: tile.pos.y,
        };
        tile.genoSprite = this;
        this.tile = tile;
        refresh();
    }

    canPayTheCost (skill) {
        return this.pe >= skill.cost;
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
    displaySkillBox () {
        const skillList = document.querySelector(`.choice-box[data-geno-sprite-id="${this.id}"]`);
        skillList.classList.remove('hidden');
        skillList.classList.remove('inactive');
        const statContainer = document.querySelector(`.container[data-geno-sprite-id="${this.id}"]`);
        statContainer.classList.add('selected');
    }

    draw (shiftX, shiftY, forced=false) {
        if (this.needToBeRedraw || forced) {
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
            posY -= (fightTile.height  * 1.2);
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
                gameContainer.context.rotate((90 * mirror) * Math.PI / 180);
            }

            if (gameContainer.battleZone.waitingSkill && !this.isTargetable) {
                gameContainer.context.filter = 'brightness(0.5)';
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
            if (gameContainer.battleZone.waitingSkill && !this.isTargetable) {
                gameContainer.context.filter = 'none';
            }
        }
    }

    hideDialogBox () {
        const skillList = document.querySelector(`[data-geno-sprite-id="${this.id}"]`);
        if (gameContainer.battleZone.state === 'fight_setup') {
            skillList.classList.add('inactive');
        } else {
            skillList.classList.add('hidden');
        }
        const statContainer = document.querySelector(`.container[data-geno-sprite-id="${this.id}"]`);
        statContainer.classList.remove('selected');
    }

    /**
     * Checks if the GenoSprite is under the given status.
     *
     * @param {string} statusName `techName` of a `Status`
     * @returns {boolean} true if it is, false if it isn't.
     */
    is (statusName) {
        const status = Status.get(statusName);
        for (const genoSpriteStatus of this.status) {
            if (status.techName === genoSpriteStatus.techName) {
                return true;
            }
        }
        return false;
    }

    isClickedOn (x, y) {
        if (x < this.x || x > (this.x + this.width) || y < this.y || y > (this.y + this.height)) {
            return false;
        }
        return true;
    }

    /**
     * Checks if the GenoSprite isn't under the given status.
     *
     * @param {string} statusName `techName` of a `Status`
     * @returns {boolean} true if it isn't, false if it is.
     */
    isNot (statusName) {
        const status = Status.get(statusName);
        for (const genoSpriteStatus of this.status) {
            if (status.techName === genoSpriteStatus.techName) {
                return false;
            }
        }
        return true;
    }

    getUniqId () {
        __geno_sprite_count++;
        const number = String(__geno_sprite_count).padStart(4, 0);
        return `${this.specie.techName}_${number}`;
    }

    onClick () {
        if (gameContainer.battleZone.state !== 'skill_selection') {
            return;
        }
        if (gameContainer.battleZone.waitingSkill) {
            // Target a GenoSprite for a skill.
            if (gameContainer.battleZone.waitingSkill.canTarget(this)) {
                gameContainer.battleZone.waitingSkill.resolveSelection(this);
            }
        } else if (this.playerTeam) {
            // Click on a player's GenoSprite.
            this.select();
        }
    }

    payTheCost (skill) {
        this.pe -= skill.cost;
        this.statBar.updatePe();
    }

    select () {
        if (gameContainer.battleZone.state !== 'skill_selection') {
            return;
        }
        if (gameContainer.battleZone.activeGenoSprite) {
            gameContainer.battleZone.activeGenoSprite.unselect();
        }
        gameContainer.battleZone.activeGenoSprite = this;
        gameContainer.battleZone.activeTile = this.tile;
        this.isActive = true;
        this.displaySkillBox();
        refresh();
    }

    unselect () {
        if (gameContainer.battleZone.activeGenoSprite === this) {
            gameContainer.battleZone.activeGenoSprite = undefined;
        }
        this.isActive = false;
        this.hideDialogBox();
    }

    upkeep () {
        if (this.isNot('ko')) {
            this.pe += Math.round(this.peMax / 10);
            this.statBar.updatePe();
        }
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
        return new Promise((resolve, reject) => {

            this.damage = damage;
            const damageCount = document.createElement('div');
            damageCount.innerText = damage;
            damageCount.style.left = this.x;
            damageCount.style.top = this.y;
            damageCount.style.width = this.width;
            damageCount.classList.add('damage');
            damageCount.addEventListener('animationend', () => {
                document.body.removeChild(damageCount);
                resolve();
            });
            document.body.append(damageCount);

            this.pv = Math.max(this.pv - damage, 0);
            if (this.pv <= 0) {
                this.status.push(Status.get('ko'));
                refresh();
            }
            this.statBar.updatePv();
        });
    }
}

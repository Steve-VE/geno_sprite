class Player extends GameComponent{
    constructor (x, y) {
        super(x, y);
        this.wantToGoUp = false;
        this.wantToGoDown = false;
        this.wantToGoLeft = false;
        this.wantToGoRight = false;
        this.width = tileSize * 1.5;
        this.height = tileSize;
        this.speed = 6;
        this.frameCount = 0;
        this.frameRate = 10;
        this.spriteIndex = 0;
        this.maxSpriteIndex = 3;
        this.direction = 0;

        this.sprite = new SpriteSheet({
            path: 'characters/dump.png',
            width: 128,
            height: 192,
            row: 4,
            column: 4,
            centerY: 180,
        });
    }

    _beginStep () {
        if (inputs.right.pressed && !inputs.left.pressed) {
            this.wantToGoRight = true;
        } else {
            this.wantToGoRight = false;
        }

        if (inputs.left.pressed && !inputs.right.pressed) {
            this.wantToGoLeft = true;
        } else {
            this.wantToGoLeft = false;
        }

        if (inputs.down.pressed && !inputs.up.pressed) {
            this.wantToGoDown = true;
        } else {
            this.wantToGoDown = false;
        }

        if (inputs.up.pressed && !inputs.down.pressed) {
            this.wantToGoUp = true;
        } else {
            this.wantToGoUp = false;
        }
    }

    move () {
        let degree = 0;
        let speed = 0;
        if (this.wantToGoRight) {
            this.direction = 1;
            speed = this.speed;
            degree = 0;
            if (this.wantToGoDown) {
                degree -= 45;
            } else if (this.wantToGoUp) {
                degree += 45;
            }
        } else if (this.wantToGoLeft) {
            this.direction = 3;
            speed = this.speed;
            degree = 180;
            if (this.wantToGoDown) {
                degree += 45;
            } else if (this.wantToGoUp) {
                degree -= 45;
            }
        } else if (this.wantToGoDown) {
            this.direction = 0;
            degree = 270;
            speed = this.speed;
        } else if (this.wantToGoUp) {
            this.direction = 2;
            degree = 90;
            speed = this.speed;
        }
        if (this.wantToGoLeft || this.wantToGoRight) {
            this.speedX = Math.cos(radians(degree)) * speed;
            // this.speedX = Math.round(this.speedX);
        } else {
            this.speedX = 0;
        }
        if (this.wantToGoUp || this.wantToGoDown) {
            this.speedY = -Math.sin(radians(degree)) * speed;
            // this.speedY = Math.round(this.speedY);
        } else {
            this.speedY = 0;
        }

        this.adjustSpeed();
        this.x += this.speedX;
        this.y += this.speedY;
    }

    adjustSpeed () {
        let collisionPoints;
        // X
        if (this.speedX > 0) { // Try to go to RIGHT
            collisionPoints = this.getCollisionPointsForRight();
        } else if (this.speedX < 0) { // Try to go to LEFT
            collisionPoints = this.getCollisionPointsForLeft();
        }

        // Tweak the speed
        if (collisionPoints) {
            let other = this.checkCollision(collisionPoints);
            if (other) {
                other.left = other.x * tileSize;
                other.right = (other.x + 1) * tileSize;
                if (this.speedX > 0) {
                    this.speedX = other.left - (this.x + this.width);
                } else if (this.speedX < 0) {
                    this.speedX = other.right - this.x;
                }
            }
        }
        // Y
        if (this.speedY > 0) { // Try to go to DOWN
            collisionPoints = this.getCollisionPointsForDown();
        } else if (this.speedY < 0) { // Try to go to UP
            collisionPoints = this.getCollisionPointsForUp();
        }

        // Tweak the speed
        if (collisionPoints) {
            let other = this.checkCollision(collisionPoints);
            if (other) {
                other.top = other.y * tileSize;
                other.bottom = (other.y + 1) * tileSize;
                if (this.speedY > 0) {
                    this.speedY = other.top - (this.y + this.height);
                } else if (this.speedY < 0) {
                    this.speedY = other.bottom - this.y;
                }
            }
        }
    }

    draw () {
        if (GAME.DEBUG_MODE) {
            gameContainer.context.strokeStyle = 'rgba(255, 0, 0, 0.25)';
            gameContainer.context.strokeRect(this.x, this.y, this.width, this.height);
        }
        gameContainer.context.drawImage(
            this.sprite.image,
            this.sprite.width * this.spriteIndex,
            this.sprite.height * this.direction,
            this.sprite.width, this.sprite.height,
            this.x + ((this.width - 64) / 2),
            this.y - (64),
            64,
            96
        );
    }

    update () {
        super.update();
        if (this.speedX !== 0 || this.speedY !== 0) {
            this.frameCount++;
            if (this.frameCount > this.frameRate) {
                this.frameCount = 0;
                this.spriteIndex++;
                if (this.spriteIndex > this.maxSpriteIndex) {
                    this.spriteIndex = 0;
                }
            }
        } else {
            this.spriteIndex = 0;
        }
    }
}

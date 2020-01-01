
class GameComponent {
    constructor (x, y) {
        this.height = tileSize * 2;
        this.width = this.height;
        this.x = x || GAME.WIDTH / 2;
        this.y = y || GAME.HEIGHT / 2;
        this.speed = 8;
        this.currentSpeed = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    step () {
        this._beginStep();
        this.update();
        this._endStep();
    }

    _beginStep () {
        return;
    }
    _endStep () {
        return;
    }

    draw () {
        // gameContainer.context.strokeRect(this.x, this.y, this.width, this.height);
        gameContainer.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update () {
        this.move();
    }

    move () {
        let degree = 0;
        let speed = 0;
        if (inputs.right.pressed && !inputs.left.pressed && this.canGoRight()) {
            speed = this.speed;
            degree = 0;
            if (inputs.down.pressed && !inputs.up.pressed && this.canGoDown()) {
                degree -= 45;
            } else if (inputs.up.pressed && !inputs.down.pressed && this.canGoUp()) {
                degree += 45;
            }
        } else if (inputs.left.pressed && !inputs.right.pressed && this.canGoLeft()) {
            speed = this.speed;
            degree = 180;
            if (inputs.down.pressed && !inputs.up.pressed && this.canGoDown()) {
                degree += 45;
            } else if (inputs.up.pressed && !inputs.down.pressed && this.canGoUp()) {
                degree -= 45;
            }
        } else if (inputs.down.pressed && !inputs.up.pressed && this.canGoDown()) {
            degree = 270;
            speed = this.speed;
        } else if (inputs.up.pressed && !inputs.down.pressed && this.canGoUp()) {
            degree = 90;
            speed = this.speed;
        }
        this.speedX = Math.cos(radians(degree)) * speed;
        this.speedY = -Math.sin(radians(degree)) * speed;

        this.x += this.speedX;
        this.y += this.speedY;
    }

    canGoDown () {
        const collisionPoints = [
            {
                x: this.x,
                y: this.y + this.height + this.speed,
            },
            {
                x: this.x + this.width,
                y: this.y + this.height + this.speed,
            },
        ];
        return !(this.checkCollision(collisionPoints));
    }

    canGoUp () {
        const collisionPoints = [
            {
                x: this.x,
                y: this.y,
            },
            {
                x: this.x + this.width,
                y: this.y,
            },
        ];
        return !(this.checkCollision(collisionPoints));
    }

    canGoLeft () {
        const collisionPoints = [
            {
                x: this.x,
                y: this.y,
            },
            {
                x: this.x,
                y: this.y + this.height,
            },
        ];
        return !(this.checkCollision(collisionPoints));
    }

    canGoRight () {
        const collisionPoints = [
            {
                x: this.x + this.width,
                y: this.y,
            },
            {
                x: this.x + this.width,
                y: this.y + this.height,
            },
        ];
        return !(this.checkCollision(collisionPoints));
    }

    checkCollision (collisionPoints) {
        const map = gameContainer.map;
        for (const point of collisionPoints) {
            const tileX = Math.floor(point.x / tileSize);
            const tileY = Math.floor(point.y / tileSize);
            if (tileY < 0 || tileY >= map.length) {
                return {
                    x: tileX,
                    y: tileY < 0 ? -1 : map.length,
                };
            }
            if (tileX < 0 || tileX >= map[0].length) {
                return {
                    x: tileX < 0 ? -1 : map[0].length,
                    y: tileY,
                };
            }
            if (map[tileY][tileX]) {
                return {
                    x: tileX,
                    y: tileY,
                };
            }
        }
        return false;
    }

    getCollisionPointsForLeft () {
        const fixedX = this.x + this.speedX;
        const collisionPoints = [
            {
                x: fixedX,
                y: this.y + 1,
            },
            {
                x: fixedX,
                y: this.y + this.height - 1,
            },
        ];
        if (this.height > tileSize) {
            const intermediateCP = Math.ceil(this.height / tileSize);
            for (let i = 1; i < intermediateCP; i++) {
                collisionPoints.push({
                    x: fixedX,
                    y: this.y + (this.height / intermediateCP * i)
                });
            }
        }
        return collisionPoints;
    }

    getCollisionPointsForRight () {
        const fixedX = this.x + this.width + this.speedX;
        const collisionPoints = [
            {
                x: fixedX,
                y: this.y + 1,
            },
            {
                x: fixedX,
                y: this.y + this.height - 1,
            },
        ];
        if (this.height > tileSize) {
            const intermediateCP = Math.ceil(this.height / tileSize);
            for (let i = 1; i < intermediateCP; i++) {
                collisionPoints.push({
                    x: fixedX,
                    y: this.y + (this.height / intermediateCP * i)
                });
            }
        }
        return collisionPoints;
    }

    getCollisionPointsForDown () {
        const fixedY = this.y + this.height + this.speedY;
        const collisionPoints = [
            {
                x: this.x + 1,
                y: fixedY,
            },
            {
                x: this.x + this.width - 1,
                y: fixedY,
            },
        ];
        if (this.width > tileSize) {
            const intermediateCP = Math.ceil(this.width / tileSize);
            for (let i = 1; i < intermediateCP; i++) {
                collisionPoints.push({
                    x: this.x + (this.width / intermediateCP * i),
                    y: fixedY,
                });
            }
        }
        return collisionPoints;
    }

    getCollisionPointsForUp () {
        const fixedY = this.y + this.speedY;
        const collisionPoints = [
            {
                x: this.x + 1,
                y: fixedY,
            },
            {
                x: this.x + this.width - 1,
                y: fixedY,
            },
        ];
        if (this.width > tileSize) {
            const intermediateCP = Math.ceil(this.width / tileSize);
            for (let i = 1; i < intermediateCP; i++) {
                collisionPoints.push({
                    x: this.x + (this.width / intermediateCP * i),
                    y: fixedY,
                });
            }
        }
        return collisionPoints;
    }
}

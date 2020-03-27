class GameContainer {
    constructor () {
        gameContainer = this;
        this.canvas = document.createElement('canvas');
        this.canvas.id = `gameContainer`;
        this.canvas.height = GAME.HEIGHT;
        this.canvas.width = GAME.WIDTH;
        // this.canvas.style.border = '1px solid black';
        this.context = this.canvas.getContext('2d');

        this.context.fillStyle = 'red';
        this.context.strokeStyle = 'black';
        this.context.font = '16px "Squada One"';

        this.gameComponents = [];

        this.map = map;

        // this.mode = 'overworld';
        this.mode = 'fight';
        if (this.mode === 'fight') {
            new BattleZone();
        }

        gameContainer.start();
    }

    start () {
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(this.canvas);
        this.gameComponents.push(new Player());
    }

    update () {
        if (this.mode === 'overworld') {
            gameContainer.drawGround();
            if (inputs.action.pressed) {
                console.log('AAAAAAAH !!!!');
            }
            for (const gameComponent of this.gameComponents) {
                gameComponent.step();
            }
            for (const gameComponent of this.gameComponents) {
                gameComponent.draw();
            }
        } else if (this.mode === 'fight') {
            gameContainer.drawBattleground();
        }
    }

    drawBattleground () {
        this.battleZone.update();
        this.battleZone.draw();
    }

    drawGround () {
        const trackFillColor = this.context.fillStyle;
        // this.context.fillStyle = 'rgb(185, 185, 185)';
        // this.context.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

        // const amountX = GAME.WIDTH / tileSize;
        // const amountY = GAME.HEIGHT / tileSize;
        for (let y = 0; y < map.length; y++) {
            const mapLine = map[y];
            for (let x = 0; x < mapLine.length; x++) {
                const tile = mapLine[x];
                let color = 'rgb(200, 200, 200)';
                if (tile) {
                    color = 'rgb(85, 85, 85)';
                }
                this.context.fillStyle = color;
                this.context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
        this.context.fillStyle = trackFillColor;
    }
}

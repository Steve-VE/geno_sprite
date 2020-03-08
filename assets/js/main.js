let gameContainer;
let clickableElement = [];

// Init
window.addEventListener('load', () => {
    new GameContainer();

    window.addEventListener('click', (ev) => {
        console.log(ev);
        const x = ev.clientX;
        const y = ev.clientY;
        for (const element of clickableElement) {
            if (element.isClickedOn(x, y)) {
                element.onClick();
            }
        }
    });

    window.addEventListener('keydown', (event) => {
        console.log(event);
        // const key = event.code;
        const key = event.key;
        Object.values(inputs).forEach(input => {
            if (key === input.defaultKey) {
                event.preventDefault();
                if (!input.pressed) {
                    input.pressed = true;
                }
            }
        });
    });

    window.addEventListener('keyup', (event) => {
        // const key = event.code;
        const key = event.key;
        Object.values(inputs).forEach(input => {
            if (key === input.defaultKey) {
                event.preventDefault();
                if (input.pressed) {
                    input.pressed = false;
                }
            }
        });
    });

    window.setInterval(function step () {
        gameContainer.update();
    }, GAME.FRAMERATE);

});
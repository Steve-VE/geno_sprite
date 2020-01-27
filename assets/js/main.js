const gameContainer = new GameContainer();

// Init
window.addEventListener('load', () => {
    gameContainer.start();
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

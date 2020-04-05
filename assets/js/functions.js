function radians (degree) {
    return degree * (Math.PI / 180);
}


/**
 * Ask to redraw the battle zone.
 */
function refresh () {
    if (gameContainer && gameContainer.battleZone) {
        gameContainer.battleZone.needToBeRedraw = true;
    }
}

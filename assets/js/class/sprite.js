
class SpriteSheet {
    constructor (config) {
        this.path = './assets/sprites/' + config.path;

        this.image = new Image();
        this.image.src = this.path;

        this.image.onload = () => {
            this.width = config.width || this.image.width;
            this.height = config.height || this.image.height;
        };
        this.row = config.row || 1;
        this.column = config.column || 1;

        this.centerX = config.centerX || Math.floor(this.width / 2);
        this.centerY = config.centerY || Math.floor(this.height / 2);
    }

    draw (host, x, y) {
        x = (host && host.x) || x;
        y = (host && host.y) || y;
    }
}

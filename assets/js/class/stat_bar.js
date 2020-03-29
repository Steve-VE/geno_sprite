class StatBar {
    constructor (genoSprite, x, y) {
        this.genoSprite = genoSprite;
        this.pvMax = this.genoSprite.pvMax;
        this.peMax = this.genoSprite.peMax;

        // Generates the HTML elements.
        this.html = document.createElement('div');
        this.html.classList.add('stat-bar');

        this.pvGauge = document.createElement('span');
        this.pvGauge.style.width = this.setPv(this.genoSprite.pv);
        this.pvGauge.classList.add('gauge');
        const pvBar = document.createElement('span');
        pvBar.style.width = '80px;';
        pvBar.classList.add('bar');
        pvBar.append(this.pvGauge);
        const pvLabel = document.createElement('span');
        pvLabel.classList.add('label');
        pvLabel.innerText = `${this.genoSprite.pv} / ${this.genoSprite.pvMax} PV`;
        const pvGroup = document.createElement('div');
        pvGroup.classList.add('pv');
        pvGroup.append(pvBar, pvLabel);

        const peBar = document.createElement('span');
        peBar.style.width = '80px;';
        peBar.classList.add('bar');
        const peLabel = document.createElement('span');
        peLabel.classList.add('label');
        peLabel.innerText = `${this.genoSprite.pe} / ${this.genoSprite.peMax} PE`;
        const peGroup = document.createElement('div');
        peGroup.classList.add('pe');
        peGroup.append(peBar, peLabel);

        this.html.append(pvGroup, peGroup);
        // this.html.style.right = x;
        // this.html.style.top = y;

        // document.body.append(this.html);
    }

    setPv (pv) {
        this.pv = pv;
        const percent = (100 / this.pvMax) * this.pv;
        this.pvGauge.style.width = `${percent}%`;
    }
}
class StatBar {
    constructor (genoSprite) {
        this.genoSprite = genoSprite;

        // Generates the HTML elements.
        this.html = document.createElement('div');
        this.html.classList.add('stat-bar');

        this.pvGauge = document.createElement('span');
        this.pvGauge.classList.add('gauge');
        const pvBar = document.createElement('span');
        pvBar.style.width = '80px;';
        pvBar.classList.add('bar');
        pvBar.append(this.pvGauge);
        this.pvLabel = document.createElement('span');
        this.pvLabel.classList.add('label');
        this.updatePv();
        const pvGroup = document.createElement('div');
        pvGroup.classList.add('pv');
        pvGroup.append(pvBar, this.pvLabel);

        this.peGauge = document.createElement('span');
        this.peGauge.classList.add('gauge');
        const peBar = document.createElement('span');
        peBar.style.width = '80px;';
        peBar.classList.add('bar');
        peBar.append(this.peGauge);
        this.peLabel = document.createElement('span');
        this.peLabel.classList.add('label');
        this.updatePe();
        const peGroup = document.createElement('div');
        peGroup.classList.add('pe');
        peGroup.append(peBar, this.peLabel);

        this.html.append(pvGroup, peGroup);
    }

    updatePe () {
        this.pe = this.genoSprite.pe;
        const percent = (100 / this.genoSprite.peMax) * this.pe;
        this.peGauge.style.width = `${percent}%`;
        this.peLabel.innerText = `${this.genoSprite.pe} / ${this.genoSprite.peMax} PE`;
    }

    updatePv () {
        this.pv = this.genoSprite.pv;
        const percent = (100 / this.genoSprite.pvMax) * this.pv;
        this.pvGauge.style.width = `${percent}%`;
        this.pvLabel.innerText = `${this.genoSprite.pv} / ${this.genoSprite.pvMax} PV`;
    }
}
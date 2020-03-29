let activeDialogBox;

class DialogBox {
    constructor (params) {
        params = params ||{};
        this.html = document.createElement('div');

        if (params.parent) {
            this.parent = params.parent;
        } else {
            this.html.classList.add('dialog-box');
            this.place(params.x || 0, params.y || 0);
        }
        this.isDisplayed = false;
        if (params.isDisplayed) {
            this.display();
        }
        this.deactivate();
        this.title = '';

        if (params.owner) {
            this.owner = params.owner;
            this.html.dataset.genoSpriteId = this.owner.id;
            if (!this.parent) {
                this.setTitle(this.owner.name);
            }
        }
    }

    activate () {
        if (activeDialogBox) {
            activeDialogBox.deactivate();
        }
        this.isActive = true;
        this.html.classList.remove('inactive');
        activeDialogBox = this;
        this.display();
    }

    deactivate () {
        this.html.classList.add('inactive');
        if (activeDialogBox === this) {
            activeDialogBox = undefined;
        }
        this.isActive = false;
    }

    display () {
        if (!this.isDisplayed) {
            this.isDisplayed = true;
            document.body.append(this.html);
        }
    }

    place (x, y) {
        this.x = x;
        this.y = y;
        this.html.style.left = `${this.x}px`;
        this.html.style.top = `${this.y}px`;
    }

    remove () {
        if (this.isDisplayed) {
            this.isDisplayed = false;
            this.html.parentNode.removeChild(this.html);
        }
    }

    setTitle (title) {
        this.title = title;
        title = document.createElement('h3');
        title.innerHTML = this.title;

        title.addEventListener('click', () => {
            console.log('Click on ' + this.owner.name);
            this.owner.select();
        });

        this.html.insertBefore(title, this.html.firstChild);
    }

    toggle () {
        if (this.isDisplayed) {
            this.remove();
        } else {
            this.display();
        }
    }
}

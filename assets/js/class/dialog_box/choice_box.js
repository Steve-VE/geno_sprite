
class ChoiceBox extends DialogBox {
    constructor (x, y, isDisplayed=true) {
        super(...arguments);
        this.list = document.createElement('ul');
        this.choices = [];
        this.html.appendChild(this.list);
        this.html.classList.add('choice-box');
    }

    addChoice (text) {
        new Choice(this, text);
    }

    unselectChoice () {
        for (const choice of this.choices) {
            choice.unselect();
        }
    }
}


class Choice {
    constructor (parent, text) {
        this.text = text;
        this.html = document.createElement('li');
        this.html.innerHTML = this.text;
        // When player clicks on the choice, unselects the DialogBox and go to
        // the next GenoSprite.
        this.html.addEventListener('click', () => {
            if (this.isActive) {
                this.toggle();
                gameContainer.battleZone.nextGenoSprite();
            }
        });
        this.parent = parent;
        this.parent.choices.push(this);
        this.parent.list.appendChild(this.html);
    }

    get isActive () {
        return this.parent && this.parent.isActive;
    }

    toggle () {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select();
        }
    }

    select () {
        this.parent.unselectChoice();
        this.isSelected = true;
        this.html.classList.add('selected');
    }

    unselect () {
        this.isSelected = false;
        this.html.classList.remove('selected');
    }
}

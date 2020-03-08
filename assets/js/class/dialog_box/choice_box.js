
class ChoiceBox extends DialogBox {
    constructor (x, y, isDisplayed=true) {
        super(...arguments);
        this.list = document.createElement('ul');
        this.choices = [];
        this.html.appendChild(this.list);
        this.html.classList.add('choice-box');
    }

    addChoice (params) {
        new Choice(this, params);
    }

    unselectChoice () {
        for (const choice of this.choices) {
            choice.unselect();
        }
    }
}


class Choice {
    constructor (parent, params) {
        this.skill = params.skill;
        this.text = this.skill.name;
        this.html = document.createElement('li');
        this.html.innerHTML = this.text;
        // When player clicks on the choice, unselects the DialogBox and go to
        // the next GenoSprite.
        this.html.addEventListener('click', () => {
            if (this.isActive) {
                this.toggle();
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

        const skillProm = this.skill.isSelected();
        skillProm.then(() => {
            gameContainer.battleZone.nextGenoSprite();
        });
    }

    unselect () {
        this.isSelected = false;
        this.html.classList.remove('selected');
    }
}

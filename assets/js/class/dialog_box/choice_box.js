
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
        this.text = `${this.skill.icon} ${this.skill.name}`;

        const choiceBody = document.createElement('span');
        choiceBody.innerHTML = this.text;
        choiceBody.classList.add('skill-name');
        const choiceCost = document.createElement('span');
        choiceCost.innerHTML = this.skill.cost;
        choiceCost.classList.add('skill-cost');

        this.html = document.createElement('li');
        this.html.title = this.getDescription();
        this.html.append(choiceBody);
        this.html.append(choiceCost);

        this.html.addEventListener('click', () => {
            if (this.isActive) {
                this.toggle();
            }
        });
        this.parent = parent;
        this.parent.choices.push(this);
        this.parent.list.appendChild(this.html);
    }

    getDescription () {
        let description = `${this.skill.name}\n`;
        description += `${this.skill.description}\n\n`;
        description += `Cost: ${this.skill.cost}PE`;
        return description;
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

        // When player clicks on the choice and made the selection, unselects
        // the DialogBox and goes to the next GenoSprite.
        const skillProm = this.skill.isSelected(this.parent.owner);
        skillProm.then((skill) => {
            gameContainer.battleZone.addSkillToStack(skill);
            gameContainer.battleZone.nextGenoSprite();
        });
    }

    unselect () {
        this.isSelected = false;
        this.html.classList.remove('selected');
    }
}

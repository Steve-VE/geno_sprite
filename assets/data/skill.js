// /!\ Must be converted into real JSON for the production.
const SKILL_DATA = {
    "ATTACK": {
        "bite": {
            "name": "Bite",
            "categ": "physical",
            "cost": 5,
            "power": 8,
            "description": "Bites the target."
        },
        "psy_shock": {
            "name": "Psy Shock",
            "categ": "mental",
            "cost": 4,
            "power": 6,
            "description": "Uses psychic power to hurt the target."
        },
        "punch": {
            "name": "Punch",
            "categ": "physical",
            "cost": 4,
            "power": 6,
            "description": "Hits the target with the punch"
        },
        "sparkle_pop": {
            "name": "Sparkle Pop",
            "categ": "magic",
            "cost": 4,
            "power": 6,
            "description": "Throws a weak magic projectile to hurt the target."
        }
    },
    "SELF": {
        "defend": {
            "name": "Defend",
            "categ": "physical",
            "cost": 2,
            "description": "The user protects himself to lower next damage.\nIneffective against mental attacks."
        },
        "energizer": {
            "name": "Energizer",
            "categ": "magic",
            "cost": 2,
            "description": "The user condenses surrounding magic to increase its Energy Points."
        },
        "focus": {
            "name": "Focus",
            "categ": "mental",
            "cost": 2,
            "description": "The user focus its mind to get a mental boost until next turn."
        },
    }
};

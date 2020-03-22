// /!\ Must be converted into real JSON for the production.
const SKILL_DATA = {
    "ATTACK": {
        "bite": {
            "name": "Bite",
            "icon": "👄",
            "categ": "physical",
            "cost": 5,
            "power": 8,
            "description": "Bites the target."
        },
        "psy_shock": {
            "name": "Psy Shock",
            "icon" : "🧠",
            "categ": "cerebral",
            "cost": 4,
            "power": 6,
            "description": "Uses psychic power to hurt the target."
        },
        "punch": {
            "name": "Punch",
            "icon": "✊",
            "categ": "physical",
            "cost": 4,
            "power": 6,
            "description": "Hits the target with the punch"
        },
        "sparkle_pop": {
            "name": "Sparkle Pop",
            "icon": "🌟",
            "categ": "magic",
            "cost": 4,
            "power": 6,
            "description": "Throws a weak magic projectile to hurt the target.",
            "options": {
                "selfTargeting": true
            }
        }
    },
    "SELF": {
        "defend": {
            "name": "Defend",
            "icon": "🛡",
            "categ": "physical",
            "cost": 2,
            "description": "The user protects himself to lower next damage.\nIneffective against cerebral attacks."
        },
        "do_nothing": {
            "name": "Do Nothing",
            "icon": "🤷",
            "description": "Literally."
        },
        "energizer": {
            "name": "Energizer",
            "icon": "🔌",
            "categ": "magic",
            "cost": 2,
            "description": "The user condenses surrounding magic to increase its Energy Points."
        },
        "focus": {
            "name": "Focus",
            "icon": "🧘",
            "categ": "cerebral",
            "cost": 2,
            "description": "The user focus its mind to get a cerebral boost until next turn."
        },
    }
};

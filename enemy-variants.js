export const ENEMY_VARIANTS = {
  "alpha": {
    "name": "Alpha",
    "flavor": "An empowered version of its species, radiating aggression.",
    "tags": ["alpha"],
    "lootMult": 1.10,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.15,
      "atkMult": 1.10,
      "defMult": 1.05,
      "specialRules": ["alpha_aggression"]
    }
  },

  "elder": {
    "name": "Elder",
    "flavor": "An ancient specimen hardened by countless battles.",
    "tags": ["elder"],
    "lootMult": 1.15,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.25,
      "atkMult": 1.05,
      "defMult": 1.20,
      "speedBias": -0.05,
      "critDamageMult": 1.10,
      "specialRules": ["ancient_resilience"]
    }
  },

  "champion": {
    "name": "Champion",
    "flavor": "A rare elite variant with exceptional strength.",
    "tags": ["champion", "elite"],
    "lootMult": 1.25,
    "abilities": ["power_strike"],
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.40,
      "atkMult": 1.30,
      "defMult": 1.20,
      "critChanceAdd": 0.05,
      "critDamageMult": 1.20,
      "specialRules": ["elite_presence"]
    }
  },

  "boss": {
    "name": "Boss",
    "flavor": "A towering monstrosity radiating overwhelming power.",
    "tags": ["boss"],
    "lootMult": 1.50,
    "abilities": ["power_strike", "battle_cry"],
    "ultimate": "boss_ultimate",
    "combatModifiers": {
      "hpMult": 2.0,
      "atkMult": 1.75,
      "defMult": 1.50,
      "critChanceAdd": 0.10,
      "critDamageMult": 1.30,
      "specialRules": ["boss_pressure"]
    }
  },

  "frost_touched": {
    "name": "Frost‑Touched",
    "flavor": "Cold winds cling to its form.",
    "tags": ["elemental", "ice"],
    "lootMult": 1.10,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.10,
      "atkMult": 1.05,
      "defMult": 1.10,
      "accuracyMult": 0.95,
      "speedBias": -0.05,
      "specialRules": ["chill_on_hit"]
    }
  },

  "ash_marked": {
    "name": "Ash‑Marked",
    "flavor": "Ash and embers cling to its body.",
    "tags": ["fiery"],
    "lootMult": 1.15,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.05,
      "atkMult": 1.15,
      "defMult": 1.05,
      "specialRules": ["ember_burn"]
    }
  },

  "void_scarred": {
    "name": "Void‑Scarred",
    "flavor": "Warped by the void.",
    "tags": ["void"],
    "lootMult": 1.20,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.20,
      "atkMult": 1.20,
      "defMult": 1.10,
      "statusEffectChanceMult": 1.25,
      "specialRules": ["void_corruption"]
    }
  },

  "crystal_infused": {
    "name": "Crystal‑Infused",
    "flavor": "Crystalline energy pulses through it.",
    "tags": ["elemental", "arcane"],
    "lootMult": 1.15,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.15,
      "atkMult": 1.10,
      "defMult": 1.15,
      "critChanceAdd": 0.05,
      "specialRules": ["arcane_burst"]
    }
  },

  "rot_swollen": {
    "name": "Rot‑Swollen",
    "flavor": "Bloated with swamp rot.",
    "tags": ["poisonous"],
    "lootMult": 1.10,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.25,
      "atkMult": 1.05,
      "defMult": 1.05,
      "dotDamageMult": 1.50,
      "specialRules": ["rot_spread"]
    }
  },

  "infernal_forged": {
    "name": "Infernal‑Forged",
    "flavor": "Shaped by hellfire and infernal wrath.",
    "tags": ["fiery", "demon"],
    "lootMult": 1.20,
    "abilities": ["hellfire_burst"],
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.10,
      "atkMult": 1.20,
      "defMult": 1.05,
      "dotDamageMult": 1.25,
      "specialRules": ["infernal_flame"]
    }
  },

  "stormcharged": {
    "name": "Stormcharged",
    "flavor": "Crackling with unstable storm energy.",
    "tags": ["elemental", "lightning"],
    "lootMult": 1.15,
    "abilities": ["lightning_arc"],
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.05,
      "atkMult": 1.15,
      "defMult": 1.05,
      "speedBias": 0.10,
      "accuracyMult": 1.10,
      "specialRules": ["shock_on_hit"]
    }
  },

  "windborne": {
    "name": "Windborne",
    "flavor": "Its form moves with impossible swiftness.",
    "tags": ["elemental", "wind"],
    "lootMult": 1.10,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 0.95,
      "atkMult": 1.10,
      "defMult": 0.90,
      "speedBias": 0.20,
      "evasionBias": 0.15,
      "specialRules": ["gale_step"]
    }
  },

  "tidebound": {
    "name": "Tidebound",
    "flavor": "Water flows through its body like a living current.",
    "tags": ["elemental", "water"],
    "lootMult": 1.10,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.10,
      "atkMult": 1.05,
      "defMult": 1.10,
      "specialRules": ["soak_resistance"]
    }
  },

  "magma_blooded": {
    "name": "Magma‑Blooded",
    "flavor": "Molten energy churns beneath its skin.",
    "tags": ["elemental", "fire", "earth"],
    "lootMult": 1.20,
    "abilities": ["eruption"],
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.20,
      "atkMult": 1.15,
      "defMult": 1.10,
      "specialRules": ["magma_armor"]
    }
  },

  "thorncrowned": {
    "name": "Thorn‑Crowned",
    "flavor": "Nature’s wrath coils around its form.",
    "tags": ["fae", "nature"],
    "lootMult": 1.15,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.10,
      "atkMult": 1.10,
      "defMult": 1.10,
      "statusEffectChanceMult": 1.20,
      "specialRules": ["thorn_aura"]
    }
  },

  "radiant_touched": {
    "name": "Radiant‑Touched",
    "flavor": "Blessed by celestial light.",
    "tags": ["holy", "divine"],
    "lootMult": 1.20,
    "abilities": ["radiant_burst"],
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.15,
      "atkMult": 1.15,
      "defMult": 1.10,
      "specialRules": ["radiant_burn"]
    }
  },

  "shadowmarked": {
    "name": "Shadowmarked",
    "flavor": "Darkness clings to its every movement.",
    "tags": ["dark", "void"],
    "lootMult": 1.15,
    "abilities": null,
    "ultimate": null,
    "combatModifiers": {
      "hpMult": 1.05,
      "atkMult": 1.15,
      "defMult": 1.05,
      "evasionBias": 0.10,
      "specialRules": ["shadow_step"]
    }
  }
};

export const ENEMY_FAMILIES = {
  "humanoid": {
    "key": "humanoid",
    "tier": 1,
    "baseHP": 100,
    "baseATK": 10,
    "baseDEF": 8,
    "elementAffinity": {},
    "behavior": "balanced",
    "flavor": "Standard mortal foes with adaptable tactics and varied combat styles.",
    "familyModifiers": {
      "atkMult": 1.0,
      "defMult": 1.0,
      "speedBias": 0.0,
      "notes": "Versatile and predictable; no inherent strengths or weaknesses."
    }
  },

  "beast": {
    "key": "beast",
    "tier": 1,
    "baseHP": 120,
    "baseATK": 12,
    "baseDEF": 6,
    "elementAffinity": { "nature": 0.10 },
    "behavior": "aggressive",
    "flavor": "Instinct-driven creatures that rely on feral strength and speed.",
    "familyModifiers": {
      "atkMult": 1.10,
      "defMult": 1.0,
      "speedBias": 0.05,
      "notes": "Savage and instinctive, beasts strike quickly and hard."
    }
  },

  "plantfolk": {
    "key": "plantfolk",
    "tier": 1,
    "baseHP": 130,
    "baseATK": 9,
    "baseDEF": 10,
    "elementAffinity": { "nature": 0.20, "fire": -0.20 },
    "behavior": "defensive",
    "flavor": "Living plant creatures with durable bodies and slow, deliberate movements.",
    "familyModifiers": {
      "atkMult": 0.95,
      "defMult": 1.15,
      "statusEffectChanceMult": 1.10,
      "notes": "Resilient but slow; often inflict nature-based debuffs."
    }
  },

  "slimeborn": {
    "key": "slimeborn",
    "tier": 1,
    "baseHP": 140,
    "baseATK": 8,
    "baseDEF": 12,
    "elementAffinity": { "poison": 0.15, "acid": 0.20 },
    "behavior": "unpredictable",
    "flavor": "Amorphous creatures with high resilience and unusual attack patterns.",
    "familyModifiers": {
      "atkMult": 0.9,
      "defMult": 1.20,
      "notes": "Slimes absorb damage well but hit lightly; often resistant to physical harm."
    }
  },

  "insectoid": {
    "key": "insectoid",
    "tier": 1,
    "baseHP": 90,
    "baseATK": 11,
    "baseDEF": 7,
    "elementAffinity": { "poison": 0.10 },
    "behavior": "swarming",
    "flavor": "Hive-driven creatures that rely on numbers, speed, and venom.",
    "familyModifiers": {
      "atkMult": 1.05,
      "defMult": 0.95,
      "speedBias": 0.10,
      "notes": "Fast and aggressive; often apply poison or swarm-based effects."
    }
  },

  "arachnid": {
    "key": "arachnid",
    "tier": 1,
    "baseHP": 100,
    "baseATK": 12,
    "baseDEF": 8,
    "elementAffinity": { "poison": 0.20 },
    "behavior": "ambush",
    "flavor": "Stealthy predators that strike from hiding with venom and webs.",
    "familyModifiers": {
      "atkMult": 1.10,
      "defMult": 1.0,
      "statusEffectChanceMult": 1.20,
      "notes": "High poison application and ambush damage."
    }
  },

  "undead": {
    "key": "undead",
    "tier": 2,
    "baseHP": 110,
    "baseATK": 9,
    "baseDEF": 10,
    "elementAffinity": {
      "holy": 0.20,
      "poison": -0.20,
      "rot": -0.20
    },
    "behavior": "relentless",
    "flavor": "Creatures animated by dark magic, resistant to pain and fear.",
    "familyModifiers": {
      "atkMult": 1.0,
      "defMult": 1.10,
      "statusEffectChanceMult": 1.15,
      "specialRules": { "decayTouch": true },
      "notes": "Resilient and rot‑infused, with strong debuff potential."
    }
  },

  "spirit": {
    "key": "spirit",
    "tier": 2,
    "baseHP": 100,
    "baseATK": 11,
    "baseDEF": 6,
    "elementAffinity": { "arcane": 0.10, "holy": -0.10 },
    "behavior": "ethereal",
    "flavor": "Ghostly entities that phase through matter and wield supernatural energy.",
    "familyModifiers": {
      "atkMult": 1.05,
      "defMult": 0.9,
      "evasionBias": 0.15,
      "notes": "Hard to hit; often apply arcane or fear-based effects."
    }
  },

  "fae": {
    "key": "fae",
    "tier": 2,
    "baseHP": 95,
    "baseATK": 12,
    "baseDEF": 7,
    "elementAffinity": { "nature": 0.15, "arcane": 0.10 },
    "behavior": "trickster",
    "flavor": "Mischievous magical beings with deceptive abilities and unpredictable tactics.",
    "familyModifiers": {
      "atkMult": 1.10,
      "defMult": 0.95,
      "speedBias": 0.10,
      "notes": "High agility and magical trickery; often inflict charm or confusion."
    }
  },

  "construct": {
    "key": "construct",
    "tier": 2,
    "baseHP": 150,
    "baseATK": 13,
    "baseDEF": 14,
    "elementAffinity": { "lightning": -0.10 },
    "behavior": "mechanical",
    "flavor": "Artificial beings forged from metal, stone, or arcane machinery.",
    "familyModifiers": {
      "atkMult": 1.10,
      "defMult": 1.20,
      "statusEffectImmunity": true,
      "notes": "High durability; immune to many debuffs but weak to lightning."
    }
  },

  "elemental": {
    "key": "elemental",
    "tier": 2,
    "baseHP": 140,
    "baseATK": 16,
    "baseDEF": 12,
    "elementAffinity": { "arcane": 0.10 },
    "behavior": "unpredictable",
    "flavor": "Manifestations of raw elemental power, shaped by primal forces.",
    "familyModifiers": {
      "atkMult": 1.20,
      "defMult": 1.05,
      "notes": "Elementals embody the forces of nature."
    }
  },

  "demon": {
    "key": "demon",
    "tier": 2,
    "baseHP": 150,
    "baseATK": 18,
    "baseDEF": 14,
    "elementAffinity": { "fire": 0.20 },
    "behavior": "aggressive",
    "flavor": "Malevolent beings from infernal realms, driven by destruction.",
    "familyModifiers": {
      "atkMult": 1.25,
      "defMult": 1.10,
      "notes": "Demons strike with overwhelming force."
    }
  },

  "dragon": {
    "key": "dragon",
    "tier": 2,
    "baseHP": 160,
    "baseATK": 20,
    "baseDEF": 16,
    "elementAffinity": { "fire": 0.10, "arcane": 0.10 },
    "behavior": "dominant",
    "flavor": "Majestic and terrifying apex predators infused with ancient magic.",
    "familyModifiers": {
      "atkMult": 1.30,
      "defMult": 1.20,
      "notes": "Dragons are powerful, intelligent, and magically potent."
    }
  },

  "abyssal_brute_family": {
    "key": "abyssal_brute_family",
    "tier": 4,
    "baseHP": 220,
    "baseATK": 22,
    "baseDEF": 18,
    "elementAffinity": { "dark": 0.20, "rot": 0.10 },
    "behavior": "rampaging",
    "flavor": "Massive horrors shaped by the Abyss, driven by hunger and violent instinct.",
    "familyModifiers": {
      "atkMult": 1.30,
      "defMult": 1.20,
      "speedBias": -0.05,
      "notes": "Brutal, overwhelming force; resistant to fear and pain, but slow and predictable."
    }
  }, 
  
  "astral_family": {
    "key": "astral_family",
    "tier": 5,
    "baseHP": 180,
    "baseATK": 20,
    "baseDEF": 14,
    "elementAffinity": { "arcane": 0.25, "holy": 0.10 },
    "behavior": "drifting",
    "flavor": "Cosmic entities touched by the Astral Sea, guided by thought rather than instinct.",
    "familyModifiers": {
      "atkMult": 1.25,
      "defMult": 1.10,
      "evasionBias": 0.10,
      "notes": "Unpredictable and reality‑bending; often apply arcane, gravity, or mind‑warp effects."
    }
  }, 
  
  "verdant_colossus_family": {
    "key": "verdant_colossus_family",
    "tier": 4,
    "baseHP": 240,
    "baseATK": 18,
    "baseDEF": 22,
    "elementAffinity": { "nature": 0.30, "fire": -0.20 },
    "behavior": "ancient",
    "flavor": "Towering plant‑titan hybrids, embodiments of ancient forests and primal growth.",
    "familyModifiers": {
      "atkMult": 1.10,
      "defMult": 1.35,
      "statusEffectChanceMult": 1.20,
      "notes": "Extremely durable; inflict roots, thorns, and nature‑based debuffs."
    }
  }, 
  
  "phoenix_family": {
    "key": "phoenix_family",
    "tier": 4,
    "baseHP": 170,
    "baseATK": 24,
    "baseDEF": 14,
    "elementAffinity": { "fire": 0.35, "holy": 0.15 },
    "behavior": "reborn",
    "flavor": "Mythic firebirds of rebirth, blazing with divine flame and radiant fury.",
    "familyModifiers": {
      "atkMult": 1.35,
      "defMult": 1.05,
      "specialRules": { "rebirth": true },
      "notes": "High fire damage, radiant bursts, and revival mechanics."
    }
  }, 
  
  "worldrender_family": {
    "key": "worldrender_family",
    "tier": 6,
    "baseHP": 300,
    "baseATK": 28,
    "baseDEF": 26,
    "elementAffinity": { "earth": 0.25, "arcane": 0.20 },
    "behavior": "cataclysmic",
    "flavor": "Apocalyptic titans whose movements reshape continents and fracture reality.",
    "familyModifiers": {
      "atkMult": 1.50,
      "defMult": 1.40,
      "speedBias": -0.10,
      "notes": "World‑shaking blows, seismic ruptures, and catastrophic AoE effects."
    }
  },

  "giantkin": {
    "key": "giantkin",
    "tier": 2,
    "baseHP": 180,
    "baseATK": 17,
    "baseDEF": 14,
    "elementAffinity": { "earth": 0.10 },
    "behavior": "brutal",
    "flavor": "Massive humanoids with overwhelming physical strength.",
    "familyModifiers": {
      "atkMult": 1.20,
      "defMult": 1.15,
      "notes": "Slow but devastating; excel in raw physical combat."
    }
  },

  "titan": {
    "key": "titan",
    "tier": 2,
    "baseHP": 200,
    "baseATK": 22,
    "baseDEF": 18,
    "elementAffinity": { "earth": 0.15, "arcane": 0.10 },
    "behavior": "colossal",
    "flavor": "Ancient beings of immense size and power, embodiments of natural forces.",
    "familyModifiers": {
      "atkMult": 1.35,
      "defMult": 1.25,
      "notes": "Titans are near‑unstoppable forces of nature."
    }
  },

  "eldritch": {
    "key": "eldritch",
    "tier": 3,
    "behavior": "chaotic",
    "flavor": "Unknowable beings shaped by madness and impossible geometry.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "aberration": {
    "key": "aberration",
    "tier": 3,
    "behavior": "unstable",
    "flavor": "Twisted lifeforms that defy natural biology.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "astral": {
    "key": "astral",
    "tier": 3,
    "behavior": "drifting",
    "flavor": "Creatures touched by the Astral Sea and cosmic thought.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "chaosborn": {
    "key": "chaosborn",
    "tier": 3,
    "behavior": "volatile",
    "flavor": "Entities infused with raw, unpredictable chaos energy.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "mythic_beast": {
    "key": "mythic_beast",
    "tier": 3,
    "behavior": "feral",
    "flavor": "Legendary beasts of ancient power and impossible resilience.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "mythic_undead": {
    "key": "mythic_undead",
    "tier": 3,
    "behavior": "eternal",
    "flavor": "Undead of mythic stature, animated by ancient curses.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "void": {
    "key": "void",
    "tier": 4,
    "behavior": "entropy",
    "flavor": "Beings shaped by the emptiness between realities.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "outer_god": {
    "key": "outer_god",
    "tier": 4,
    "behavior": "cosmic",
    "flavor": "Vast cosmic intelligences whose motives transcend mortal logic.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "primordial": {
    "key": "primordial",
    "tier": 4,
    "behavior": "ancient",
    "flavor": "Primeval forces given form, older than the world itself.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "anomaly": {
    "key": "anomaly",
    "tier": 5,
    "behavior": "erratic",
    "flavor": "Reality‑breaking entities that do not obey physical laws.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "parasite": {
    "key": "parasite",
    "tier": 5,
    "behavior": "consuming",
    "flavor": "Lifeforms that feed on hosts, energy, or even concepts.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "amorphous": {
    "key": "amorphous",
    "tier": 5,
    "behavior": "shifting",
    "flavor": "Shapeless entities with fluid forms and unpredictable movement.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "hivemind": {
    "key": "hivemind",
    "tier": 5,
    "behavior": "collective",
    "flavor": "Networked organisms acting as a single distributed intelligence.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "metaphysical_phenomenon": {
    "key": "metaphysical_phenomenon",
    "tier": 5,
    "behavior": "conceptual",
    "flavor": "Manifestations of ideas, emotions, or narrative forces.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "divinity": {
    "key": "divinity",
    "tier": 6,
    "behavior": "transcendent",
    "flavor": "Godlike beings radiating overwhelming spiritual power.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "paragon": {
    "key": "paragon",
    "tier": 6,
    "behavior": "ascended",
    "flavor": "Perfected forms of existence, embodiments of ultimate mastery.",
    "elementAffinity": {},
    "familyModifiers": {}
  },

  "multiversal_paragon": {
    "key": "multiversal_paragon",
    "tier": 7,
    "behavior": "omni",
    "flavor": "Entities whose influence spans countless universes.",
    "elementAffinity": {},
    "familyModifiers": {}
  }
};

// biomes.js
// Canonical biome definitions (converted from biomes.json)
// Fully GitHub-native ES module.

export const BIOMES = {
  "forest": {
    "name": "Forest",
    "flavor": [
      "The trees whisper as you pass.",
      "Sunlight flickers through the leaves like dancing spirits.",
      "A distant howl echoes through the canopy."
    ],
    "encounterWeights": {
      "beast": 35,
      "slimeborn": 15,
      "plantfolk": 15,
      "humanoid": 20,
      "fae": 10,
      "undead": 5
    },
    "hazards": [
      { "key": "hidden_root_snare", "chance": 0.08 }
    ],
    "weatherPool": ["clear", "overcast", "rain"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.0,
      "enemyDEFMult": 1.0,
      "elementBias": { "nature": 0.10 },
      "statusEffectChanceMult": 1.0,
      "notes": "Dense foliage favors ambush predators and nature‑aligned magic."
    }
  },

  "deep-forest": {
    "name": "Deep Forest",
    "flavor": [
      "The forest grows unnaturally quiet.",
      "Ancient trees loom overhead, their roots twisting like veins.",
      "You feel unseen eyes watching from the shadows."
    ],
    "encounterWeights": {
      "beast": 25,
      "plantfolk": 20,
      "fae": 20,
      "undead": 10,
      "spirit": 15,
      "mythic_beast": 10
    },
    "hazards": [
      { "key": "root_pitfall", "chance": 0.10 },
      { "key": "bewitching_spores", "chance": 0.06 }
    ],
    "weatherPool": ["overcast", "rain", "fog"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "nature": 0.15, "dark": 0.05 },
      "statusEffectChanceMult": 1.15,
      "notes": "Ancient magic and thick undergrowth hinder movement but empower spirits and fae."
    }
  },

  "wild-forest": {
    "name": "Wild Forest",
    "flavor": [
      "Untamed growth crowds the path ahead.",
      "Bird calls and beast cries overlap in a chaotic chorus.",
      "The forest feels alive, restless, and unpredictable."
    ],
    "encounterWeights": {
      "beast": 40,
      "beastkin": 15,
      "slimeborn": 10,
      "plantfolk": 15,
      "chimera": 10,
      "fae": 10
    },
    "hazards": [
      { "key": "charging_beast", "chance": 0.09 }
    ],
    "weatherPool": ["clear", "rain", "storm"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.0,
      "elementBias": { "nature": 0.15 },
      "statusEffectChanceMult": 1.1,
      "notes": "Unstable wildlife and overgrowth favor fast, aggressive creatures."
    }
  },

  "ancient-forest": {
    "name": "Ancient Forest",
    "flavor": [
      "Colossal trees tower like living titans.",
      "The air hums with ancient magic.",
      "Roots twist into natural pathways beneath your feet."
    ],
    "encounterWeights": {
      "plantfolk": 30,
      "spirit": 20,
      "fae": 20,
      "mythic_beast": 15,
      "elementalborn": 10,
      "astralborn": 5
    },
    "hazards": [
      { "key": "awakened_roots", "chance": 0.12 }
    ],
    "weatherPool": ["overcast", "rain", "mystic_fog"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.1,
      "elementBias": { "nature": 0.20, "arcane": 0.05 },
      "statusEffectChanceMult": 1.2,
      "notes": "Ancient magic and awakened flora empower spirits and plantfolk."
    }
  },

  "eldergrove-depths": {
    "name": "Eldergrove Depths",
    "flavor": [
      "The forest floor is carpeted in luminous moss.",
      "Whispers drift between the trees like half‑remembered prayers.",
      "You feel as though you are walking through a memory older than the world."
    ],
    "encounterWeights": {
      "spirit": 25,
      "plantfolk": 25,
      "fae": 20,
      "mythic_beast": 15,
      "mythic_undead": 10,
      "astralborn": 5
    },
    "hazards": [
      { "key": "spirit_drain", "chance": 0.10 }
    ],
    "weatherPool": ["mystic_fog", "soft_rain"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.1,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "nature": 0.2, "holy": 0.05, "dark": 0.05 },
      "statusEffectChanceMult": 1.25,
      "notes": "Spiritual resonance amplifies both healing and hexes."
    }
  },

  "elderwood-heart": {
    "name": "Elderwood Heart",
    "flavor": [
      "You stand where the forest’s lifeblood converges.",
      "Every leaf seems to turn toward you in silent judgment.",
      "The air is thick with the weight of countless seasons."
    ],
    "encounterWeights": {
      "plantfolk": 30,
      "spirit": 25,
      "mythic_beast": 15,
      "elementalborn": 10,
      "mythic_undead": 10,
      "divine_beast": 10
    },
    "hazards": [
      { "key": "wrath_of_the_grove", "chance": 0.15 }
    ],
    "weatherPool": ["mystic_fog", "rain", "sunbeam_breaks"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.1,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.15,
      "elementBias": { "nature": 0.25, "holy": 0.05 },
      "statusEffectChanceMult": 1.3,
      "notes": "The heart of the forest fiercely defends itself and its chosen guardians."
    }
  },

  "primeval-overgrowth": {
    "name": "Primeval Overgrowth",
    "flavor": [
      "Vines as thick as trunks coil around ancient stone.",
      "The air is heavy with the scent of sap and old storms.",
      "You feel as though you’ve stepped into a world that never knew civilization."
    ],
    "encounterWeights": {
      "beast": 25,
      "mythic_beast": 20,
      "plantfolk": 20,
      "chimera": 15,
      "primordial": 10,
      "titanborn": 10
    },
    "hazards": [
      { "key": "collapsing_canopy", "chance": 0.12 },
      { "key": "toxic_pollen_cloud", "chance": 0.08 }
    ],
    "weatherPool": ["humid", "storm", "overcast"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "nature": 0.2, "earth": 0.1 },
      "statusEffectChanceMult": 1.25,
      "notes": "Raw, ancient life energy empowers colossal beasts and primordial forces."
    }
  },

  "plains": {
    "name": "Plains",
    "flavor": [
      "Wind sweeps across the open fields.",
      "Tall grass rustles with hidden movement.",
      "The horizon stretches endlessly in every direction."
    ],
    "encounterWeights": {
      "beast": 40,
      "humanoid": 25,
      "beastkin": 15,
      "slimeborn": 10,
      "dragonkin": 5,
      "mythic_beast": 5
    },
    "hazards": [
      { "key": "stampede", "chance": 0.07 }
    ],
    "weatherPool": ["clear", "windy", "storm"],
    "combatModifiers": {
      "playerATKMult": 1.05,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 0.95,
      "elementBias": { "wind": 0.1 },
      "statusEffectChanceMult": 1.0,
      "notes": "Open terrain favors mobility and ranged combat."
    }
  },

  "open-steppe": {
    "name": "Open Steppe",
    "flavor": [
      "The sky feels impossibly vast above you.",
      "Sparse shrubs cling to the dry soil.",
      "Distant thunder rolls across the horizon."
    ],
    "encounterWeights": {
      "beast": 35,
      "humanoid": 20,
      "beastkin": 15,
      "dragonkin": 10,
      "mythic_beast": 10,
      "giantkin": 10
    },
    "hazards": [
      { "key": "dust_storm", "chance": 0.1 }
    ],
    "weatherPool": ["clear", "windy", "dust_storm"],
    "combatModifiers": {
      "playerATKMult": 1.05,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 0.95,
      "elementBias": { "wind": 0.1, "earth": 0.05 },
      "statusEffectChanceMult": 1.05,
      "notes": "Harsh winds and open ground reward endurance and long‑range tactics."
    }
  },

  "plateau": {
    "name": "Plateau",
    "flavor": [
      "Wind sweeps across the high flatlands.",
      "The sky feels impossibly close.",
      "You hear distant thunder rolling across the plains below."
    ],
    "encounterWeights": {
      "beast": 25,
      "giantkin": 20,
      "titanborn": 10,
      "humanoid": 20,
      "elementalborn": 15,
      "dragon": 10
    },
    "hazards": [
      { "key": "sheer_drop", "chance": 0.08 }
    ],
    "weatherPool": ["clear", "storm", "windy"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "storm": 0.1, "wind": 0.1 },
      "statusEffectChanceMult": 1.1,
      "notes": "High altitude and storms empower storm‑aligned and giant‑blooded foes."
    }
  },

  "swamp": {
    "name": "Swamp",
    "flavor": [
      "Thick fog clings to the stagnant water.",
      "The air reeks of decay and rot.",
      "Something bubbles beneath the murky surface."
    ],
    "encounterWeights": {
      "undead": 30,
      "beast": 20,
      "slimeborn": 15,
      "plantfolk": 10,
      "parasite": 10,
      "amorphous": 15
    },
    "hazards": [
      { "key": "sinking_mire", "chance": 0.12 }
    ],
    "weatherPool": ["fog", "rain", "overcast"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "poison": 0.15, "water": 0.1 },
      "statusEffectChanceMult": 1.25,
      "notes": "Rot and stagnant water favor poison, disease, and attrition tactics."
    }
  },

  "drowned-marsh": {
    "name": "Drowned Marsh",
    "flavor": [
      "Waterlogged ground squelches beneath every step.",
      "Rotting trees jut from the murky water like broken teeth.",
      "The air is thick with the buzz of unseen insects."
    ],
    "encounterWeights": {
      "undead": 35,
      "beast": 25,
      "amorphous": 20,
      "parasite": 10,
      "slimeborn": 10
    },
    "hazards": [
      { "key": "bog_sinkhole", "chance": 0.12 }
    ],
    "weatherPool": ["fog", "rain"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "water": 0.1, "poison": 0.1 },
      "statusEffectChanceMult": 1.2,
      "notes": "Murky waters amplify poison and hinder movement."
    }
  },

  "whispering-marsh": {
    "name": "Whispering Marsh",
    "flavor": [
      "Voices drift across the water, never quite forming words.",
      "Pale lights flicker in the distance, luring the unwary.",
      "Every ripple feels like something watching from below."
    ],
    "encounterWeights": {
      "spirit": 25,
      "undead": 25,
      "parasite": 15,
      "amorphous": 15,
      "fae": 10,
      "mythic_undead": 10
    },
    "hazards": [
      { "key": "will_o_wisp_lure", "chance": 0.1 }
    ],
    "weatherPool": ["fog", "mystic_fog", "rain"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "water": 0.1, "dark": 0.1 },
      "statusEffectChanceMult": 1.3,
      "notes": "Illusory lights and spectral whispers disorient intruders."
    }
  },

  "desert": {
    "name": "Desert",
    "flavor": [
      "Heat radiates from the endless dunes.",
      "The sun beats down mercilessly.",
      "Wind carries grains of sand like tiny blades."
    ],
    "encounterWeights": {
      "beast": 30,
      "humanoid": 25,
      "elementalborn": 15,
      "undead": 10,
      "dragonkin": 10,
      "construct": 10
    },
    "hazards": [
      { "key": "sandstorm", "chance": 0.12 }
    ],
    "weatherPool": ["clear", "heatwave", "sandstorm"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.0,
      "elementBias": { "fire": 0.1, "earth": 0.1 },
      "statusEffectChanceMult": 1.1,
      "notes": "Harsh heat and shifting sands favor hardy and burrowing foes."
    }
  },

  "sunscorched-dunes": {
    "name": "Sunscorched Dunes",
    "flavor": [
      "The air shimmers with oppressive heat.",
      "Bones bleach quickly beneath the relentless sun.",
      "Every dune looks like the last, stretching into infinity."
    ],
    "encounterWeights": {
      "beast": 25,
      "undead": 20,
      "elementalborn": 20,
      "dragonkin": 15,
      "mythic_beast": 10,
      "primordial": 10
    },
    "hazards": [
      { "key": "blinding_sunflare", "chance": 0.1 }
    ],
    "weatherPool": ["heatwave", "clear"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.05,
      "elementBias": { "fire": 0.15, "light": 0.05 },
      "statusEffectChanceMult": 1.2,
      "notes": "Extreme heat saps stamina and empowers fire‑aligned foes."
    }
  },

  "shattered-desert": {
    "name": "Shattered Desert",
    "flavor": [
      "Jagged glass and cracked stone litter the sands.",
      "The land looks as if it was once shattered by some colossal force.",
      "Heat rises from fissures that never cool."
    ],
    "encounterWeights": {
      "elementalborn": 25,
      "construct": 20,
      "primordial": 20,
      "dragon": 15,
      "mythic_beast": 10,
      "chaosborn": 10
    },
    "hazards": [
      { "key": "glass_shard_field", "chance": 0.12 }
    ],
    "weatherPool": ["heatwave", "storm", "ashfall"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.05,
      "elementBias": { "fire": 0.15, "earth": 0.1, "chaos": 0.05 },
      "statusEffectChanceMult": 1.25,
      "notes": "A scarred desert where elemental and chaotic forces still linger."
    }
  },

  "void-wastes": {
    "name": "Void Wastes",
    "flavor": [
      "The sand here seems to swallow light.",
      "Shadows stretch in impossible directions.",
      "The air hums with a low, unsettling resonance."
    ],
    "encounterWeights": {
      "voidborn": 30,
      "anomaly": 20,
      "eldritch": 20,
      "aberration": 15,
      "outer_god": 10,
      "mythic_undead": 5
    },
    "hazards": [
      { "key": "void_rift", "chance": 0.15 }
    ],
    "weatherPool": ["void_storm", "dark_overcast"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "void": 0.25, "dark": 0.1 },
      "statusEffectChanceMult": 1.35,
      "notes": "Reality is thin and hostile, favoring void‑aligned horrors."
    }
  },

  "tundra": {
    "name": "Tundra",
    "flavor": [
      "A biting wind cuts through your armor.",
      "Snow crunches beneath your boots.",
      "The world is silent beneath a blanket of frost."
    ],
    "encounterWeights": {
      "beast": 30,
      "mythic_beast": 10,
      "undead": 15,
      "giantkin": 15,
      "titanborn": 10,
      "elementalborn": 20
    },
    "hazards": [
      { "key": "whiteout_blizzard", "chance": 0.1 }
    ],
    "weatherPool": ["snow", "blizzard", "clear_cold"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "ice": 0.2 },
      "statusEffectChanceMult": 1.2,
      "notes": "Cold saps strength and favors frost‑aligned creatures."
    }
  },

  "frozen-expanse": {
    "name": "Frozen Expanse",
    "flavor": [
      "The horizon is a seamless sheet of ice and sky.",
      "Your breath crystallizes instantly in the air.",
      "Every sound feels muffled by the endless snow."
    ],
    "encounterWeights": {
      "elementalborn": 25,
      "mythic_beast": 15,
      "titanborn": 15,
      "giantkin": 15,
      "mythic_undead": 15,
      "dragon": 15
    },
    "hazards": [
      { "key": "ice_crack_collapse", "chance": 0.12 }
    ],
    "weatherPool": ["blizzard", "snow", "clear_cold"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "ice": 0.25, "wind": 0.05 },
      "statusEffectChanceMult": 1.25,
      "notes": "Extreme cold and unstable ice favor massive and frost‑aligned foes."
    }
  },

  "crystalline-tundra": {
    "name": "Crystalline Tundra",
    "flavor": [
      "Shards of ice jut from the ground like glass spires.",
      "Light refracts into cold, shimmering rainbows.",
      "Each step crunches over frost‑coated crystal."
    ],
    "encounterWeights": {
      "elementalborn": 30,
      "construct": 15,
      "mythic_beast": 15,
      "astralborn": 10,
      "primordial": 15,
      "dragon": 15
    },
    "hazards": [
      { "key": "shattering_ice_spike", "chance": 0.1 }
    ],
    "weatherPool": ["clear_cold", "snow", "crystal_glow"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "ice": 0.25, "arcane": 0.1 },
      "statusEffectChanceMult": 1.3,
      "notes": "Crystalline resonance amplifies both frost and arcane energies."
    }
  },

  "highlands": {
    "name": "Highlands",
    "flavor": [
      "Cold winds sweep across the rocky cliffs.",
      "Thunder rumbles in the distance.",
      "The air is thin but invigorating."
    ],
    "encounterWeights": {
      "beast": 25,
      "giantkin": 20,
      "titanborn": 10,
      "humanoid": 20,
      "dragonkin": 15,
      "elementalborn": 10
    },
    "hazards": [
      { "key": "rockslide", "chance": 0.1 }
    ],
    "weatherPool": ["clear", "storm", "windy"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "storm": 0.1, "earth": 0.1 },
      "statusEffectChanceMult": 1.1,
      "notes": "Steep terrain and storms favor large and storm‑touched foes."
    }
  },

  "storm-highlands": {
    "name": "Storm Highlands",
    "flavor": [
      "Lightning dances across distant peaks.",
      "Thunder feels close enough to touch.",
      "The wind howls like a living thing."
    ],
    "encounterWeights": {
      "titanborn": 20,
      "giantkin": 20,
      "elementalborn": 20,
      "dragon": 15,
      "mythic_beast": 15,
      "primordial": 10
    },
    "hazards": [
      { "key": "lightning_strike", "chance": 0.12 }
    ],
    "weatherPool": ["storm", "thunderclouds", "windy"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "storm": 0.25, "electric": 0.15 },
      "statusEffectChanceMult": 1.3,
      "notes": "Relentless storms empower thunder and lightning‑aligned entities."
    }
  },

  "mountain-peak": {
    "name": "Mountain Peak",
    "flavor": [
      "The air is thin and frigid.",
      "Clouds swirl below your vantage point.",
      "A fierce wind threatens to push you back."
    ],
    "encounterWeights": {
      "dragon": 25,
      "mythic_beast": 20,
      "giantkin": 15,
      "titanborn": 15,
      "elementalborn": 15,
      "celestial": 10
    },
    "hazards": [
      { "key": "sudden_gale", "chance": 0.1 }
    ],
    "weatherPool": ["clear_cold", "storm", "snow"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "wind": 0.2, "ice": 0.1 },
      "statusEffectChanceMult": 1.2,
      "notes": "High altitude and fierce winds favor flying and colossal foes."
    }
  },

  "mountain": {
    "name": "Mountain",
    "flavor": [
      "Jagged cliffs tower above you.",
      "Loose stones shift underfoot.",
      "A cold wind whistles through narrow passes."
    ],
    "encounterWeights": {
      "beast": 25,
      "giantkin": 20,
      "construct": 10,
      "dragonkin": 15,
      "elementalborn": 15,
      "titanborn": 15
    },
    "hazards": [
      { "key": "falling_rocks", "chance": 0.1 }
    ],
    "weatherPool": ["clear", "windy", "snow"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "earth": 0.15, "wind": 0.05 },
      "statusEffectChanceMult": 1.1,
      "notes": "Treacherous footing and narrow ledges favor sure‑footed and massive foes."
    }
  },

  "volcano": {
    "name": "Volcano",
    "flavor": [
      "Ash falls like snow around you.",
      "Molten cracks glow beneath your feet.",
      "The air shimmers with intense heat."
    ],
    "encounterWeights": {
      "elementalborn": 25,
      "demonborn": 20,
      "construct": 15,
      "dragon": 20,
      "primordial": 10,
      "chaosborn": 10
    },
    "hazards": [
      { "key": "lava_surge", "chance": 0.12 }
    ],
    "weatherPool": ["ashfall", "heatwave"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "fire": 0.3, "earth": 0.1 },
      "statusEffectChanceMult": 1.3,
      "notes": "Volcanic fury empowers fire and magma‑aligned entities."
    }
  },

  "molten-crest": {
    "name": "Molten Crest",
    "flavor": [
      "Rivers of lava carve glowing paths through black stone.",
      "The ground trembles with each distant eruption.",
      "Heat distorts the air into wavering mirages."
    ],
    "encounterWeights": {
      "elementalborn": 30,
      "demonborn": 20,
      "construct": 15,
      "dragon": 20,
      "primordial": 10,
      "titanborn": 5
    },
    "hazards": [
      { "key": "lava_eruption", "chance": 0.15 }
    ],
    "weatherPool": ["ashfall", "heatwave", "ember_rain"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "fire": 0.35, "chaos": 0.1 },
      "statusEffectChanceMult": 1.35,
      "notes": "An apex volcanic biome where only the most heat‑forged beings thrive."
    }
  },

  "magma": {
    "name": "Magma Fields",
    "flavor": [
      "Lava bubbles dangerously close.",
      "Heat distorts the air around you.",
      "The ground trembles with volcanic fury."
    ],
    "encounterWeights": {
      "elementalborn": 30,
      "construct": 20,
      "demonborn": 20,
      "dragon": 15,
      "primordial": 15
    },
    "hazards": [
      { "key": "magma_burst", "chance": 0.12 }
    ],
    "weatherPool": ["ashfall", "heatwave"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "fire": 0.3 },
      "statusEffectChanceMult": 1.25,
      "notes": "Unstable magma flows punish missteps and reward fire‑aligned resilience."
    }
  },

  "cave": {
    "name": "Cave",
    "flavor": [
      "Dripping water echoes in the darkness.",
      "The air is cold and stale.",
      "Shadows twist unnaturally along the cavern walls."
    ],
    "encounterWeights": {
      "beast": 25,
      "slimeborn": 20,
      "undead": 15,
      "insectoids": 20,
      "arachnids": 15,
      "construct": 5
    },
    "hazards": [
      { "key": "ceiling_collapse", "chance": 0.1 }
    ],
    "weatherPool": ["stale_air", "dripping_echoes"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "dark": 0.1, "earth": 0.1 },
      "statusEffectChanceMult": 1.1,
      "notes": "Tight spaces favor ambush predators and burrowing creatures."
    }
  },

  "crystal-cave": {
    "name": "Crystal Cave",
    "flavor": [
      "Crystals hum with faint arcane resonance.",
      "Light refracts into shimmering patterns.",
      "Your footsteps echo like chimes."
    ],
    "encounterWeights": {
      "construct": 20,
      "elementalborn": 20,
      "spirit": 15,
      "aberration": 15,
      "eldritch": 10,
      "astralborn": 20
    },
    "hazards": [
      { "key": "crystal_resonance_burst", "chance": 0.1 }
    ],
    "weatherPool": ["arcane_glow"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.05,
      "elementBias": { "arcane": 0.25, "light": 0.05 },
      "statusEffectChanceMult": 1.25,
      "notes": "Crystalline resonance amplifies spells and psionic effects."
    }
  },

  "prism-caverns": {
    "name": "Prism Caverns",
    "flavor": [
      "Prismatic light fractures across every surface.",
      "Shifting colors make it hard to judge distance.",
      "The air vibrates with a low, harmonic tone."
    ],
    "encounterWeights": {
      "astralborn": 25,
      "construct": 20,
      "elementalborn": 20,
      "eldritch": 15,
      "aberration": 10,
      "meta_entity": 10
    },
    "hazards": [
      { "key": "prismatic_beam", "chance": 0.12 }
    ],
    "weatherPool": ["arcane_glow", "color_shift"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "arcane": 0.3, "light": 0.1 },
      "statusEffectChanceMult": 1.3,
      "notes": "Prismatic energies warp perception and empower spellcasters."
    }
  },

  "underdeep": {
    "name": "Underdeep",
    "flavor": [
      "The tunnels stretch endlessly in all directions.",
      "Faint vibrations hint at movement below.",
      "The darkness feels thick enough to touch."
    ],
    "encounterWeights": {
      "aberration": 25,
      "eldritch": 20,
      "insectoids": 20,
      "arachnids": 15,
      "undead": 10,
      "mythic_undead": 10
    },
    "hazards": [
      { "key": "cave_in", "chance": 0.12 }
    ],
    "weatherPool": ["stale_air", "echoing_void"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "dark": 0.2, "earth": 0.1 },
      "statusEffectChanceMult": 1.3,
      "notes": "Deep subterranean pressure and darkness favor aberrant and undead forces."
    }
  },

  "subterranean": {
    "name": "Subterranean",
    "flavor": [
      "Moisture drips from the stone ceiling.",
      "The air is cool and still.",
      "You feel the weight of the world pressing down from above."
    ],
    "encounterWeights": {
      "insectoids": 25,
      "arachnids": 20,
      "slimeborn": 15,
      "undead": 15,
      "construct": 10,
      "aberration": 15
    },
    "hazards": [
      { "key": "unstable_tunnel", "chance": 0.1 }
    ],
    "weatherPool": ["stale_air"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "earth": 0.15, "dark": 0.1 },
      "statusEffectChanceMult": 1.15,
      "notes": "Confined tunnels favor burrowing and ambush‑oriented creatures."
    }
  },

  "deep-caverns": {
    "name": "Deep Caverns",
    "flavor": [
      "You descend into depths where light feels like an intruder.",
      "Strange echoes answer your every sound.",
      "The stone here feels older than memory."
    ],
    "encounterWeights": {
      "eldritch": 25,
      "aberration": 25,
      "mythic_undead": 15,
      "voidborn": 15,
      "anomaly": 10,
      "outer_god": 10
    },
    "hazards": [
      { "key": "reality_fracture", "chance": 0.12 }
    ],
    "weatherPool": ["echoing_void"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "dark": 0.2, "void": 0.2 },
      "statusEffectChanceMult": 1.35,
      "notes": "The deepest caverns brush against the void, warping both stone and sanity."
    }
  },

  "ruins": {
    "name": "Ruins",
    "flavor": [
      "Broken stone structures hint at a forgotten age.",
      "Dust swirls through collapsed hallways.",
      "Faded carvings watch you with empty eyes."
    ],
    "encounterWeights": {
      "undead": 25,
      "construct": 20,
      "humanoid": 20,
      "spirit": 15,
      "mimic": 10,
      "mythic_undead": 10
    },
    "hazards": [
      { "key": "collapsing_archway", "chance": 0.1 }
    ],
    "weatherPool": ["overcast", "dusty"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "dark": 0.1, "arcane": 0.05 },
      "statusEffectChanceMult": 1.1,
      "notes": "Echoes of past civilizations empower lingering spirits and guardians."
    }
  },

  "forgotten-ruins": {
    "name": "Forgotten Ruins",
    "flavor": [
      "Vines and moss reclaim once‑grand structures.",
      "Strange glyphs glow faintly beneath the overgrowth.",
      "You feel history pressing in from every direction."
    ],
    "encounterWeights": {
      "mythic_undead": 20,
      "construct": 20,
      "spirit": 20,
      "forgotten_race": 15,
      "aberration": 15,
      "mythic_beast": 10
    },
    "hazards": [
      { "key": "arcane_trap", "chance": 0.12 }
    ],
    "weatherPool": ["overcast", "mystic_fog"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "arcane": 0.15, "dark": 0.1 },
      "statusEffectChanceMult": 1.25,
      "notes": "Ancient wards and curses still cling to these long‑abandoned halls."
    }
  },

  "ruined-kingdom": {
    "name": "Ruined Kingdom",
    "flavor": [
      "Crumbling towers pierce a sky heavy with memory.",
      "Broken banners flutter in a wind that smells of dust.",
      "You walk streets where no living crowd has gathered in ages."
    ],
    "encounterWeights": {
      "mythic_undead": 25,
      "construct": 20,
      "spirit": 20,
      "paragon": 10,
      "forgotten_race": 15,
      "mythic_beast": 10
    },
    "hazards": [
      { "key": "collapsing_spire", "chance": 0.12 }
    ],
    "weatherPool": ["overcast", "storm", "mournful_wind"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.15,
      "elementBias": { "dark": 0.15, "holy": 0.05 },
      "statusEffectChanceMult": 1.3,
      "notes": "A fallen empire’s echoes empower its lingering champions and cursed royalty."
    }
  },

  "coastal": {
    "name": "Coastal",
    "flavor": [
      "Waves crash rhythmically against the shore.",
      "Salt fills the air.",
      "Seabirds cry overhead."
    ],
    "encounterWeights": {
      "beast": 30,
      "slimeborn": 15,
      "elementalborn": 15,
      "humanoid": 20,
      "mythic_beast": 10,
      "cosmic_fauna": 10
    },
    "hazards": [
      { "key": "rogue_wave", "chance": 0.08 }
    ],
    "weatherPool": ["clear", "rain", "storm"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.0,
      "elementBias": { "water": 0.2, "wind": 0.05 },
      "statusEffectChanceMult": 1.1,
      "notes": "Shifting tides and slick rocks favor agile and aquatic foes."
    }
  },

  "arcane": {
    "name": "Arcane",
    "flavor": [
      "Mana crackles in the air like static.",
      "Arcane glyphs glow faintly beneath your feet.",
      "Reality feels thin and malleable."
    ],
    "encounterWeights": {
      "elementalborn": 25,
      "astralborn": 20,
      "eldritch": 15,
      "construct": 15,
      "spiritborn": 15,
      "metaphysical_phenomenon": 10
    },
    "hazards": [
      { "key": "mana_surge", "chance": 0.12 }
    ],
    "weatherPool": ["arcane_glow", "mana_storm"],
    "combatModifiers": {
      "playerATKMult": 1.05,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.05,
      "elementBias": { "arcane": 0.3 },
      "statusEffectChanceMult": 1.3,
      "notes": "Unstable magic amplifies spells and can backfire spectacularly."
    }
  },

  "arcane-rift": {
    "name": "Arcane Rift",
    "flavor": [
      "Rents in reality leak raw mana into the air.",
      "Floating shards of stone orbit invisible centers.",
      "Your thoughts feel louder here, as if the world is listening."
    ],
    "encounterWeights": {
      "astralborn": 25,
      "eldritch": 20,
      "anomaly": 15,
      "metaphysical_phenomenon": 20,
      "outer_god": 10,
      "planar_entity": 10
    },
    "hazards": [
      { "key": "rift_collapse", "chance": 0.15 }
    ],
    "weatherPool": ["mana_storm", "arcane_glow"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "arcane": 0.35, "void": 0.1 },
      "statusEffectChanceMult": 1.35,
      "notes": "Rifts tear at causality, empowering entities from beyond the normal planes."
    }
  },

  "corrupted": {
    "name": "Corrupted Lands",
    "flavor": [
      "The ground pulses with sickly energy.",
      "Corrupted flora writhes as you pass.",
      "A foul stench permeates the air."
    ],
    "encounterWeights": {
      "undead": 25,
      "aberration": 20,
      "eldritch": 20,
      "parasite": 15,
      "voidborn": 10,
      "chaosborn": 10
    },
    "hazards": [
      { "key": "corruption_bloom", "chance": 0.12 }
    ],
    "weatherPool": ["miasma_fog", "dark_overcast"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "poison": 0.2, "dark": 0.2 },
      "statusEffectChanceMult": 1.4,
      "notes": "Corruption twists both land and life, favoring decay and madness."
    }
  },

  "void": {
    "name": "Voidlands",
    "flavor": [
      "The land is twisted by void corruption.",
      "Shadows move independently of the light.",
      "A low hum vibrates through your bones."
    ],
    "encounterWeights": {
      "voidborn": 30,
      "eldritch": 20,
      "anomaly": 20,
      "outer_god": 10,
      "aberration": 15,
      "mythic_undead": 5
    },
    "hazards": [
      { "key": "void_pulse", "chance": 0.15 }
    ],
    "weatherPool": ["void_storm", "dark_overcast"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "void": 0.3, "dark": 0.1 },
      "statusEffectChanceMult": 1.4,
      "notes": "Void saturation erodes sanity and empowers entities from beyond."
    }
  },

  "void-realm": {
    "name": "Void Realm",
    "flavor": [
      "Reality bends at the edges of your vision.",
      "Whispers claw at your mind from unseen places.",
      "Colors shift in impossible ways."
    ],
    "encounterWeights": {
      "voidborn": 30,
      "outer_god": 20,
      "anomaly": 20,
      "eldritch": 15,
      "planar_entity": 10,
      "paradox_god": 5
    },
    "hazards": [
      { "key": "reality_inversion", "chance": 0.18 }
    ],
    "weatherPool": ["void_storm", "color_shift"],
    "combatModifiers": {
      "playerATKMult": 0.85,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.2,
      "enemyDEFMult": 1.15,
      "elementBias": { "void": 0.35, "chaos": 0.15 },
      "statusEffectChanceMult": 1.5,
      "notes": "Pure voidspace where causality frays and only the impossible thrives."
    }
  },

  "astral-plane": {
    "name": "Astral Plane",
    "flavor": [
      "Stars swirl beneath your feet.",
      "Gravity feels optional here.",
      "Your thoughts echo like distant bells."
    ],
    "encounterWeights": {
      "astralborn": 30,
      "planar_entity": 20,
      "cosmic_fauna": 20,
      "outer_god": 10,
      "metaphysical_phenomenon": 10,
      "celestial": 10
    },
    "hazards": [
      { "key": "gravity_flux", "chance": 0.12 }
    ],
    "weatherPool": ["starlight_surge", "cosmic_wind"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "arcane": 0.2, "cosmic": 0.2 },
      "statusEffectChanceMult": 1.3,
      "notes": "Astral tides warp movement and empower beings of starlight and thought."
    }
  },

  "astral-nexus": {
    "name": "Astral Nexus",
    "flavor": [
      "Converging star‑paths knot together in luminous strands.",
      "You feel countless worlds brushing against your awareness.",
      "Every breath tastes like distant constellations."
    ],
    "encounterWeights": {
      "astralborn": 25,
      "outer_god": 15,
      "planar_entity": 20,
      "cosmic_fauna": 15,
      "meta_entity": 15,
      "multiversal_paragon": 10
    },
    "hazards": [
      { "key": "starfall_convergence", "chance": 0.18 }
    ],
    "weatherPool": ["cosmic_wind", "starlight_surge", "reality_glimmer"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.2,
      "enemyDEFMult": 1.15,
      "elementBias": { "cosmic": 0.3, "arcane": 0.2 },
      "statusEffectChanceMult": 1.5,
      "notes": "A convergence point of multiversal paths where only the most transcendent beings gather."
    }
  },

  "abyss": {
    "name": "Abyss",
    "flavor": [
      "Darkness stretches infinitely downward.",
      "The air feels heavy with dread.",
      "You sense something ancient stirring below."
    ],
    "encounterWeights": {
      "fiend": 30,
      "demonborn": 25,
      "mythic_undead": 15,
      "eldritch": 15,
      "voidborn": 10,
      "outer_god": 5
    },
    "hazards": [
      { "key": "bottomless_chasm", "chance": 0.15 }
    ],
    "weatherPool": ["suffocating_darkness"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.15,
      "elementBias": { "dark": 0.3, "fire": 0.1 },
      "statusEffectChanceMult": 1.4,
      "notes": "The abyss devours light and hope, empowering fiends and ancient horrors."
    }
  },

  "abyssal-deep": {
    "name": "Abyssal Deep",
    "flavor": [
      "You stand at the edge of an endless drop.",
      "The darkness below feels hungry.",
      "Every instinct screams at you to turn back."
    ],
    "encounterWeights": {
      "fiend": 25,
      "outer_god": 20,
      "paradox_god": 10,
      "eldritch": 20,
      "voidborn": 15,
      "mythic_undead": 10
    },
    "hazards": [
      { "key": "abyssal_pull", "chance": 0.2 }
    ],
    "weatherPool": ["suffocating_darkness", "void_storm"],
    "combatModifiers": {
      "playerATKMult": 0.85,
      "playerDEFMult": 0.85,
      "enemyATKMult": 1.2,
      "enemyDEFMult": 1.2,
      "elementBias": { "dark": 0.35, "void": 0.25 },
      "statusEffectChanceMult": 1.6,
      "notes": "The deepest reaches of the abyss, where even gods fear to gaze."
    }
  },

  /*
   * New Biomes from the updated REGIONS
   * This also includes the new biome for oceans
   */

  "storm-coast": {
    "name": "Storm Coast",
    "flavor": [
      "Waves crash violently against jagged rocks.",
      "Thunder rolls across the open sea.",
      "Salt and ozone sting the air."
    ],
    "encounterWeights": {
      "beast": 20,
      "waterborn": 25,
      "stormkin": 20,
      "pirate": 15,
      "elementalborn": 10,
      "leviathan_spawn": 10
    },
    "hazards": [
      { "key": "rogue_wave", "chance": 0.10 },
      { "key": "lightning_strike", "chance": 0.05 }
    ],
    "weatherPool": ["storm", "rain", "overcast"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "water": 0.15, "electric": 0.10 },
      "statusEffectChanceMult": 1.1,
      "notes": "Storm‑charged winds empower electric and water‑aligned foes."
    }
  },

  "island": {
    "name": "Island",
    "flavor": [
      "Palm trees sway gently in the sea breeze.",
      "Hidden coves dot the shoreline.",
      "The cries of distant seabirds echo overhead."
    ],
    "encounterWeights": {
      "beast": 25,
      "waterborn": 20,
      "pirate": 20,
      "beastkin": 15,
      "slimeborn": 10,
      "spirit": 10
    },
    "hazards": [
      { "key": "falling_coconut", "chance": 0.05 }
    ],
    "weatherPool": ["clear", "rain", "overcast"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.0,
      "enemyATKMult": 1.0,
      "enemyDEFMult": 1.0,
      "elementBias": { "water": 0.10, "nature": 0.05 },
      "statusEffectChanceMult": 1.0,
      "notes": "A balanced environment with a mix of land and sea threats."
    }
  },

  "reef": {
    "name": "Coral Reef",
    "flavor": [
      "Brilliant coral formations glow beneath the waves.",
      "Schools of fish scatter as you approach.",
      "The water is warm, vibrant, and deceptively dangerous."
    ],
    "encounterWeights": {
      "waterborn": 40,
      "reefkin": 20,
      "slimeborn": 10,
      "elementalborn": 10,
      "fae": 10,
      "leviathan_spawn": 10
    },
    "hazards": [
      { "key": "coral_spike", "chance": 0.08 }
    ],
    "weatherPool": ["clear", "rain"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.05,
      "elementBias": { "water": 0.20, "light": 0.05 },
      "statusEffectChanceMult": 1.1,
      "notes": "Dense coral and magical currents empower aquatic creatures."
    }
  },

  "open-ocean": {
    "name": "Open Ocean",
    "flavor": [
      "Endless waves stretch to the horizon.",
      "The water grows darker and colder.",
      "Something massive moves beneath the surface."
    ],
    "encounterWeights": {
      "waterborn": 35,
      "leviathan_spawn": 20,
      "pirate": 15,
      "elementalborn": 10,
      "abyssal": 10,
      "stormkin": 10
    },
    "hazards": [
      { "key": "maelstrom_pull", "chance": 0.07 }
    ],
    "weatherPool": ["clear", "storm", "fog"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "water": 0.25, "dark": 0.05 },
      "statusEffectChanceMult": 1.15,
      "notes": "Deep waters favor massive predators and abyssal forces."
    }
  },

  "eldritch-abyss": {
    "name": "Eldritch Abyss",
    "flavor": [
      "Reality bends and warps in the crushing depths.",
      "Whispers echo through the water, though no mouths speak.",
      "Bioluminescent horrors drift in the void."
    ],
    "encounterWeights": {
      "abyssal": 40,
      "eldritch": 25,
      "leviathan_spawn": 20,
      "voidborn": 10,
      "elementalborn": 5
    },
    "hazards": [
      { "key": "mindfracture_current", "chance": 0.12 }
    ],
    "weatherPool": ["abyssal_darkness"],
    "combatModifiers": {
      "playerATKMult": 0.85,
      "playerDEFMult": 1.1,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.2,
      "elementBias": { "void": 0.25, "dark": 0.15, "chaos": 0.10 },
      "statusEffectChanceMult": 1.25,
      "notes": "Eldritch forces twist magic and perception."
    }
  },

  "titanic-crater": {
    "name": "Titanic Crater",
    "flavor": [
      "A colossal impact scar radiates molten heat.",
      "The ground trembles with ancient power.",
      "Shards of celestial metal jut from the earth."
    ],
    "encounterWeights": {
      "titanborn": 30,
      "elementalborn": 20,
      "magma_beast": 20,
      "chimera": 15,
      "mythic_beast": 15
    },
    "hazards": [
      { "key": "magma_eruption", "chance": 0.10 }
    ],
    "weatherPool": ["ashfall", "heatwave"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.9,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "fire": 0.25, "earth": 0.10, "chaos": 0.05 },
      "statusEffectChanceMult": 1.2,
      "notes": "Residual cosmic energy empowers titanic and elemental foes."
    }
  },
  
  "astral-spirit": {
    "name": "Astral Spiritlands",
    "flavor": [
      "Ghostly silhouettes drift through shimmering starlight.",
      "Gravity feels lighter, as if the world itself exhales.",
      "Ethereal winds carry distant celestial hymns."
    ],
    "encounterWeights": {
      "spirit": 40,
      "astralborn": 25,
      "fae": 15,
      "elementalborn": 10,
      "mythic_beast": 10
    },
    "hazards": [
      { "key": "astral_dissonance", "chance": 0.08 }
    ],
    "weatherPool": ["astral_glow", "cosmic_wind"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.05,
      "enemyDEFMult": 1.1,
      "elementBias": { "cosmic": 0.15, "arcane": 0.10 },
      "statusEffectChanceMult": 1.1,
      "notes": "Ethereal energies empower spirits and astral beings."
    }
  },
  
  "celestial-spire": {
    "name": "Celestial Spire",
    "flavor": [
      "A radiant tower pierces the heavens.",
      "Light refracts into prismatic halos.",
      "The air hums with divine resonance."
    ],
    "encounterWeights": {
      "celestialborn": 40,
      "spirit": 20,
      "elementalborn": 15,
      "mythic_beast": 15,
      "astralborn": 10
    },
    "hazards": [
      { "key": "divine_radiance", "chance": 0.10 }
    ],
    "weatherPool": ["holy_light", "sunburst"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 1.1,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.15,
      "elementBias": { "holy": 0.20, "light": 0.10 },
      "statusEffectChanceMult": 1.2,
      "notes": "Divine energies empower celestial beings."
    }
  },
  
  "celestial-forge": {
    "name": "Celestial Forge",
    "flavor": [
      "Molten starlight flows like liquid gold.",
      "Hammers ring with divine resonance.",
      "The air burns with creation’s heat."
    ],
    "encounterWeights": {
      "celestialborn": 30,
      "elementalborn": 25,
      "mythic_beast": 20,
      "construct": 15,
      "spirit": 10
    },
    "hazards": [
      { "key": "solar_flare", "chance": 0.12 }
    ],
    "weatherPool": ["radiant_heat"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.15,
      "elementBias": { "holy": 0.15, "fire": 0.15 },
      "statusEffectChanceMult": 1.2,
      "notes": "Forged in divine fire, enemies strike with overwhelming force."
    }
  },
  
  "celestial-horizon": {
    "name": "Celestial Horizon",
    "flavor": [
      "The sky bends into an endless dawn.",
      "Light and shadow merge in impossible gradients.",
      "Time feels stretched, as if the world holds its breath."
    ],
    "encounterWeights": {
      "celestialborn": 35,
      "astralborn": 20,
      "spirit": 15,
      "elementalborn": 15,
      "mythic_beast": 15
    },
    "hazards": [
      { "key": "temporal_flux", "chance": 0.07 }
    ],
    "weatherPool": ["eternal_dawn", "cosmic_glow"],
    "combatModifiers": {
      "playerATKMult": 1.0,
      "playerDEFMult": 1.05,
      "enemyATKMult": 1.1,
      "enemyDEFMult": 1.1,
      "elementBias": { "light": 0.15, "cosmic": 0.10 },
      "statusEffectChanceMult": 1.1,
      "notes": "A realm where dawn never ends, empowering celestial forces."
    }
  },
  
  "celestial-fortress": {
    "name": "Celestial Fortress",
    "flavor": [
      "A radiant citadel stands against the void.",
      "Angelic sentinels patrol shimmering battlements.",
      "The air vibrates with divine authority."
    ],
    "encounterWeights": {
      "celestialborn": 45,
      "construct": 20,
      "spirit": 15,
      "elementalborn": 10,
      "mythic_beast": 10
    },
    "hazards": [
      { "key": "holy_barrier", "chance": 0.10 }
    ],
    "weatherPool": ["radiant_storm"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 1.1,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.2,
      "elementBias": { "holy": 0.25, "light": 0.10 },
      "statusEffectChanceMult": 1.2,
      "notes": "A bastion of divine power, guarded by celestial constructs."
    }
  },

  "arcane-storm": {
    "name": "Arcane Stormlands",
    "flavor": [
      "Crackling mana storms tear across the landscape.",
      "The ground pulses with unstable energy.",
      "Arcane lightning dances between floating stones."
    ],
    "encounterWeights": {
      "elementalborn": 30,
      "arcane_construct": 20,
      "stormkin": 20,
      "fae": 15,
      "astralborn": 15
    },
    "hazards": [
      { "key": "mana_surge", "chance": 0.12 },
      { "key": "arcane_lightning", "chance": 0.08 }
    ],
    "weatherPool": ["arcane_storm", "mana_fog", "charged_winds"],
    "combatModifiers": {
      "playerATKMult": 0.95,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.1,
      "elementBias": { "arcane": 0.25, "electric": 0.15 },
      "statusEffectChanceMult": 1.25,
      "notes": "Unstable mana storms empower arcane and electric-aligned foes."
    }
  },
  
  "void-labyrinth": {
    "name": "Void Labyrinth",
    "flavor": [
      "Corridors twist in impossible geometries.",
      "Whispers echo from directions that do not exist.",
      "Shadows stretch and coil like living things."
    ],
    "encounterWeights": {
      "voidborn": 40,
      "darkling": 20,
      "eldritch": 20,
      "spirit": 10,
      "construct": 10
    },
    "hazards": [
      { "key": "spatial_warp", "chance": 0.10 },
      { "key": "void_pulse", "chance": 0.08 }
    ],
    "weatherPool": ["void_static", "dark_fog"],
    "combatModifiers": {
      "playerATKMult": 0.9,
      "playerDEFMult": 0.95,
      "enemyATKMult": 1.15,
      "enemyDEFMult": 1.15,
      "elementBias": { "void": 0.25, "dark": 0.15 },
      "statusEffectChanceMult": 1.2,
      "notes": "Spatial distortion empowers voidborn entities."
    }
  }
};

export const BIOME_MODIFIERS = {
  "forest": {
    speedMult: 1.05,
    defMult: 1.05,
    elementDamage: { nature: 0.10 },
    elementResist: { fire: -0.05 }
  },

  "deep-forest": {
    speedMult: 1.05,
    defMult: 1.10,
    elementDamage: { nature: 0.15, dark: 0.05 },
    elementResist: { fire: -0.10 }
  },

  "wild-forest": {
    atkMult: 1.05,
    speedMult: 1.05,
    elementDamage: { nature: 0.15 },
    elementResist: { fire: -0.05 }
  },

  "ancient-forest": {
    defMult: 1.10,
    hpMult: 1.05,
    elementDamage: { nature: 0.20, arcane: 0.05 },
    elementResist: { fire: -0.10 }
  },

  "eldergrove-depths": {
    hpMult: 1.10,
    defMult: 1.10,
    elementDamage: { nature: 0.20, holy: 0.05, dark: 0.05 },
    elementResist: { fire: -0.10 }
  },

  "elderwood-heart": {
    hpMult: 1.15,
    defMult: 1.10,
    elementDamage: { nature: 0.25, holy: 0.05 },
    elementResist: { fire: -0.10 }
  },

  "primeval-overgrowth": {
    hpMult: 1.10,
    atkMult: 1.05,
    elementDamage: { nature: 0.20, earth: 0.10 },
    elementResist: { fire: -0.10 }
  },

  "plains": {
    speedMult: 1.05,
    elementDamage: { wind: 0.10 },
    elementResist: {}
  },

  "open-steppe": {
    speedMult: 1.05,
    atkMult: 1.05,
    elementDamage: { wind: 0.10, earth: 0.05 },
    elementResist: {}
  },

  "plateau": {
    speedMult: 1.05,
    elementDamage: { storm: 0.10, wind: 0.10 },
    elementResist: {}
  },

  "swamp": {
    defMult: 1.10,
    speedMult: 0.95,
    elementDamage: { poison: 0.15, water: 0.10 },
    elementResist: { poison: 0.10 }
  },

  "drowned-marsh": {
    defMult: 1.10,
    speedMult: 0.95,
    elementDamage: { water: 0.10, poison: 0.10 },
    elementResist: { water: 0.10 }
  },

  "whispering-marsh": {
    defMult: 1.10,
    speedMult: 0.95,
    elementDamage: { water: 0.10, dark: 0.10 },
    elementResist: { dark: 0.05 }
  },

  "desert": {
    speedMult: 1.05,
    elementDamage: { fire: 0.10, earth: 0.10 },
    elementResist: { fire: 0.05 }
  },

  "sunscorched-dunes": {
    speedMult: 1.10,
    elementDamage: { fire: 0.15, light: 0.05 },
    elementResist: { fire: 0.10 }
  },

  "shattered-desert": {
    atkMult: 1.10,
    speedMult: 1.05,
    elementDamage: { fire: 0.15, earth: 0.10, chaos: 0.05 },
    elementResist: { fire: 0.10 }
  },

  "void-wastes": {
    defMult: 1.05,
    elementDamage: { void: 0.25, dark: 0.10 },
    elementResist: { void: 0.10 }
  },

  "tundra": {
    defMult: 1.10,
    speedMult: 0.95,
    elementDamage: { ice: 0.20 },
    elementResist: { ice: 0.10 }
  },

  "frozen-expanse": {
    defMult: 1.10,
    speedMult: 0.90,
    elementDamage: { ice: 0.25, wind: 0.05 },
    elementResist: { ice: 0.15 }
  },

  "crystalline-tundra": {
    defMult: 1.10,
    hpMult: 1.05,
    elementDamage: { ice: 0.25, arcane: 0.10 },
    elementResist: { ice: 0.15 }
  },

  "highlands": {
    atkMult: 1.05,
    defMult: 1.05,
    elementDamage: { storm: 0.10, earth: 0.10 },
    elementResist: {}
  },

  "storm-highlands": {
    atkMult: 1.10,
    speedMult: 1.05,
    elementDamage: { storm: 0.25, electric: 0.15 },
    elementResist: { electric: 0.10 }
  },

  "mountain-peak": {
    speedMult: 1.10,
    defMult: 1.05,
    elementDamage: { wind: 0.20, ice: 0.10 },
    elementResist: { wind: 0.05 }
  },

  "mountain": {
    defMult: 1.10,
    elementDamage: { earth: 0.15, wind: 0.05 },
    elementResist: { earth: 0.10 }
  },

  "volcano": {
    atkMult: 1.10,
    elementDamage: { fire: 0.30, earth: 0.10 },
    elementResist: { fire: 0.15 }
  },

  "molten-crest": {
    atkMult: 1.15,
    elementDamage: { fire: 0.35, chaos: 0.10 },
    elementResist: { fire: 0.20 }
  },

  "magma": {
    atkMult: 1.10,
    elementDamage: { fire: 0.30 },
    elementResist: { fire: 0.15 }
  },

  "cave": {
    defMult: 1.10,
    elementDamage: { dark: 0.10, earth: 0.10 },
    elementResist: { dark: 0.05 }
  },

  "crystal-cave": {
    defMult: 1.05,
    elementDamage: { arcane: 0.25, light: 0.05 },
    elementResist: { arcane: 0.10 }
  },

  "prism-caverns": {
    defMult: 1.05,
    elementDamage: { arcane: 0.30, light: 0.10 },
    elementResist: { arcane: 0.10 }
  },

  "underdeep": {
    defMult: 1.10,
    elementDamage: { dark: 0.20, earth: 0.10 },
    elementResist: { dark: 0.10 }
  },

  "subterranean": {
    defMult: 1.10,
    elementDamage: { earth: 0.15, dark: 0.10 },
    elementResist: { earth: 0.10 }
  },

  "deep-caverns": {
    defMult: 1.10,
    elementDamage: { dark: 0.20, void: 0.20 },
    elementResist: { void: 0.10 }
  },

  "ruins": {
    defMult: 1.05,
    elementDamage: { dark: 0.10, arcane: 0.05 },
    elementResist: {}
  },

  "forgotten-ruins": {
    defMult: 1.05,
    elementDamage: { arcane: 0.15, dark: 0.10 },
    elementResist: { arcane: 0.05 }
  },

  "ruined-kingdom": {
    defMult: 1.10,
    elementDamage: { dark: 0.15, holy: 0.05 },
    elementResist: { dark: 0.05 }
  },

  "coastal": {
    speedMult: 1.05,
    elementDamage: { water: 0.20, wind: 0.05 },
    elementResist: { water: 0.10 }
  },

  "arcane": {
    atkMult: 1.05,
    elementDamage: { arcane: 0.30 },
    elementResist: { arcane: 0.10 }
  },

  "arcane-rift": {
    atkMult: 1.10,
    elementDamage: { arcane: 0.35, void: 0.10 },
    elementResist: { arcane: 0.10 }
  },

  "corrupted": {
    defMult: 1.05,
    elementDamage: { poison: 0.20, dark: 0.20 },
    elementResist: { poison: 0.10 }
  },

  "void": {
    defMult: 1.05,
    elementDamage: { void: 0.30, dark: 0.10 },
    elementResist: { void: 0.10 }
  },

  "void-realm": {
    defMult: 1.10,
    elementDamage: { void: 0.35, chaos: 0.15 },
    elementResist: { void: 0.15 }
  },

  "astral-plane": {
    atkMult: 1.05,
    elementDamage: { arcane: 0.20, cosmic: 0.20 },
    elementResist: { arcane: 0.10 }
  },

  "astral-nexus": {
    atkMult: 1.10,
    elementDamage: { cosmic: 0.30, arcane: 0.20 },
    elementResist: { cosmic: 0.10 }
  },

  "abyss": {
    defMult: 1.10,
    elementDamage: { dark: 0.30, fire: 0.10 },
    elementResist: { dark: 0.10 }
  },

  "abyssal-deep": {
    defMult: 1.15,
    elementDamage: { dark: 0.35, void: 0.25 },
    elementResist: { void: 0.15 }
  }
};

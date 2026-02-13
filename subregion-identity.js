export const SUBREGION_IDENTITY = {

  /* ============================================================
     FOREST / NATURE REGIONS
  ============================================================ */

  "forest-edge": {
    "mosslight-grove": {
      tier: 1,
      type: "grove",
      biome: "deep_forest",
      quirk: "Soft moss dampens footsteps, increasing ambush chance.",
      encounterBias: { beast: +10, plant: +5 },
      lootBias: ["herbs", "moss"]
    },
    "whisperbark-thicket": {
      tier: 2,
      type: "thicket",
      biome: "wildwood",
      quirk: "Dense brush reduces accuracy.",
      encounterBias: { beast: +5, dark: +5 },
      lootBias: ["wood", "spores"]
    },
    "sunleaf-clearing": {
      tier: 1,
      type: "clearing",
      biome: "deep_forest",
      quirk: "Healing herbs grow abundantly.",
      encounterBias: { plant: +10 },
      lootBias: ["herbs", "light_essence"]
    }
  },

  "verdant-woods": {
    "greenveil-path": {
      tier: 2,
      type: "path",
      biome: "wildwood",
      quirk: "Wildlife density increased.",
      encounterBias: { beast: +10 },
      lootBias: ["fur", "herbs"]
    },
    "bloomroot-hollow": {
      tier: 3,
      type: "hollow",
      biome: "overgrowth",
      quirk: "Roots occasionally snare enemies.",
      encounterBias: { plant: +10 },
      lootBias: ["roots", "fungal_spores"]
    },
    "eldermoss-rise": {
      tier: 4,
      type: "rise",
      biome: "wildwood",
      quirk: "Ancient spores cause random buffs or debuffs.",
      encounterBias: { plant: +5, arcane: +5 },
      lootBias: ["spores", "arcane_residue"]
    }
  },

  "primordial-grove": {
    "ancient-heartwood": {
      tier: 5,
      type: "grove",
      biome: "overgrowth",
      quirk: "Nature magic intensifies healing.",
      encounterBias: { plant: +10, spirit: +5 },
      lootBias: ["ancient_bark", "life_essence"]
    },
    "thornbind-crossing": {
      tier: 4,
      type: "crossing",
      biome: "deep_forest",
      quirk: "Thorn traps deal minor bleed.",
      encounterBias: { beast: +5, plant: +5 },
      lootBias: ["thorns", "beast_blood"]
    },
    "verdant-altar": {
      tier: 6,
      type: "altar",
      biome: "grove",
      quirk: "Elemental nature damage increased.",
      encounterBias: { nature: +10 },
      lootBias: ["nature_essence", "ancient_relic"]
    }
  },

  "verdant-wildwood": {
    "shadowfern-basin": {
      tier: 3,
      type: "basin",
      biome: "wildwood",
      quirk: "Fog reduces visibility.",
      encounterBias: { dark: +5, beast: +5 },
      lootBias: ["spores", "shadow_leaf"]
    },
    "rootspire-ridge": {
      tier: 4,
      type: "ridge",
      biome: "deep_forest",
      quirk: "Elevated terrain boosts ranged attacks.",
      encounterBias: { beast: +5 },
      lootBias: ["wood", "feathers"]
    },
    "glimmerleaf-run": {
      tier: 2,
      type: "run",
      biome: "wildwood",
      quirk: "Rare herbs spawn more often.",
      encounterBias: { plant: +10 },
      lootBias: ["rare_herbs"]
    }
  },

  /* ============================================================
     PLAINS / HIGHLANDS REGIONS
  ============================================================ */

  "plains-field": {
    "goldenwind-meadow": {
      tier: 1,
      type: "meadow",
      biome: "plains",
      quirk: "Wind boosts crit chance slightly.",
      encounterBias: { beast: +5, wind: +5 },
      lootBias: ["feathers", "grain"]
    },
    "stonehoof-steppe": {
      tier: 2,
      type: "steppe",
      biome: "open_steppe",
      quirk: "Beast encounters increased.",
      encounterBias: { beast: +10 },
      lootBias: ["fur", "meat"]
    },
    "suncrest-ridge": {
      tier: 3,
      type: "ridge",
      biome: "plains",
      quirk: "High visibility increases accuracy.",
      encounterBias: { wind: +5 },
      lootBias: ["feathers", "light_essence"]
    }
  },

  "highland-cliffs": {
    "stormwatch-bluff": {
      tier: 4,
      type: "bluff",
      biome: "storm_cliffs",
      quirk: "Lightning hazard chance increased.",
      encounterBias: { storm: +10 },
      lootBias: ["storm_essence"]
    },
    "razorwind-ledge": {
      tier: 3,
      type: "ledge",
      biome: "high_cliffs",
      quirk: "Wind reduces ranged accuracy.",
      encounterBias: { wind: +10 },
      lootBias: ["feathers"]
    },
    "eaglecrest-spire": {
      tier: 5,
      type: "spire",
      biome: "high_cliffs",
      quirk: "Aerial enemies more common.",
      encounterBias: { wind: +10, beast: +5 },
      lootBias: ["feathers", "talons"]
    }
  },

  "sunspire-highlands": {
    "sunforge-plateau": {
      tier: 5,
      type: "plateau",
      biome: "storm_highlands",
      quirk: "Solar flares boost fire damage.",
      encounterBias: { fire: +10, storm: +5 },
      lootBias: ["fire_essence"]
    },
    "thunderfall-ravine": {
      tier: 4,
      type: "ravine",
      biome: "storm_cliffs",
      quirk: "Storm hazards increased.",
      encounterBias: { storm: +10 },
      lootBias: ["storm_essence"]
    },
    "spirelight-ascend": {
      tier: 6,
      type: "ascent",
      biome: "high_cliffs",
      quirk: "High altitude reduces stamina.",
      encounterBias: { wind: +10 },
      lootBias: ["light_essence"]
    }
  },

  "highlands-of-thorne": {
    "thornbreaker-pass": {
      tier: 4,
      type: "pass",
      biome: "stone_pass",
      quirk: "Rocky terrain boosts defense.",
      encounterBias: { earth: +10 },
      lootBias: ["stone", "ore"]
    },
    "ironroot-plateau": {
      tier: 5,
      type: "plateau",
      biome: "high_cliffs",
      quirk: "Mineral nodes more common.",
      encounterBias: { earth: +5 },
      lootBias: ["ore", "crystal"]
    },
    "stormclash-ridge": {
      tier: 6,
      type: "ridge",
      biome: "storm_cliffs",
      quirk: "Storm crit volatility increased.",
      encounterBias: { storm: +10 },
      lootBias: ["storm_essence"]
    }
  },

  "mountains": {
    "stonejaw-ascent": {
      tier: 3,
      type: "ascent",
      biome: "stone_pass",
      quirk: "Climbing fatigue reduces stamina.",
      encounterBias: { earth: +5 },
      lootBias: ["stone"]
    },
    "frostbite-crag": {
      tier: 4,
      type: "crag",
      biome: "high_cliffs",
      quirk: "Cold slows movement.",
      encounterBias: { ice: +5 },
      lootBias: ["ice_shard"]
    },
    "echoing-cavern-mouth": {
      tier: 5,
      type: "cavern",
      biome: "stone_pass",
      quirk: "Echoes reveal enemy positions.",
      encounterBias: { dark: +5 },
      lootBias: ["crystal", "ore"]
    }
  },

  "titanfall": {
    "impact-crater": {
      tier: 7,
      type: "crater",
      biome: "titanic_crater",
      quirk: "Chaos surges cause random damage.",
      encounterBias: { chaos: +10, fire: +5 },
      lootBias: ["chaos_fragment"]
    },
    "shattered-ridge": {
      tier: 6,
      type: "ridge",
      biome: "stone_pass",
      quirk: "Unstable ground collapses easily.",
      encounterBias: { earth: +10 },
      lootBias: ["stone", "ore"]
    },
    "emberfall-breach": {
      tier: 8,
      type: "breach",
      biome: "magma_fields",
      quirk: "Fire hazards frequent.",
      encounterBias: { fire: +15 },
      lootBias: ["fire_essence"]
    }
  },

  /* ============================================================
     SWAMP / MARSH REGIONS
  ============================================================ */

  "swamp-marsh": {
    "murkfen-bog": {
      tier: 2,
      type: "bog",
      biome: "marsh",
      quirk: "Poison mist fills the air.",
      encounterBias: { poison: +10 },
      lootBias: ["fungal_spores", "sludge"]
    },
    "drowned-root-delta": {
      tier: 3,
      type: "delta",
      biome: "bog",
      quirk: "Water slows movement.",
      encounterBias: { water: +10 },
      lootBias: ["water_essence"]
    },
    "hollowreed-basin": {
      tier: 4,
      type: "basin",
      biome: "marsh",
      quirk: "Fungal spores cause confusion.",
      encounterBias: { poison: +5, dark: +5 },
      lootBias: ["spores", "toxin"]
    }
  },

  /* ============================================================
     DESERT / WASTES REGIONS
  ============================================================ */

  "desert-dunes": {
    "sunscorch-drift": {
      tier: 3,
      type: "drift",
      biome: "dunes",
      quirk: "Heat reduces stamina.",
      encounterBias: { fire: +10 },
      lootBias: ["sand", "fire_essence"]
    },
    "glasswind-basin": {
      tier: 4,
      type: "basin",
      biome: "sunscorched_dunes",
      quirk: "Mirage illusions distort vision.",
      encounterBias: { fire: +5, light: +5 },
      lootBias: ["glass_fragment"]
    },
    "emberdune-ridge": {
      tier: 5,
      type: "ridge",
      biome: "dunes",
      quirk: "Fire damage increased.",
      encounterBias: { fire: +10 },
      lootBias: ["fire_essence"]
    }
  },

  "shattered-desert": {
    "fracture-wastes": {
      tier: 6,
      type: "wastes",
      biome: "shattered_wastes",
      quirk: "Chaos fissures erupt unpredictably.",
      encounterBias: { chaos: +10 },
      lootBias: ["chaos_fragment"]
    },
    "obsidian-drift": {
      tier: 7,
      type: "drift",
      biome: "dunes",
      quirk: "Sharp terrain causes bleed.",
      encounterBias: { earth: +5, fire: +5 },
      lootBias: ["obsidian"]
    },
    "sunbreaker-ravine": {
      tier: 5,
      type: "ravine",
      biome: "shattered_wastes",
      quirk: "Solar flares scorch the ground.",
      encounterBias: { fire: +10, light: +5 },
      lootBias: ["light_essence"]
    }
  },

  "volcanic-wastes": {
    "ashfall-plain": {
      tier: 5,
      type: "plain",
      biome: "ashlands",
      quirk: "Ash reduces accuracy.",
      encounterBias: { fire: +10 },
      lootBias: ["ash", "fire_essence"]
    },
    "magmaflow-ridge": {
      tier: 6,
      type: "ridge",
      biome: "magma_fields",
      quirk: "Lava bursts erupt frequently.",
      encounterBias: { fire: +15 },
      lootBias: ["magma_core"]
    },
    "emberstorm-chasm": {
      tier: 7,
      type: "chasm",
      biome: "ashlands",
      quirk: "Firestorms sweep the area.",
      encounterBias: { fire: +15, chaos: +5 },
      lootBias: ["fire_essence", "chaos_fragment"]
    }
  },

    /* ============================================================
     FROST / TUNDRA REGIONS
  ============================================================ */

  "tundra-wastes": {
    "frostbite-field": {
      tier: 3,
      type: "field",
      biome: "tundra",
      quirk: "Frostbite chance increases in extreme cold.",
      encounterBias: { ice: +10 },
      lootBias: ["ice_shard", "fur"]
    },
    "glacierfall-ridge": {
      tier: 4,
      type: "ridge",
      biome: "frozen_expanse",
      quirk: "Slippery terrain reduces movement control.",
      encounterBias: { ice: +10, wind: +5 },
      lootBias: ["frost_crystal"]
    },
    "icewind-basin": {
      tier: 5,
      type: "basin",
      biome: "tundra",
      quirk: "Wind chill reduces speed.",
      encounterBias: { wind: +10 },
      lootBias: ["ice_shard"]
    }
  },

  "frostlands": {
    "crystalglow-plain": {
      tier: 4,
      type: "plain",
      biome: "crystalline_frost",
      quirk: "Light refraction boosts crit chance.",
      encounterBias: { arcane: +5, ice: +10 },
      lootBias: ["crystal", "ice_shard"]
    },
    "frostspire-cliffs": {
      tier: 5,
      type: "cliffs",
      biome: "frozen_expanse",
      quirk: "Ice hazards form underfoot.",
      encounterBias: { ice: +10 },
      lootBias: ["frost_crystal"]
    },
    "everfrost-depths": {
      tier: 6,
      type: "depths",
      biome: "crystalline_frost",
      quirk: "Extreme cold drains stamina.",
      encounterBias: { ice: +15 },
      lootBias: ["frost_core"]
    }
  },

  /* ============================================================
     CAVERN / DEPTHS REGIONS
  ============================================================ */

  "cave-entrance": {
    "echoing-hollow": {
      tier: 2,
      type: "hollow",
      biome: "cave",
      quirk: "Echoes reveal enemy positions.",
      encounterBias: { dark: +5, earth: +5 },
      lootBias: ["stone", "crystal"]
    },
    "stalagmite-pass": {
      tier: 3,
      type: "pass",
      biome: "stone_pass",
      quirk: "Narrow corridors restrict movement.",
      encounterBias: { earth: +10 },
      lootBias: ["ore"]
    },
    "glowshard-den": {
      tier: 4,
      type: "den",
      biome: "cave",
      quirk: "Crystal light boosts arcane effects.",
      encounterBias: { arcane: +10 },
      lootBias: ["crystal", "arcane_residue"]
    }
  },

  "crystal-caverns": {
    "prismhall-depths": {
      tier: 5,
      type: "depths",
      biome: "prism_caverns",
      quirk: "Light refraction alters spell behavior.",
      encounterBias: { arcane: +15 },
      lootBias: ["prism_fragment"]
    },
    "shardspire-chamber": {
      tier: 6,
      type: "chamber",
      biome: "crystal_caverns",
      quirk: "Arcane resonance increases crit chance.",
      encounterBias: { arcane: +10, light: +5 },
      lootBias: ["crystal", "arcane_core"]
    },
    "glitterfall-grotto": {
      tier: 4,
      type: "grotto",
      biome: "crystal_caverns",
      quirk: "Crystal growth creates unstable footing.",
      encounterBias: { arcane: +5 },
      lootBias: ["crystal"]
    }
  },

  "shadow-labyrinth": {
    "darkweave-corridor": {
      tier: 7,
      type: "corridor",
      biome: "void_labyrinth",
      quirk: "Darkness reduces accuracy.",
      encounterBias: { dark: +10, void: +5 },
      lootBias: ["shadow_essence"]
    },
    "whispering-maze": {
      tier: 8,
      type: "maze",
      biome: "underdeep",
      quirk: "Confusion chance increased.",
      encounterBias: { dark: +10 },
      lootBias: ["void_fragment"]
    },
    "abyssal-throat": {
      tier: 9,
      type: "throat",
      biome: "void_labyrinth",
      quirk: "Void corruption builds rapidly.",
      encounterBias: { void: +15 },
      lootBias: ["void_core"]
    }
  },

  /* ============================================================
     RUINS / FALLEN KINGDOM REGIONS
  ============================================================ */

  "ruins-outskirts": {
    "broken-archway": {
      tier: 3,
      type: "archway",
      biome: "ruins",
      quirk: "Undead bias increased.",
      encounterBias: { undead: +10 },
      lootBias: ["bone", "dust"]
    },
    "sunken-hall": {
      tier: 4,
      type: "hall",
      biome: "forgotten_ruins",
      quirk: "Ancient traps activate randomly.",
      encounterBias: { dark: +5, arcane: +5 },
      lootBias: ["ancient_relic"]
    },
    "echoing-plaza": {
      tier: 5,
      type: "plaza",
      biome: "ruins",
      quirk: "Arcane echoes distort sound.",
      encounterBias: { arcane: +10 },
      lootBias: ["arcane_residue"]
    }
  },

  "eternal-citadel": {
    "radiant-hall": {
      tier: 7,
      type: "hall",
      biome: "celestial_fortress",
      quirk: "Holy damage bias increased.",
      encounterBias: { holy: +10 },
      lootBias: ["radiant_shard"]
    },
    "spire-of-judgment": {
      tier: 8,
      type: "spire",
      biome: "ascension_spires",
      quirk: "Light hazards strike periodically.",
      encounterBias: { light: +10 },
      lootBias: ["light_essence"]
    },
    "sanctum-core": {
      tier: 9,
      type: "core",
      biome: "celestial_fortress",
      quirk: "Divine enemies gather here.",
      encounterBias: { holy: +15 },
      lootBias: ["divine_fragment"]
    }
  },

  /* ============================================================
     COAST / OCEAN REGIONS
  ============================================================ */

  "azure-coast": {
    "tidebreaker-shore": {
      tier: 2,
      type: "shore",
      biome: "coastal",
      quirk: "Water boosts elemental effects.",
      encounterBias: { water: +10 },
      lootBias: ["shell", "water_essence"]
    },
    "reefglow-basin": {
      tier: 3,
      type: "basin",
      biome: "reef",
      quirk: "Light refraction increases crit chance.",
      encounterBias: { water: +10, light: +5 },
      lootBias: ["coral", "light_essence"]
    },
    "stormwake-cliff": {
      tier: 4,
      type: "cliff",
      biome: "coastal",
      quirk: "Storm hazards frequent.",
      encounterBias: { storm: +10 },
      lootBias: ["storm_essence"]
    }
  },

  "stormbreaker-coast": {
    "tempest-harbor": {
      tier: 5,
      type: "harbor",
      biome: "storm_coast",
      quirk: "Lightning hazards frequent.",
      encounterBias: { electric: +10 },
      lootBias: ["storm_essence"]
    },
    "windlash-ridge": {
      tier: 6,
      type: "ridge",
      biome: "thunder_coast",
      quirk: "Wind reduces accuracy.",
      encounterBias: { wind: +10 },
      lootBias: ["feathers"]
    },
    "maelstrom-breach": {
      tier: 7,
      type: "breach",
      biome: "storm_coast",
      quirk: "Storm crit volatility increased.",
      encounterBias: { storm: +15 },
      lootBias: ["storm_core"]
    }
  },

  "outcast-island": {
    "driftwood-shore": {
      tier: 3,
      type: "shore",
      biome: "island",
      quirk: "Water bias increased.",
      encounterBias: { water: +10 },
      lootBias: ["shell", "driftwood"]
    },
    "shatterreef-cove": {
      tier: 4,
      type: "cove",
      biome: "reef",
      quirk: "Sharp coral causes bleed.",
      encounterBias: { water: +10, light: +5 },
      lootBias: ["coral"]
    },
    "stormcall-spire": {
      tier: 5,
      type: "spire",
      biome: "coastal",
      quirk: "Storm affinity increased.",
      encounterBias: { storm: +10 },
      lootBias: ["storm_essence"]
    }
  },

  /* ============================================================
     STORM / ARCANE REGIONS
  ============================================================ */

  "stormforge-sanctum": {
    "arcstorm-hall": {
      tier: 7,
      type: "hall",
      biome: "arcane_storm",
      quirk: "Arcane lightning surges unpredictably.",
      encounterBias: { arcane: +10, electric: +10 },
      lootBias: ["storm_core", "arcane_residue"]
    },
    "tempest-core": {
      tier: 8,
      type: "core",
      biome: "storm_cliffs",
      quirk: "Storm surges intensify damage.",
      encounterBias: { storm: +15 },
      lootBias: ["storm_essence"]
    },
    "skybreaker-altar": {
      tier: 9,
      type: "altar",
      biome: "arcane_storm",
      quirk: "High crit volatility.",
      encounterBias: { arcane: +10, storm: +10 },
      lootBias: ["arcane_core"]
    }
  },

  "arcstone-enclave": {
    "manaflow-garden": {
      tier: 6,
      type: "garden",
      biome: "mana_fields",
      quirk: "Mana regeneration increased.",
      encounterBias: { arcane: +10 },
      lootBias: ["mana_bloom"]
    },
    "runecliff-ascent": {
      tier: 7,
      type: "ascent",
      biome: "arcane_storm",
      quirk: "Arcane resonance boosts spell damage.",
      encounterBias: { arcane: +10, storm: +5 },
      lootBias: ["rune_fragment"]
    },
    "stormrune-vault": {
      tier: 8,
      type: "vault",
      biome: "mana_fields",
      quirk: "Spell damage increased.",
      encounterBias: { arcane: +15 },
      lootBias: ["arcane_core"]
    }
  },

    /* ============================================================
     VOID / CORRUPTION REGIONS
  ============================================================ */

  "void-spire": {
    "entropy-hall": {
      tier: 7,
      type: "hall",
      biome: "entropy_rifts",
      quirk: "Random stat flux distorts combat.",
      encounterBias: { void: +10, chaos: +10 },
      lootBias: ["void_fragment", "chaos_fragment"]
    },
    "voidflare-ridge": {
      tier: 8,
      type: "ridge",
      biome: "void_barrens",
      quirk: "Void DOT builds rapidly.",
      encounterBias: { void: +15 },
      lootBias: ["void_essence"]
    },
    "shatterrift-core": {
      tier: 9,
      type: "core",
      biome: "entropy_rifts",
      quirk: "Chaos surges destabilize the area.",
      encounterBias: { chaos: +15, void: +10 },
      lootBias: ["chaos_core"]
    }
  },

  "void-frontier": {
    "corruption-field": {
      tier: 6,
      type: "field",
      biome: "corruption_fields",
      quirk: "Corruption buildup increases over time.",
      encounterBias: { dark: +10, void: +5 },
      lootBias: ["corrupted_residue"]
    },
    "darkspire-breach": {
      tier: 7,
      type: "breach",
      biome: "void_barrens",
      quirk: "Void hazards erupt unpredictably.",
      encounterBias: { void: +10 },
      lootBias: ["void_fragment"]
    },
    "riftborn-hollow": {
      tier: 8,
      type: "hollow",
      biome: "entropy_rifts",
      quirk: "Random anomalies manifest.",
      encounterBias: { chaos: +10, void: +10 },
      lootBias: ["chaos_fragment", "void_essence"]
    }
  },

  /* ============================================================
     ARCANE / ASTRAL REGIONS
  ============================================================ */

  "arcane-riftlands": {
    "manaflow-steppe": {
      tier: 6,
      type: "steppe",
      biome: "mana_fields",
      quirk: "Mana regeneration increased.",
      encounterBias: { arcane: +10 },
      lootBias: ["mana_bloom"]
    },
    "riftglow-basin": {
      tier: 7,
      type: "basin",
      biome: "arcane_rift",
      quirk: "Arcane crit chance increased.",
      encounterBias: { arcane: +15 },
      lootBias: ["arcane_residue"]
    },
    "astral-echo": {
      tier: 8,
      type: "echo",
      biome: "mana_fields",
      quirk: "Cosmic resonance alters spell effects.",
      encounterBias: { cosmic: +10, arcane: +10 },
      lootBias: ["astral_fragment"]
    }
  },

  /* ============================================================
     ABYSSAL REGIONS
  ============================================================ */

  "abyss-gate": {
    "shadowfall-ledge": {
      tier: 7,
      type: "ledge",
      biome: "abyssal_depths",
      quirk: "Darkness reduces accuracy.",
      encounterBias: { dark: +10 },
      lootBias: ["shadow_essence"]
    },
    "voidtide-ravine": {
      tier: 8,
      type: "ravine",
      biome: "shadow_trench",
      quirk: "Void DOT builds rapidly.",
      encounterBias: { void: +15 },
      lootBias: ["void_fragment"]
    },
    "nightspire-core": {
      tier: 9,
      type: "core",
      biome: "abyssal_depths",
      quirk: "Corruption intensifies near the core.",
      encounterBias: { dark: +10, void: +10 },
      lootBias: ["abyss_core"]
    }
  },

  "abyssal-scar": {
    "scarred-wastes": {
      tier: 8,
      type: "wastes",
      biome: "nightmare_rifts",
      quirk: "Chaos fissures erupt frequently.",
      encounterBias: { chaos: +15 },
      lootBias: ["chaos_fragment"]
    },
    "hollowvoid-chasm": {
      tier: 9,
      type: "chasm",
      biome: "abyssal_depths",
      quirk: "Void storms sweep the area.",
      encounterBias: { void: +15 },
      lootBias: ["void_core"]
    },
    "nightmare-throat": {
      tier: 10,
      type: "throat",
      biome: "nightmare_rifts",
      quirk: "Extreme darkness distorts perception.",
      encounterBias: { dark: +15, void: +10 },
      lootBias: ["nightmare_essence"]
    }
  },

  /* ============================================================
     CELESTIAL REGIONS
  ============================================================ */

  "celestial-expanse": {
    "radiant-meadow": {
      tier: 6,
      type: "meadow",
      biome: "radiant_fields",
      quirk: "Light boosts healing.",
      encounterBias: { light: +10 },
      lootBias: ["radiant_shard"]
    },
    "ascension-ridge": {
      tier: 7,
      type: "ridge",
      biome: "ascension_spires",
      quirk: "Holy damage bias increased.",
      encounterBias: { holy: +10 },
      lootBias: ["holy_fragment"]
    },
    "halo-spire": {
      tier: 8,
      type: "spire",
      biome: "radiant_fields",
      quirk: "Light hazards strike periodically.",
      encounterBias: { light: +15 },
      lootBias: ["light_essence"]
    }
  },

  "radiant-ascension-spire": {
    "sunforge-hall": {
      tier: 8,
      type: "hall",
      biome: "ascension_spires",
      quirk: "Solar flares boost fire damage.",
      encounterBias: { fire: +10, light: +10 },
      lootBias: ["solar_fragment"]
    },
    "celestium-core": {
      tier: 9,
      type: "core",
      biome: "celestial_fortress",
      quirk: "Divine enemies gather here.",
      encounterBias: { holy: +15 },
      lootBias: ["divine_core"]
    },
    "halo-crest": {
      tier: 10,
      type: "crest",
      biome: "ascension_spires",
      quirk: "Light crit chance increased.",
      encounterBias: { light: +15 },
      lootBias: ["radiant_shard"]
    }
  },

  "seraphic-crucible": {
    "judgment-floor": {
      tier: 9,
      type: "floor",
      biome: "celestial_fortress",
      quirk: "Holy DOT intensifies.",
      encounterBias: { holy: +15 },
      lootBias: ["holy_fragment"]
    },
    "seraph-altar": {
      tier: 10,
      type: "altar",
      biome: "seraphic_plains",
      quirk: "Divine resonance boosts healing.",
      encounterBias: { holy: +10, light: +10 },
      lootBias: ["seraphic_core"]
    },
    "dawnspire-peak": {
      tier: 11,
      type: "peak",
      biome: "ascension_spires",
      quirk: "Light storms sweep the summit.",
      encounterBias: { light: +15 },
      lootBias: ["radiant_core"]
    }
  },

  /* ============================================================
     SPECIAL / CIVILIZATION REGIONS
  ============================================================ */

  "trainers-city": {
    "market-district": {
      tier: 1,
      type: "district",
      biome: "city",
      quirk: "Merchants offer varied goods.",
      encounterBias: { humanoid: +5 },
      lootBias: ["coin", "trade_goods"]
    },
    "academy-grounds": {
      tier: 2,
      type: "grounds",
      biome: "city",
      quirk: "Arcane training increases spell crit.",
      encounterBias: { arcane: +5 },
      lootBias: ["scroll", "ink"]
    },
    "spire-plaza": {
      tier: 3,
      type: "plaza",
      biome: "city",
      quirk: "Crowds reduce stealth effectiveness.",
      encounterBias: { humanoid: +10 },
      lootBias: ["coin", "trinket"]
    }
  },

  "spirit-kingdom": {
    "ancestral-grove": {
      tier: 4,
      type: "grove",
      biome: "arcane_rift",
      quirk: "Spirit energy enhances healing.",
      encounterBias: { spirit: +10 },
      lootBias: ["spirit_essence"]
    },
    "spirit-hall": {
      tier: 5,
      type: "hall",
      biome: "settlement",
      quirk: "Spiritual echoes alter combat.",
      encounterBias: { spirit: +10, arcane: +5 },
      lootBias: ["spirit_fragment"]
    },
    "ethereal-crossing": {
      tier: 6,
      type: "crossing",
      biome: "arcane_rift",
      quirk: "Ethereal winds distort movement.",
      encounterBias: { arcane: +10 },
      lootBias: ["arcane_residue"]
    }
  },

  "worldbreaker-horizon": {
    "fracture-front": {
      tier: 9,
      type: "front",
      biome: "chaos_fields",
      quirk: "Chaos fissures erupt frequently.",
      encounterBias: { chaos: +15 },
      lootBias: ["chaos_fragment"]
    },
    "titanfall-ridge": {
      tier: 10,
      type: "ridge",
      biome: "titanic_crater",
      quirk: "Gravity distortions alter movement.",
      encounterBias: { fire: +10, chaos: +10 },
      lootBias: ["titan_fragment"]
    },
    "worldrend-core": {
      tier: 11,
      type: "core",
      biome: "chaos_fields",
      quirk: "Reality destabilizes near the core.",
      encounterBias: { chaos: +20 },
      lootBias: ["chaos_core"]
    }
  },

  "worlds-end-expanse": {
    "cosmic-wastes": {
      tier: 10,
      type: "wastes",
      biome: "cosmic_wastes",
      quirk: "Cosmic radiation alters combat.",
      encounterBias: { cosmic: +15, void: +10 },
      lootBias: ["cosmic_fragment"]
    },
    "starfall-hollow": {
      tier: 11,
      type: "hollow",
      biome: "cosmic_wastes",
      quirk: "Falling starlight boosts crit chance.",
      encounterBias: { cosmic: +15 },
      lootBias: ["starlight_shard"]
    },
    "eventide-rift": {
      tier: 12,
      type: "rift",
      biome: "nightmare_rifts",
      quirk: "Reality thins into dreamstuff.",
      encounterBias: { void: +10, chaos: +10 },
      lootBias: ["rift_core"]
    }
  }

}; // END SUBREGION_IDENTITY

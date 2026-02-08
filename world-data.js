// world-data.js
// Canonical region definitions for world simulation, encounters, and UI.
// Fully client-side, GitHub-native ES module.

export const WORLD_DATA = {
  version: "2.0.0",

  // Global world settings
  worldSettings: {
    defaultEncounterRate: 1.0,
    defaultLootModifier: 1.0,
    defaultRareSpawnMult: 1.0,
    dayNightCycle: true,
    weatherSystem: true
  },

  regions: {
    forest: {
      key: "forest",
      name: "Whispering Forest",
      biome: "forest",
      regionTier: 1,
      levelRange: [1, 20],
      unlock: {
        level: 1,
        requiresBossClear: false
      },
      weatherPool: ["clear", "rain", "fog"],
      eventPool: ["beast_activity", "forest_whispers"],
      lootModifier: 1.0,
      encounterRateMult: 1.0,
      rareSpawnMult: 1.05,
      flavor: "A lush woodland filled with wildlife, hidden paths, and ancient trees.",

      enemyFamilies: [
        { id: "beast", weight: 55 },
        { id: "slime", weight: 25 },
        { id: "undead", weight: 10 },
        { id: "humanoid", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 60 },
        { id: "uncommon", weight: 25 },
        { id: "rare", weight: 10 },
        { id: "epic", weight: 5 },
        { id: "elite", weight: 4 },
        { id: "mythical", weight: 1 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 1.0,
        playerDEFMult: 1.0,
        enemyATKMult: 1.0,
        enemyDEFMult: 1.0,
        elementBias: { nature: +0.10 },
        notes: "A calm but living forest where nature magic subtly strengthens local creatures."
      },

      travelLinks: ["plains", "cavern"],
      worldBoss: "giant_boar"
    },

    plains: {
      key: "plains",
      name: "Sunspire Plains",
      biome: "plains",
      regionTier: 1,
      levelRange: [5, 30],
      unlock: {
        level: 5,
        requiresBossClear: true
      },
      weatherPool: ["clear", "windy"],
      eventPool: ["bandit_raids", "migrating_beasts"],
      lootModifier: 1.0,
      encounterRateMult: 1.0,
      rareSpawnMult: 1.05,
      flavor: "Wide open fields where travelers, beasts, and bandits roam freely.",

      enemyFamilies: [
        { id: "beast", weight: 40 },
        { id: "humanoid", weight: 40 },
        { id: "slime", weight: 15 },
        { id: "undead", weight: 5 }
      ],

      rarityWeights: [
        { id: "common", weight: 60 },
        { id: "uncommon", weight: 25 },
        { id: "rare", weight: 10 },
        { id: "epic", weight: 5 },
        { id: "elite", weight: 4 },
        { id: "mythical", weight: 1 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 1.0,
        enemyATKMult: 1.0,
        enemyDEFMult: 0.95,
        critChanceAdd: +0.01,
        notes: "Open fields favor swift movement and precise strikes."
      },

      travelLinks: ["forest", "ruins"],
      worldBoss: "centaur_lancer"
    },

    cavern: {
      key: "cavern",
      name: "Echoing Caverns",
      biome: "cavern",
      regionTier: 1,
      levelRange: [20, 40],
      unlock: {
        level: 20,
        requiresBossClear: true
      },
      weatherPool: ["none"],
      eventPool: ["cave_insight", "tremors"],
      lootModifier: 1.05,
      encounterRateMult: 1.10,
      rareSpawnMult: 1.10,
      flavor: "Dark tunnels filled with echoes, minerals, and lurking subterranean creatures.",

      enemyFamilies: [
        { id: "slime", weight: 40 },
        { id: "undead", weight: 30 },
        { id: "beast", weight: 20 },
        { id: "construct", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 55 },
        { id: "uncommon", weight: 25 },
        { id: "rare", weight: 12 },
        { id: "epic", weight: 5 },
        { id: "elite", weight: 2 },
        { id: "mythical", weight: 0.5 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 0.95,
        playerDEFMult: 1.05,
        enemyATKMult: 1.05,
        enemyDEFMult: 1.10,
        accuracyMult: 0.95,
        notes: "Echoing tunnels distort sound and empower subterranean creatures."
      },

      travelLinks: ["forest", "ruins"],
      worldBoss: "minotaur"
    },

    ruins: {
      key: "ruins",
      name: "Forgotten Ruins",
      biome: "ruins",
      regionTier: 1,
      levelRange: [35, 60],
      unlock: {
        level: 35,
        requiresBossClear: true
      },
      weatherPool: ["fog", "clear"],
      eventPool: ["restless_spirits", "unstable_architecture"],
      lootModifier: 1.10,
      encounterRateMult: 1.10,
      rareSpawnMult: 1.15,
      flavor: "Crumbling remains of an ancient civilization, haunted by echoes of the past.",

      enemyFamilies: [
        { id: "undead", weight: 50 },
        { id: "humanoid", weight: 25 },
        { id: "slime", weight: 15 },
        { id: "construct", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 50 },
        { id: "uncommon", weight: 28 },
        { id: "rare", weight: 12 },
        { id: "epic", weight: 6 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 0.8 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 1.0,
        playerDEFMult: 0.95,
        enemyATKMult: 1.05,
        enemyDEFMult: 1.0,
        elementBias: { shadow: +0.10, arcane: +0.05 },
        specialRules: { unstableTerrain: true },
        notes: "Ancient magic lingers among the rubble, empowering arcane and shadow forces."
      },

      travelLinks: ["plains", "swamp"],
      worldBoss: "necromancer_adept"
    },

    swamp: {
      key: "swamp",
      name: "Mirefen Swamp",
      biome: "swamp",
      regionTier: 1,
      levelRange: [30, 80],
      unlock: {
        level: 30,
        requiresBossClear: true
      },
      weatherPool: ["rain", "fog"],
      eventPool: ["toxic_mist", "bog_stirrings"],
      lootModifier: 1.10,
      encounterRateMult: 1.15,
      rareSpawnMult: 1.20,
      flavor: "A murky wetland filled with poisonous plants and lurking predators.",

      enemyFamilies: [
        { id: "beast", weight: 40 },
        { id: "slime", weight: 30 },
        { id: "undead", weight: 20 },
        { id: "spirit", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 55 },
        { id: "uncommon", weight: 27 },
        { id: "rare", weight: 12 },
        { id: "epic", weight: 4 },
        { id: "elite", weight: 2 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 0.95,
        playerDEFMult: 0.95,
        enemyATKMult: 1.05,
        enemyDEFMult: 1.05,
        statusEffectChanceMult: 1.15,
        notes: "Toxic mists and sinking ground empower decay and poison."
      },

      travelLinks: ["ruins", "desert"],
      worldBoss: "banshee"
    },

    /* =========================
       TIER 2 (Lv 20–100)
    ========================== */

    desert: {
      key: "desert",
      name: "Scorchwind Desert",
      biome: "desert",
      regionTier: 2,
      levelRange: [25, 100],
      unlock: {
        level: 25,
        requiresBossClear: true
      },
      weatherPool: ["heatwave", "clear"],
      eventPool: ["sandstorm", "mirage"],
      lootModifier: 1.15,
      encounterRateMult: 1.10,
      rareSpawnMult: 1.20,
      flavor: "A harsh wasteland of scorching sands and ancient buried secrets.",

      enemyFamilies: [
        { id: "beast", weight: 35 },
        { id: "elemental", weight: 30 },
        { id: "humanoid", weight: 20 },
        { id: "undead", weight: 15 }
      ],

      rarityWeights: [
        { id: "common", weight: 50 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 13 },
        { id: "epic", weight: 5 },
        { id: "elite", weight: 2 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 0.90,
        enemyATKMult: 1.10,
        enemyDEFMult: 1.0,
        elementBias: { fire: +0.15 },
        specialRules: { reducedHealing: true },
        notes: "Scorching heat empowers fire and drains endurance."
      },

      travelLinks: ["swamp", "tundra"],
      worldBoss: "serpent_guardian"
    },

    tundra: {
      key: "tundra",
      name: "Frostveil Tundra",
      biome: "tundra",
      regionTier: 2,
      levelRange: [42, 110],
      unlock: {
        level: 40,
        requiresBossClear: true
      },
      weatherPool: ["snow", "clear", "blizzard"],
      eventPool: ["frostbite_warning", "aurora_surge"],
      lootModifier: 1.20,
      encounterRateMult: 1.05,
      rareSpawnMult: 1.25,
      flavor: "A frozen expanse where only the hardiest creatures survive.",

      enemyFamilies: [
        { id: "beast", weight: 30 },
        { id: "undead", weight: 30 },
        { id: "elemental", weight: 25 },
        { id: "spirit", weight: 15 }
      ],

      rarityWeights: [
        { id: "common", weight: 48 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 15 },
        { id: "epic", weight: 5 },
        { id: "elite", weight: 2 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 0.95,
        playerDEFMult: 1.10,
        enemyATKMult: 1.0,
        enemyDEFMult: 1.10,
        elementBias: { ice: +0.15 },
        accuracyMult: 0.95,
        notes: "Frigid winds slow movement and empower ice‑aligned creatures."
      },

      travelLinks: ["desert", "mountains"],
      worldBoss: "frost_wyrm"
    },

    mountains: {
      key: "mountains",
      name: "Highpeak Mountains",
      biome: "mountains",
      regionTier: 2,
      levelRange: [30, 100],
      unlock: {
        level: 30,
        requiresBossClear: true
      },
      weatherPool: ["storm", "clear", "windy"],
      eventPool: ["rockslide", "thin_air"],
      lootModifier: 1.20,
      encounterRateMult: 1.15,
      rareSpawnMult: 1.30,
      flavor: "Towering peaks filled with dangerous wildlife and treacherous cliffs.",

      enemyFamilies: [
        { id: "beast", weight: 35 },
        { id: "dragon", weight: 10 },
        { id: "humanoid", weight: 30 },
        { id: "construct", weight: 25 }
      ],

      rarityWeights: [
        { id: "common", weight: 45 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 15 },
        { id: "epic", weight: 7 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 0.8 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 1.0,
        enemyATKMult: 1.05,
        enemyDEFMult: 1.05,
        critDamageMult: 1.10,
        notes: "High altitude sharpens strikes and empowers wind and earth."
      },

      travelLinks: ["tundra", "void"],
      worldBoss: "storm_drake"
    },

    primordial_grove: {
      key: "primordial_grove",
      name: "Primordial Grove",
      biome: "ancient_forest",
      regionTier: 2,
      levelRange: [66, 120],
      unlock: {
        level: 66,
        requiresBossClear: true
      },
      weatherPool: ["fog", "rain"],
      eventPool: ["ancient_awakening", "spore_bloom"],
      lootModifier: 1.15,
      encounterRateMult: 1.10,
      rareSpawnMult: 1.35,
      flavor: "An ancient forest where nature’s oldest spirits still roam.",

      enemyFamilies: [
        { id: "beast", weight: 40 },
        { id: "spirit", weight: 25 },
        { id: "slime", weight: 20 },
        { id: "undead", weight: 10 },
        { id: "elemental", weight: 5 }
      ],

      rarityWeights: [
        { id: "common", weight: 50 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 13 },
        { id: "epic", weight: 5 },
        { id: "elite", weight: 2 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 1.0,
        playerDEFMult: 1.10,
        enemyATKMult: 1.10,
        enemyDEFMult: 1.15,
        elementBias: { nature: +0.20, earth: +0.10 },
        hotPowerMult: 1.10,
        notes: "Ancient life force strengthens nature and regeneration."
      },

      travelLinks: ["forest", "worldbreaker_horizon"],
      worldBoss: "ancient_treant"
    },

    /* =========================
       TIER 3 (Lv 100–250)
    ========================== */

    void: {
      key: "void",
      name: "Void-Touched Expanse",
      biome: "void_realm",
      regionTier: 3,
      levelRange: [100, 250],
      unlock: {
        level: 100,
        requiresBossClear: true
      },
      weatherPool: ["void_storm"],
      eventPool: ["void_echo", "rift_flicker"],
      lootModifier: 1.30,
      encounterRateMult: 1.20,
      rareSpawnMult: 1.35,
      flavor: "A corrupted zone where reality bends and void creatures roam freely.",

      enemyFamilies: [
        { id: "void", weight: 50 },
        { id: "undead", weight: 20 },
        { id: "demon", weight: 20 },
        { id: "spirit", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 40 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 18 },
        { id: "epic", weight: 8 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 0.95,
        playerDEFMult: 0.90,
        enemyATKMult: 1.10,
        enemyDEFMult: 1.10,
        elementBias: { void: +0.20 },
        accuracyMult: 0.90,
        specialRules: { voidPressure: true },
        notes: "Reality bends; void energy crushes defenses."
      },

      travelLinks: ["mountains", "abyssal_scar"],
      worldBoss: "void_reaver"
    },

    celestial: {
      key: "celestial",
      name: "Celestial Verge",
      biome: "celestial",
      regionTier: 3,
      levelRange: [120, 300],
      unlock: {
        level: 120,
        requiresBossClear: true
      },
      weatherPool: ["clear", "arcane_winds"],
      eventPool: ["radiant_surge", "starfall"],
      lootModifier: 1.25,
      encounterRateMult: 1.10,
      rareSpawnMult: 1.30,
      flavor: "A shimmering realm touched by starlight and divine energy.",

      enemyFamilies: [
        { id: "spirit", weight: 40 },
        { id: "elemental", weight: 30 },
        { id: "humanoid", weight: 20 },
        { id: "dragon", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 45 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 15 },
        { id: "epic", weight: 7 },
        { id: "elite", weight: 2 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 1.05,
        enemyATKMult: 1.0,
        enemyDEFMult: 1.0,
        elementBias: { holy: +0.15, light: +0.10 },
        critChanceAdd: +0.02,
        notes: "Radiant energies empower holy magic and precision."
      },

      travelLinks: ["mountains", "celestial_expanse"],
      worldBoss: "radiant_seraph"
    },

    arcane_rift: {
      key: "arcane_rift",
      name: "Arcane Rift",
      biome: "arcane",
      regionTier: 3,
      levelRange: [150, 300],
      unlock: {
        level: 150,
        requiresBossClear: true
      },
      weatherPool: ["arcane_winds", "clear"],
      eventPool: ["mana_overflow", "rift_instability"],
      lootModifier: 1.20,
      encounterRateMult: 1.10,
      rareSpawnMult: 1.25,
      flavor: "A volatile fracture of pure magic where arcane storms surge unpredictably.",

      enemyFamilies: [
        { id: "elemental", weight: 40 },
        { id: "spirit", weight: 25 },
        { id: "construct", weight: 20 },
        { id: "humanoid", weight: 10 },
        { id: "void", weight: 5 }
      ],

      rarityWeights: [
        { id: "common", weight: 42 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 17 },
        { id: "epic", weight: 8 },
        { id: "elite", weight: 2.5 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.2 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 0.95,
        enemyATKMult: 1.10,
        enemyDEFMult: 1.05,
        elementBias: { arcane: +0.20, lightning: +0.10 },
        critChanceAdd: +0.03,
        specialRules: { empoweredMagic: true },
        notes: "Arcane turbulence amplifies magic and destabilizes defenses."
      },

      travelLinks: ["mountains", "astral_nexus"],
      worldBoss: "rift_archon"
    },

    abyssal_scar: {
      key: "abyssal_scar",
      name: "Abyssal Scar",
      biome: "abyss",
      regionTier: 3,
      levelRange: [222, 450],
      unlock: {
        level: 220,
        requiresBossClear: true
      },
      weatherPool: ["void_storm", "fog"],
      eventPool: ["void_surge", "shadow_unrest"],
      lootModifier: 1.25,
      encounterRateMult: 1.15,
      rareSpawnMult: 1.20,
      flavor: "A torn wound in reality where void energy bleeds into the world.",

      enemyFamilies: [
        { id: "void", weight: 45 },
        { id: "demon", weight: 25 },
        { id: "undead", weight: 15 },
        { id: "spirit", weight: 10 },
        { id: "construct", weight: 5 }
      ],

      rarityWeights: [
        { id: "common", weight: 40 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 18 },
        { id: "epic", weight: 8 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 0.90,
        playerDEFMult: 0.90,
        enemyATKMult: 1.15,
        enemyDEFMult: 1.15,
        elementBias: { void: +0.20, shadow: +0.10 },
        accuracyMult: 0.85,
        specialRules: { voidPressure: true },
        notes: "A wound in reality where void corruption thrives."
      },

      travelLinks: ["void", "void_frontier"],
      worldBoss: "abyssal_overlord"
    },

    /* =========================
       TIER 4 (Lv 250–600)
    ========================== */

    celestial_expanse: {
      key: "celestial_expanse",
      name: "Celestial Expanse",
      biome: "celestial",
      regionTier: 4,
      levelRange: [250, 600],
      unlock: {
        level: 250,
        requiresBossClear: true
      },
      weatherPool: ["clear", "arcane_winds"],
      eventPool: ["stellar_alignment", "radiant_burst"],
      lootModifier: 1.30,
      encounterRateMult: 1.05,
      rareSpawnMult: 1.30,
      flavor: "A radiant realm touched by starlight and celestial forces.",

      enemyFamilies: [
        { id: "spirit", weight: 45 },
        { id: "elemental", weight: 25 },
        { id: "humanoid", weight: 20 },
        { id: "dragon", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 38 },
        { id: "uncommon", weight: 32 },
        { id: "rare", weight: 18 },
        { id: "epic", weight: 8 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 0.7 },
        { id: "legendary", weight: 0.3 },
        { id: "ancient", weight: 0.05 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 1.05,
        enemyATKMult: 1.0,
        enemyDEFMult: 1.0,
        elementBias: { holy: +0.20, light: +0.10 },
        critChanceAdd: +0.03,
        notes: "A radiant realm where celestial forces dominate."
      },

      travelLinks: ["celestial", "eternal_citadel"],
      worldBoss: "stellar_titan"
    },

    void_frontier: {
      key: "void_frontier",
      name: "Void Frontier",
      biome: "void",
      regionTier: 4,
      levelRange: [350, 700],
      unlock: {
        level: 350,
        requiresBossClear: true
      },
      weatherPool: ["void_storm"],
      eventPool: ["void_rift_expansion", "gravity_distortion"],
      lootModifier: 1.35,
      encounterRateMult: 1.20,
      rareSpawnMult: 1.40,
      flavor: "The borderlands where the void presses hardest against reality.",

      enemyFamilies: [
        { id: "void", weight: 55 },
        { id: "demon", weight: 20 },
        { id: "undead", weight: 15 },
        { id: "spirit", weight: 10 }
      ],

      rarityWeights: [
        { id: "common", weight: 35 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 20 },
        { id: "epic", weight: 10 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 1 },
        { id: "legendary", weight: 0.4 },
        { id: "ancient", weight: 0.1 }
      ],

      combatModifiers: {
        playerATKMult: 0.95,
        playerDEFMult: 0.90,
        enemyATKMult: 1.10,
        enemyDEFMult: 1.10,
        elementBias: { void: +0.20 },
        accuracyMult: 0.90,
        specialRules: { voidPressure: true },
        notes: "The edge of the void where reality frays."
      },

      travelLinks: ["abyssal_scar", "astral_nexus"],
      worldBoss: "void_colossus"
    },

    /* =========================
       TIER 5 (Lv 600–2000)
    ========================== */

    eternal_citadel: {
      key: "eternal_citadel",
      name: "Eternal Citadel",
      biome: "celestial",
      regionTier: 5,
      levelRange: [500, 2000],
      unlock: {
        level: 500,
        requiresBossClear: true
      },
      weatherPool: ["clear", "arcane_winds"],
      eventPool: ["divine_resonance", "angelic_hymn"],
      lootModifier: 1.40,
      encounterRateMult: 1.05,
      rareSpawnMult: 1.50,
      flavor: "A timeless fortress of divine power suspended between realms.",

      enemyFamilies: [
        { id: "spirit", weight: 40 },
        { id: "construct", weight: 25 },
        { id: "humanoid", weight: 20 },
        { id: "dragon", weight: 15 }
      ],

      rarityWeights: [
        { id: "common", weight: 32 },
        { id: "uncommon", weight: 30 },
        { id: "rare", weight: 22 },
        { id: "epic", weight: 10 },
        { id: "elite", weight: 3 },
        { id: "mythical", weight: 1 },
        { id: "legendary", weight: 0.5 },
        { id: "ancient", weight: 0.2 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 1.10,
        enemyATKMult: 1.05,
        enemyDEFMult: 1.05,
        elementBias: { holy: +0.10, arcane: +0.10 },
        notes: "A bastion of ancient power where magic and order converge."
      },

      travelLinks: ["celestial_expanse", "astral_nexus"],
      worldBoss: "eternal_warden"
    },

    worldbreaker_horizon: {
      key: "worldbreaker_horizon",
      name: "Worldbreaker Horizon",
      biome: "magma",
      regionTier: 5,
      levelRange: [600, 2250],
      unlock: {
        level: 600,
        requiresBossClear: true
      },
      weatherPool: ["heatwave", "storm"],
      eventPool: ["titanic_footfall", "scorched_earth"],
      lootModifier: 1.45,
      encounterRateMult: 1.25,
      rareSpawnMult: 1.45,
      flavor: "A shattered frontier where titanic forces reshape the land.",

      enemyFamilies: [
        { id: "elemental", weight: 40 },
        { id: "beast",     weight: 30 },
        { id: "dragon",    weight: 20 },
        { id: "construct", weight: 10 }
      ],

      rarityWeights: [
        { id: "common",    weight: 30 },
        { id: "uncommon",  weight: 32 },
        { id: "rare",      weight: 22 },
        { id: "epic",      weight: 12 },
        { id: "elite",     weight: 3 },
        { id: "mythical",  weight: 1 },
        { id: "legendary", weight: 0.5 },
        { id: "ancient",   weight: 0.2 }
      ],

      combatModifiers: {
        playerATKMult: 1.0,
        playerDEFMult: 0.90,
        enemyATKMult: 1.15,
        enemyDEFMult: 1.15,
        elementBias: { fire: +0.20, earth: +0.10 },
        specialRules: { reducedHealing: true },
        notes: "A cataclysmic landscape shaped by titanic forces."
      },

      travelLinks: ["primordial_grove", "astral_nexus"],
      worldBoss: "worldbreaker_titan"
    },

    /* =========================
       TIER 6 (Lv 2000–9999)
    ========================== */

    astral_nexus: {
      key: "astral_nexus",
      name: "Astral Nexus",
      biome: "astral_plane",
      regionTier: 6,
      levelRange: [1800, 9999],
      unlock: {
        level: 1750,
        requiresBossClear: true
      },
      weatherPool: ["arcane_winds", "clear"],
      eventPool: ["cosmic_flux", "timeline_echo"],
      lootModifier: 1.50,
      encounterRateMult: 1.30,
      rareSpawnMult: 1.60,
      flavor: "A convergence point of countless timelines and cosmic energies.",

      enemyFamilies: [
        { id: "spirit",    weight: 35 },
        { id: "elemental", weight: 25 },
        { id: "void",      weight: 20 },
        { id: "dragon",    weight: 10 },
        { id: "humanoid",  weight: 10 }
      ],

      rarityWeights: [
        { id: "common",    weight: 28 },
        { id: "uncommon",  weight: 30 },
        { id: "rare",      weight: 25 },
        { id: "epic",      weight: 12 },
        { id: "elite",     weight: 3 },
        { id: "mythical",  weight: 1 },
        { id: "legendary", weight: 0.5 },
        { id: "ancient",   weight: 0.2 }
      ],

      combatModifiers: {
        playerATKMult: 1.05,
        playerDEFMult: 0.95,
        enemyATKMult: 1.10,
        enemyDEFMult: 1.05,
        elementBias: { arcane: +0.20, lightning: +0.10 },
        critChanceAdd: +0.03,
        specialRules: { empoweredMagic: true },
        notes: "A convergence point of cosmic energies where magic surges wildly."
      },

      travelLinks: ["arcane_rift", "void_frontier", "eternal_citadel", "worldbreaker_horizon"],
      worldBoss: "astral_paragon"
    }
  }
};

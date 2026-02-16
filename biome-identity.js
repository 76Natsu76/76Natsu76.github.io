export const BIOME_IDENTITY = {

  /* ============================================================
     FOREST / NATURE BIOMES
  ============================================================ */

  "forest": {
    tags: ["nature", "beast"],
    encounterBias: { beast: +15, plant: +10 },
    hazardPool: ["root_snare", "pollen_burst"],
    anomalyBias: ["nature_surge", "fungal_bloom"],
    migrationBias: ["wolf_pack", "stag_migration"],
    combatModifiers: { enemyDEFMult: 1.05, playerAccuracyMult: 0.97 },
    flavor: [
      "The forest hums with quiet life.",
      "Roots twist beneath the soil like veins."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "deep-forest": {
    tags: ["nature", "dark"],
    encounterBias: { beast: +20, plant: +10, dark: +5 },
    hazardPool: ["shadow_snare", "toxic_spores"],
    anomalyBias: ["fungal_bloom", "shadow_growth"],
    migrationBias: ["wolf_pack"],
    combatModifiers: { enemyEvasionMult: 1.10, playerAccuracyMult: 0.95 },
    flavor: [
      "The canopy swallows the light.",
      "Something watches from between the trees."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "wild-forest": {
    tags: ["nature"],
    encounterBias: { beast: +15, plant: +5 },
    hazardPool: ["overgrowth", "thorn_whip"],
    anomalyBias: ["nature_surge"],
    migrationBias: ["stag_migration"],
    combatModifiers: { enemyATKMult: 1.05 },
    flavor: [
      "Untamed growth spreads in every direction.",
      "Wildlife stirs at the slightest sound."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "ancient-forest": {
    tags: ["nature", "arcane"],
    encounterBias: { beast: +10, plant: +10, arcane: +5 },
    hazardPool: ["arcane_pollen", "ancient_roots"],
    anomalyBias: ["arcane_bloom", "nature_surge"],
    migrationBias: ["elderbeast_migration"],
    combatModifiers: { playerManaRegenMult: 1.05 },
    flavor: [
      "Magic lingers in every leaf.",
      "The trees remember."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "eldergrove-depths": {
    tags: ["nature", "holy", "dark"],
    encounterBias: { plant: +15, spirit: +10 },
    hazardPool: ["holy_spores", "shadow_thorns"],
    anomalyBias: ["spirit_bloom"],
    migrationBias: ["spirit_migration"],
    combatModifiers: { enemyHolyResMult: 1.10 },
    flavor: [
      "Light and shadow intertwine among ancient roots.",
      "The grove breathes with sacred power."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "elderwood-heart": {
    tags: ["nature", "holy"],
    encounterBias: { plant: +15, spirit: +10 },
    hazardPool: ["radiant_pollen"],
    anomalyBias: ["holy_convergence"],
    migrationBias: ["spirit_migration"],
    combatModifiers: { healingMult: 1.10 },
    flavor: [
      "A sacred calm permeates the air.",
      "The heartwood glows with gentle radiance."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "primeval-overgrowth": {
    tags: ["nature", "earth"],
    encounterBias: { beast: +10, plant: +15, earth: +5 },
    hazardPool: ["root_quake", "choking_vines"],
    anomalyBias: ["nature_surge"],
    migrationBias: ["behemoth_migration"],
    combatModifiers: { enemyHPMult: 1.10 },
    flavor: [
      "The land itself feels alive.",
      "Ancient growth threatens to reclaim everything."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     PLAINS / STEPPE BIOMES
  ============================================================ */

  "plains": {
    tags: ["wind"],
    encounterBias: { beast: +10, humanoid: +5 },
    hazardPool: ["wind_gust"],
    anomalyBias: ["wind_shear"],
    migrationBias: ["herd_migration"],
    combatModifiers: { critChanceMult: 1.05 },
    flavor: [
      "Open fields stretch to the horizon.",
      "Winds carry distant calls."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "open-steppe": {
    tags: ["wind", "earth"],
    encounterBias: { beast: +10, earth: +5 },
    hazardPool: ["dust_storm"],
    anomalyBias: ["wind_shear"],
    migrationBias: ["herd_migration"],
    combatModifiers: { playerSpeedMult: 1.05 },
    flavor: [
      "Wide, rolling grasslands sway in the wind.",
      "The steppe is never truly still."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "plateau": {
    tags: ["storm", "wind"],
    encounterBias: { storm: +10, beast: +5 },
    hazardPool: ["lightning_strike"],
    anomalyBias: ["storm_node"],
    migrationBias: ["skybeast_migration"],
    combatModifiers: { critDamageMult: 1.10 },
    flavor: [
      "Storms gather quickly on the high plateau.",
      "Thunder echoes across the cliffs."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     SWAMP / MARSH BIOMES
  ============================================================ */

  "swamp": {
    tags: ["poison", "water"],
    encounterBias: { poison: +15, water: +5 },
    hazardPool: ["toxic_mist", "sinking_mud"],
    anomalyBias: ["fungal_bloom"],
    migrationBias: ["swamp_beast_migration"],
    combatModifiers: { playerSpeedMult: 0.90 },
    flavor: [
      "The air hangs thick with decay.",
      "Every step threatens to sink."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "drowned-marsh": {
    tags: ["water", "poison"],
    encounterBias: { water: +10, poison: +10 },
    hazardPool: ["bog_gas", "deep_mire"],
    anomalyBias: ["plague_mist"],
    migrationBias: ["swamp_beast_migration"],
    combatModifiers: { enemyPoisonResMult: 1.10 },
    flavor: [
      "Waterlogged ground hides unseen dangers.",
      "Dark waters ripple with unseen movement."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "whispering-marsh": {
    tags: ["water", "dark"],
    encounterBias: { dark: +10, water: +10 },
    hazardPool: ["shadow_mist"],
    anomalyBias: ["shadow_growth"],
    migrationBias: ["spirit_migration"],
    combatModifiers: { enemyEvasionMult: 1.10 },
    flavor: [
      "Whispers drift across the still waters.",
      "Shadows cling to the fog."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     DESERT / WASTES BIOMES
  ============================================================ */

  "desert": {
    tags: ["fire", "earth"],
    encounterBias: { fire: +10, earth: +10 },
    hazardPool: ["heat_wave", "sandstorm"],
    anomalyBias: ["heat_mirage"],
    migrationBias: ["sand_serpent_migration"],
    combatModifiers: { staminaDrainMult: 1.10 },
    flavor: [
      "Heat shimmers across endless dunes.",
      "The desert tests all who cross it."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "sunscorched-dunes": {
    tags: ["fire", "light"],
    encounterBias: { fire: +15, light: +5 },
    hazardPool: ["solar_flare"],
    anomalyBias: ["solar_convergence"],
    migrationBias: ["sunscale_migration"],
    combatModifiers: { fireDamageMult: 1.10 },
    flavor: [
      "Sunlight burns fiercely across the dunes.",
      "The air itself seems aflame."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "shattered-desert": {
    tags: ["fire", "earth", "chaos"],
    encounterBias: { chaos: +10, fire: +10 },
    hazardPool: ["chaos_fissure"],
    anomalyBias: ["chaos_fissure"],
    migrationBias: ["shardbeast_migration"],
    combatModifiers: { chaosDamageMult: 1.10 },
    flavor: [
      "Reality fractures beneath the scorching sun.",
      "The sands shift with chaotic energy."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     VOLCANIC BIOMES
  ============================================================ */

  "volcano": {
    tags: ["fire", "earth"],
    encounterBias: { fire: +20, earth: +10 },
    hazardPool: ["lava_burst", "ash_cloud"],
    anomalyBias: ["magma_surge"],
    migrationBias: ["lava_beast_migration"],
    combatModifiers: { fireDamageMult: 1.15 },
    flavor: [
      "The volcano rumbles with restless fury.",
      "Heat radiates from every crack."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "molten-crest": {
    tags: ["fire", "chaos"],
    encounterBias: { fire: +20, chaos: +10 },
    hazardPool: ["eruption", "molten_rain"],
    anomalyBias: ["chaos_fissure"],
    migrationBias: ["emberwolf_migration"],
    combatModifiers: { critChanceMult: 1.10 },
    flavor: [
      "Molten stone flows like blood.",
      "Chaos flickers in the flames."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "magma": {
    tags: ["fire"],
    encounterBias: { fire: +20 },
    hazardPool: ["lava_pool"],
    anomalyBias: ["magma_surge"],
    migrationBias: ["fire_elemental_migration"],
    combatModifiers: { fireResMult: 1.10 },
    flavor: [
      "Rivers of magma illuminate the cavern walls.",
      "The air burns with heat."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     FROST / TUNDRA BIOMES
  ============================================================ */

  "tundra": {
    tags: ["ice"],
    encounterBias: { ice: +20 },
    hazardPool: ["frostbite", "ice_spike"],
    anomalyBias: ["frost_bloom"],
    migrationBias: ["frostbeast_migration"],
    combatModifiers: { playerSpeedMult: 0.90 },
    flavor: [
      "Cold winds sweep across the barren tundra.",
      "Frost clings to every surface."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "frozen-expanse": {
    tags: ["ice", "wind"],
    encounterBias: { ice: +15, wind: +5 },
    hazardPool: ["blizzard"],
    anomalyBias: ["deepwinter"],
    migrationBias: ["ice_elemental_migration"],
    combatModifiers: { enemyIceResMult: 1.10 },
    flavor: [
      "A vast expanse of frozen silence.",
      "The wind howls endlessly."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "crystalline-tundra": {
    tags: ["ice", "arcane"],
    encounterBias: { ice: +15, arcane: +10 },
    hazardPool: ["crystal_spike"],
    anomalyBias: ["arcane_bloom"],
    migrationBias: ["crystalbeast_migration"],
    combatModifiers: { critChanceMult: 1.10 },
    flavor: [
      "Crystals glitter beneath the frost.",
      "Magic pulses through the frozen ground."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     CAVERN / DEPTHS BIOMES
  ============================================================ */

  "cave": {
    tags: ["dark", "earth"],
    encounterBias: { dark: +10, earth: +10 },
    hazardPool: ["cave_in", "echo_shock"],
    anomalyBias: ["echo_rift"],
    migrationBias: ["cavebeast_migration"],
    combatModifiers: { enemyDEFMult: 1.10 },
    flavor: [
      "Darkness presses in from all sides.",
      "The air is thick and still."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "crystal-cave": {
    tags: ["arcane", "light"],
    encounterBias: { arcane: +15, light: +5 },
    hazardPool: ["light_refraction"],
    anomalyBias: ["arcane_bloom"],
    migrationBias: ["crystalbeast_migration"],
    combatModifiers: { spellDamageMult: 1.10 },
    flavor: [
      "Crystals refract light into dancing patterns.",
      "Arcane energy hums softly."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "prism-caverns": {
    tags: ["arcane", "light"],
    encounterBias: { arcane: +20 },
    hazardPool: ["prism_burst"],
    anomalyBias: ["arcane_bloom"],
    migrationBias: ["crystalbeast_migration"],
    combatModifiers: { critChanceMult: 1.10 },
    flavor: [
      "Prismatic light fills the cavern.",
      "Magic refracts in unpredictable ways."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "underdeep": {
    tags: ["dark", "earth"],
    encounterBias: { dark: +15, earth: +10 },
    hazardPool: ["pressure_crush"],
    anomalyBias: ["void_tear"],
    migrationBias: ["underdeep_elemental_migration"],
    combatModifiers: { enemyHPMult: 1.10 },
    flavor: [
      "The weight of the world presses down.",
      "Shadows cling to the stone."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "subterranean": {
    tags: ["earth", "dark"],
    encounterBias: { earth: +10, dark: +10 },
    hazardPool: ["cave_in"],
    anomalyBias: ["echo_rift"],
    migrationBias: ["cavebeast_migration"],
    combatModifiers: { enemyDEFMult: 1.05 },
    flavor: [
      "Deep tunnels stretch into darkness.",
      "The air is heavy and stale."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "deep-caverns": {
    tags: ["dark", "void"],
    encounterBias: { void: +15, dark: +10 },
    hazardPool: ["void_leak"],
    anomalyBias: ["void_tear"],
    migrationBias: ["voidspawn_migration"],
    combatModifiers: { voidDamageMult: 1.10 },
    flavor: [
      "A suffocating darkness fills the depths.",
      "Reality feels thin here."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     RUINS / FALLEN KINGDOM BIOMES
  ============================================================ */

  "ruins": {
    tags: ["dark", "arcane"],
    encounterBias: { undead: +15, arcane: +5 },
    hazardPool: ["falling_debris"],
    anomalyBias: ["arcane_echo"],
    migrationBias: ["undead_migration"],
    combatModifiers: { enemyATKMult: 1.05 },
    flavor: [
      "Crumbling stones whisper of forgotten ages.",
      "Magic lingers in the ruins."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "forgotten-ruins": {
    tags: ["arcane", "dark"],
    encounterBias: { arcane: +10, undead: +10 },
    hazardPool: ["arcane_echo"],
    anomalyBias: ["arcane_bloom"],
    migrationBias: ["undead_migration"],
    combatModifiers: { spellDamageMult: 1.05 },
    flavor: [
      "Ancient glyphs glow faintly.",
      "The ruins remember."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "ruined-kingdom": {
    tags: ["dark", "holy"],
    encounterBias: { undead: +15, spirit: +5 },
    hazardPool: ["holy_echo"],
    anomalyBias: ["spirit_bloom"],
    migrationBias: ["spirit_migration"],
    combatModifiers: { holyDamageMult: 1.05 },
    flavor: [
      "A fallen kingdom haunted by memory.",
      "Light and shadow battle for dominance."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     COAST / OCEAN BIOMES
  ============================================================ */

  "coastal": {
    tags: ["water", "wind"],
    encounterBias: { water: +10, beast: +5 },
    hazardPool: ["tidal_surge"],
    anomalyBias: ["tide_surge"],
    migrationBias: ["seabird_migration"],
    combatModifiers: { waterDamageMult: 1.05 },
    flavor: [
      "Waves crash against the shore.",
      "Salt hangs in the air."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "island": {
    tags: ["water", "nature"],
    encounterBias: { water: +10, nature: +5 },
    hazardPool: ["tropical_storm"],
    anomalyBias: ["tide_surge"],
    migrationBias: ["seabird_migration"],
    combatModifiers: { critChanceMult: 1.05 },
    flavor: [
      "A lonely island surrounded by restless waves.",
      "Life thrives in isolation."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "reef": {
    tags: ["water", "light"],
    encounterBias: { water: +15, light: +5 },
    hazardPool: ["coral_spike"],
    anomalyBias: ["tide_surge"],
    migrationBias: ["reefbeast_migration"],
    combatModifiers: { enemyEvasionMult: 1.10 },
    flavor: [
      "Colorful reefs shimmer beneath the waves.",
      "Light dances across the water."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "open-ocean": {
    tags: ["water", "dark"],
    encounterBias: { water: +20, dark: +5 },
    hazardPool: ["rogue_wave", "deep_current"],
    anomalyBias: ["tide_surge", "abyssal_pull"],
    migrationBias: ["leviathan_migration"],
    combatModifiers: { enemyEvasionMult: 1.15, playerAccuracyMult: 0.95 },
    flavor: [
      "Endless waters stretch into the unknown.",
      "The depths hide ancient, unseen things."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     STORM / TEMPEST BIOMES
  ============================================================ */

    "storm-coast": {
    tags: ["water", "electric"],
    encounterBias: { electric: +10, water: +10 },
    hazardPool: ["lightning_strike", "storm_surge"],
    anomalyBias: ["storm_node"],
    migrationBias: ["stormbeast_migration"],
    combatModifiers: { critChanceMult: 1.10 },
    flavor: [
      "Storms crash endlessly against the shore.",
      "Thunder rolls across the waves."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "arcane-storm": {
    tags: ["arcane", "electric"],
    encounterBias: { arcane: +15, electric: +10 },
    hazardPool: ["mana_lightning", "arcane_tempest"],
    anomalyBias: ["arcane_bloom", "storm_node"],
    migrationBias: ["storm_elemental_migration"],
    combatModifiers: { spellDamageMult: 1.10, critVolatilityMult: 1.10 },
    flavor: [
      "Magic and lightning spiral together in violent harmony.",
      "The air crackles with unstable power."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     VOID / CORRUPTION BIOMES
  ============================================================ */

  "corrupted": {
    tags: ["poison", "dark"],
    encounterBias: { dark: +10, poison: +10 },
    hazardPool: ["corruption_pool", "toxic_fumes"],
    anomalyBias: ["corruption_bloom"],
    migrationBias: ["corruption_beast_migration"],
    combatModifiers: { enemyPoisonResMult: 1.10 },
    flavor: [
      "The land festers with creeping corruption.",
      "Toxic fumes rise from blackened soil."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "void": {
    tags: ["void", "dark"],
    encounterBias: { void: +20, dark: +10 },
    hazardPool: ["void_leak", "entropy_pulse"],
    anomalyBias: ["void_tear"],
    migrationBias: ["voidspawn_migration"],
    combatModifiers: { voidDamageMult: 1.10 },
    flavor: [
      "Reality thins into swirling darkness.",
      "Void energy distorts the air."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "void-realm": {
    tags: ["void", "chaos"],
    encounterBias: { void: +20, chaos: +10 },
    hazardPool: ["entropy_storm", "void_spike"],
    anomalyBias: ["void_tear", "chaos_fissure"],
    migrationBias: ["eldritch_migration"],
    combatModifiers: { enemyATKMult: 1.10, playerAccuracyMult: 0.90 },
    flavor: [
      "A realm where form and meaning unravel.",
      "Chaos pulses through the void."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "void-labyrinth": {
    tags: ["void", "dark"],
    encounterBias: { void: +15, dark: +10 },
    hazardPool: ["shadow_maze", "void_whisper"],
    anomalyBias: ["void_tear"],
    migrationBias: ["shadowbeast_migration"],
    combatModifiers: { enemyEvasionMult: 1.10 },
    flavor: [
      "A twisting maze of shifting shadows.",
      "Whispers echo from impossible angles."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     ARCANE / ASTRAL BIOMES
  ============================================================ */

  "arcane": {
    tags: ["arcane"],
    encounterBias: { arcane: +20 },
    hazardPool: ["mana_flux", "arcane_burst"],
    anomalyBias: ["arcane_bloom"],
    migrationBias: ["mana_beast_migration"],
    combatModifiers: { spellDamageMult: 1.10 },
    flavor: [
      "Raw magic saturates the air.",
      "Reality hums with arcane resonance."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "arcane-rift": {
    tags: ["arcane", "void"],
    encounterBias: { arcane: +15, void: +10 },
    hazardPool: ["rift_surge", "unstable_mana"],
    anomalyBias: ["arcane_bloom", "void_tear"],
    migrationBias: ["riftbeast_migration"],
    combatModifiers: { critChanceMult: 1.10 },
    flavor: [
      "Rifts tear open to reveal swirling magic.",
      "The ground pulses with unstable energy."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "astral-plane": {
    tags: ["arcane", "cosmic"],
    encounterBias: { cosmic: +15, arcane: +10 },
    hazardPool: ["cosmic_ray", "astral_shift"],
    anomalyBias: ["cosmic_rift"],
    migrationBias: ["astral_beast_migration"],
    combatModifiers: { manaRegenMult: 1.10 },
    flavor: [
      "Stars shimmer beneath your feet.",
      "Gravity feels optional here."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "astral-nexus": {
    tags: ["cosmic", "arcane"],
    encounterBias: { cosmic: +20, arcane: +10 },
    hazardPool: ["gravity_well", "astral_flux"],
    anomalyBias: ["cosmic_rift"],
    migrationBias: ["eldritch_migration"],
    combatModifiers: { spellDamageMult: 1.15 },
    flavor: [
      "A convergence of cosmic pathways.",
      "Energy spirals in impossible patterns."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "astral-spirit": {
    tags: ["cosmic", "arcane"],
    encounterBias: { cosmic: +15, spirit: +10 },
    hazardPool: ["spirit_echo", "astral_burst"],
    anomalyBias: ["spirit_bloom"],
    migrationBias: ["spirit_migration"],
    combatModifiers: { healingMult: 1.05 },
    flavor: [
      "Spiritual echoes drift through the astral winds.",
      "Light and thought intertwine."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     ABYSSAL / ELDRITCH BIOMES
  ============================================================ */

  "abyss": {
    tags: ["dark", "fire"],
    encounterBias: { dark: +15, fire: +10 },
    hazardPool: ["hellfire_crack", "shadow_flame"],
    anomalyBias: ["void_tear"],
    migrationBias: ["abyssal_beast_migration"],
    combatModifiers: { enemyATKMult: 1.10 },
    flavor: [
      "Heat and darkness churn in the depths.",
      "The abyss hungers."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "abyssal-deep": {
    tags: ["dark", "void"],
    encounterBias: { dark: +15, void: +15 },
    hazardPool: ["void_pressure", "abyssal_pull"],
    anomalyBias: ["void_tear"],
    migrationBias: ["eldritch_migration"],
    combatModifiers: { voidDamageMult: 1.15 },
    flavor: [
      "A crushing darkness swallows all light.",
      "Something ancient stirs below."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "eldritch-abyss": {
    tags: ["void", "dark", "chaos"],
    encounterBias: { void: +15, dark: +10, chaos: +10 },
    hazardPool: ["chaos_spiral", "void_bloom"],
    anomalyBias: ["chaos_fissure", "void_tear"],
    migrationBias: ["eldritch_migration"],
    combatModifiers: { critVolatilityMult: 1.15 },
    flavor: [
      "Reality warps under eldritch influence.",
      "Whispers claw at your mind."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  /* ============================================================
     CELESTIAL BIOMES
  ============================================================ */

  "celestial-spire": {
    tags: ["holy", "light"],
    encounterBias: { holy: +15, light: +10 },
    hazardPool: ["radiant_burst"],
    anomalyBias: ["holy_convergence"],
    migrationBias: ["seraph_migration"],
    combatModifiers: { healingMult: 1.10 },
    flavor: [
      "Light cascades from towering spires.",
      "The air hums with divine resonance."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "celestial-forge": {
    tags: ["holy", "fire"],
    encounterBias: { holy: +10, fire: +10 },
    hazardPool: ["forge_flare"],
    anomalyBias: ["radiant_surge"],
    migrationBias: ["seraph_migration"],
    combatModifiers: { fireDamageMult: 1.10 },
    flavor: [
      "Sacred flames burn with purpose.",
      "The forge glows with divine heat."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "celestial-horizon": {
    tags: ["light", "cosmic"],
    encounterBias: { light: +10, cosmic: +10 },
    hazardPool: ["solar_wind"],
    anomalyBias: ["cosmic_rift"],
    migrationBias: ["seraph_migration"],
    combatModifiers: { critChanceMult: 1.10 },
    flavor: [
      "The sky stretches into radiant infinity.",
      "Light bends across the horizon."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  },

  "celestial-fortress": {
    tags: ["holy", "light"],
    encounterBias: { holy: +20 },
    hazardPool: ["divine_judgment"],
    anomalyBias: ["holy_convergence"],
    migrationBias: ["seraph_migration"],
    combatModifiers: { holyDamageMult: 1.15 },
    flavor: [
      "A bastion of divine power.",
      "Every stone radiates purpose."
    ],
    professionBias: {},
    elementBias: {},
    subraceBias: {}
  }

}; // END BIOME_IDENTITY

const DEFAULT_MODIFIERS = {
  hpMult: 1.0,
  atkMult: 1.0,
  defMult: 1.0,
  spdMult: 1.0,
  critMult: 1.0,
  dodgeMult: 1.0,
  accuracyMult: 1.0,
  elementalBias: {},
  flavorTags: []
};

const SUBREGION_MODIFIERS = {
  abyss_gate: {
    hpMult: 1.15,
    atkMult: 1.20,
    defMult: 0.95,
    spdMult: 1.00,
    critMult: 1.10,
    dodgeMult: 0.90,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.2, dark: 1.1 },
    flavorTags: ["infernal", "abyssal", "burning"]
  },
  
  abyssal_deep: {
    hpMult: 1.25,
    atkMult: 1.10,
    defMult: 1.20,
    spdMult: 0.85,
    critMult: 0.90,
    dodgeMult: 0.80,
    accuracyMult: 1.05,
    elementalBias: { water: 1.3, dark: 1.1, pressure: 1.2 },
    flavorTags: ["crushing-pressure", "deepwater", "leviathan"]
  },
  
  abyssal_rift: {
    hpMult: 1.10,
    atkMult: 1.25,
    defMult: 0.90,
    spdMult: 1.05,
    critMult: 1.15,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { void: 1.4, chaos: 1.2 },
    flavorTags: ["rift-touched", "unstable", "eldritch"]
  },
  
  astral_plane: {
    hpMult: 0.95,
    atkMult: 1.10,
    defMult: 0.90,
    spdMult: 1.20,
    critMult: 1.10,
    dodgeMult: 1.10,
    accuracyMult: 1.15,
    elementalBias: { arcane: 1.3, light: 1.1 },
    flavorTags: ["astral", "starlit", "planar"]
  },
  
  azure_coast: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.10,
    accuracyMult: 1.00,
    elementalBias: { water: 1.2, wind: 1.1 },
    flavorTags: ["tidal", "coastal", "storm-kissed"]
  },
  
  cave_entrance: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.05,
    elementalBias: { earth: 1.2 },
    flavorTags: ["echoing", "subterranean"]
  },
  
  celestial_expanse: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.15,
    critMult: 1.10,
    dodgeMult: 1.10,
    accuracyMult: 1.10,
    elementalBias: { light: 1.4, arcane: 1.2 },
    flavorTags: ["radiant", "celestial", "divine"]
  },
  
  crystal_pass: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.15,
    elementalBias: { arcane: 1.3, light: 1.1 },
    flavorTags: ["refracted", "crystalline"]
  },
  
  deep_forest: {
    hpMult: 1.05,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.15,
    accuracyMult: 0.95,
    elementalBias: { nature: 1.3, poison: 1.1 },
    flavorTags: ["shadowed", "overgrown", "deepwild"]
  },
  
  desert_dunes: {
    hpMult: 1.00,
    atkMult: 1.15,
    defMult: 0.90,
    spdMult: 1.10,
    critMult: 1.20,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.3, wind: 1.1 },
    flavorTags: ["scorching", "sand-scarred"]
  },
  
  forest_edge: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.1 },
    flavorTags: ["woodland", "edge-dweller"]
  },
  
  highland_cliffs: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.05,
    spdMult: 1.05,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { wind: 1.3, lightning: 1.1 },
    flavorTags: ["storm-carved", "highland"]
  },
  
  mountain_peak: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { earth: 1.3, wind: 1.1 },
    flavorTags: ["mountainborn", "stone-blooded"]
  },
  
  plains_field: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { wind: 1.2 },
    flavorTags: ["open-steppe", "windswept"]
  },
  
  spirit_kingdom: {
    hpMult: 0.95,
    atkMult: 1.10,
    defMult: 0.95,
    spdMult: 1.15,
    critMult: 1.10,
    dodgeMult: 1.10,
    accuracyMult: 1.05,
    elementalBias: { spirit: 1.4, light: 1.1 },
    flavorTags: ["ethereal", "ancestral"]
  },
  
  sunspire_highlands: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.15,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.05,
    elementalBias: { lightning: 1.4, fire: 1.1 },
    flavorTags: ["sun-touched", "radiant"]
  },
  
  swamp_marsh: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 0.95,
    elementalBias: { poison: 1.4, water: 1.1 },
    flavorTags: ["mire-born", "bog-dweller"]
  },
  
  tundra_wastes: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.90,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { ice: 1.4, wind: 1.1 },
    flavorTags: ["frostbitten", "winterborn"]
  },
  
  void_realm: {
    hpMult: 1.00,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { void: 1.5, chaos: 1.2 },
    flavorTags: ["void-touched", "unmaking"]
  },
  
  void_spire: {
    hpMult: 1.05,
    atkMult: 1.15,
    defMult: 0.95,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.05,
    elementalBias: { void: 1.4, arcane: 1.2 },
    flavorTags: ["spire-forged", "paradox-charged"]
  }
};

const SPECIAL_ZONE_MODIFIERS = {
  arcane_riftlands: {
    hpMult: 0.95,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.15,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.10,
    elementalBias: { arcane: 1.4, chaos: 1.2 },
    flavorTags: ["rift-charged", "unstable", "arcane-surge"]
  },
  
  arcstone_enclave: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.10,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.10,
    elementalBias: { earth: 1.3, arcane: 1.1 },
    flavorTags: ["stonebound", "arcstone", "geomantic"]
  },
  
  astral_nexus: {
    hpMult: 1.00,
    atkMult: 1.15,
    defMult: 0.95,
    spdMult: 1.20,
    critMult: 1.15,
    dodgeMult: 1.10,
    accuracyMult: 1.15,
    elementalBias: { arcane: 1.5, light: 1.2 },
    flavorTags: ["nexus-born", "astral-convergence"]
  },
  
  celestial_horizon: {
    hpMult: 1.10,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.15,
    critMult: 1.10,
    dodgeMult: 1.10,
    accuracyMult: 1.10,
    elementalBias: { light: 1.5, arcane: 1.2 },
    flavorTags: ["radiant", "horizon-blessed"]
  },
  
  corrupted: {
    hpMult: 1.05,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.00,
    critMult: 1.10,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { dark: 1.4, void: 1.2 },
    flavorTags: ["corrupted", "tainted", "blighted"]
  },
  
  crystalline_tundra: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.15,
    spdMult: 0.90,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.10,
    elementalBias: { ice: 1.4, arcane: 1.2 },
    flavorTags: ["crystal-frost", "glacial-shard"]
  },
  
  deep_abyss: {
    hpMult: 1.30,
    atkMult: 1.10,
    defMult: 1.25,
    spdMult: 0.80,
    critMult: 0.90,
    dodgeMult: 0.80,
    accuracyMult: 1.05,
    elementalBias: { water: 1.4, dark: 1.3, pressure: 1.3 },
    flavorTags: ["abyssal-depths", "crushing-dark"]
  },
  
  deep_caverns: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.20,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 1.05,
    elementalBias: { earth: 1.4, dark: 1.1 },
    flavorTags: ["deepstone", "echoing-depths"]
  },
  
  drowned_marsh: {
    hpMult: 1.15,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 0.85,
    critMult: 0.95,
    dodgeMult: 0.85,
    accuracyMult: 0.95,
    elementalBias: { water: 1.3, poison: 1.2 },
    flavorTags: ["drowned", "sodden", "marsh-haunted"]
  },
  
  elderwood_heart: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 1.05,
    critMult: 1.05,
    dodgeMult: 1.10,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.5, spirit: 1.2 },
    flavorTags: ["elderwood", "ancient-grove"]
  },
  
  emberfang_ridge: {
    hpMult: 1.05,
    atkMult: 1.20,
    defMult: 0.95,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.5, earth: 1.1 },
    flavorTags: ["emberfang", "magma-scorched"]
  },
  
  emberforge_depths: {
    hpMult: 1.10,
    atkMult: 1.20,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 1.10,
    dodgeMult: 0.95,
    accuracyMult: 1.05,
    elementalBias: { fire: 1.5, metal: 1.2 },
    flavorTags: ["forge-born", "molten-depths"]
  },
  
  elusive_reef: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.15,
    critMult: 1.10,
    dodgeMult: 1.15,
    accuracyMult: 1.00,
    elementalBias: { water: 1.3, illusion: 1.2 },
    flavorTags: ["reef-shrouded", "mist-veiled"]
  },
  
  eternal_citadel: {
    hpMult: 1.20,
    atkMult: 1.10,
    defMult: 1.20,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.05,
    elementalBias: { light: 1.3, arcane: 1.2 },
    flavorTags: ["eternal", "citadel-forged"]
  },
  
  forgotten_ruins: {
    hpMult: 1.05,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { dark: 1.2, earth: 1.1 },
    flavorTags: ["forgotten", "ancient-ruin"]
  },
  
  forest_entry: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.1 },
    flavorTags: ["woodland", "threshold"]
  },
  
  highlands_of_thorne: {
    hpMult: 1.10,
    atkMult: 1.15,
    defMult: 1.10,
    spdMult: 1.05,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { wind: 1.3, lightning: 1.2 },
    flavorTags: ["thorne-highlands", "storm-wreathed"]
  },
  
  leviathan_trench: {
    hpMult: 1.30,
    atkMult: 1.10,
    defMult: 1.25,
    spdMult: 0.80,
    critMult: 0.90,
    dodgeMult: 0.80,
    accuracyMult: 1.05,
    elementalBias: { water: 1.5, pressure: 1.4, dark: 1.2 },
    flavorTags: ["leviathan-depths", "abyssal-pressure"]
  },
  
  molten_underdeep: {
    hpMult: 1.15,
    atkMult: 1.25,
    defMult: 1.05,
    spdMult: 0.95,
    critMult: 1.10,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.5, earth: 1.2 },
    flavorTags: ["molten", "underdeep"]
  },
  
  open_steppe: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { wind: 1.2 },
    flavorTags: ["open-steppe", "wide-horizon"]
  },
  
  point_nemo: {
    hpMult: 1.20,
    atkMult: 1.10,
    defMult: 1.10,
    spdMult: 0.90,
    critMult: 1.00,
    dodgeMult: 0.90,
    accuracyMult: 1.00,
    elementalBias: { water: 1.4, dark: 1.2 },
    flavorTags: ["isolated", "ocean-void"]
  },
  
  primeval_overgrowth: {
    hpMult: 1.15,
    atkMult: 1.10,
    defMult: 1.10,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.5, poison: 1.2 },
    flavorTags: ["primeval", "overgrown"]
  },
  
  radiant_ascension_spire: {
    hpMult: 1.10,
    atkMult: 1.15,
    defMult: 1.05,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.10,
    elementalBias: { light: 1.5, arcane: 1.2 },
    flavorTags: ["ascended", "radiant-spire"]
  },
  
  ruined_kingdom: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { dark: 1.3, earth: 1.1 },
    flavorTags: ["ruined", "fallen-kingdom"]
  },
  
  seraphic_crucible: {
    hpMult: 1.15,
    atkMult: 1.10,
    defMult: 1.10,
    spdMult: 1.05,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.10,
    elementalBias: { light: 1.6, fire: 1.2 },
    flavorTags: ["seraphic", "holy-forge"]
  },
  
  shadow_labyrinth: {
    hpMult: 1.05,
    atkMult: 1.15,
    defMult: 0.95,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { dark: 1.5, void: 1.2 },
    flavorTags: ["shadowed", "labyrinthine"]
  },
  
  shattered_desert: {
    hpMult: 1.00,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.15,
    critMult: 1.20,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.4, wind: 1.2 },
    flavorTags: ["shattered", "sun-scorched"]
  },
  
  stormbreaker_coast: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.10,
    accuracyMult: 1.00,
    elementalBias: { water: 1.3, lightning: 1.3 },
    flavorTags: ["stormbreaker", "tempest-forged"]
  },
  
  subterranean: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.15,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 1.05,
    elementalBias: { earth: 1.4, dark: 1.1 },
    flavorTags: ["subterranean", "deep-earth"]
  },
  
  sunscorched_dunes: {
    hpMult: 1.00,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.15,
    critMult: 1.20,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.5, light: 1.1 },
    flavorTags: ["sunscorched", "blistering"]
  },
  
  underdeep: {
    hpMult: 1.15,
    atkMult: 1.05,
    defMult: 1.20,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 1.05,
    elementalBias: { earth: 1.4, dark: 1.2 },
    flavorTags: ["underdeep", "stone-dark"]
  },
  
  verdant_wildwood: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.05,
    spdMult: 1.05,
    critMult: 1.05,
    dodgeMult: 1.10,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.5, spirit: 1.1 },
    flavorTags: ["wildwood", "verdant"]
  },
  
  western_coast: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.10,
    accuracyMult: 1.00,
    elementalBias: { water: 1.2, wind: 1.1 },
    flavorTags: ["coastal", "saltwind"]
  },
  
  whispering_marsh: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 0.95,
    elementalBias: { poison: 1.4, water: 1.1 },
    flavorTags: ["whispering", "marsh-haunted"]
  },
  
  worldbreaker_horizon: {
    hpMult: 1.20,
    atkMult: 1.20,
    defMult: 1.10,
    spdMult: 1.00,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.05,
    elementalBias: { chaos: 1.5, void: 1.3 },
    flavorTags: ["worldbreaker", "horizon-shattered"]
  },
  
  worlds_end_expanse: {
    hpMult: 1.15,
    atkMult: 1.10,
    defMult: 1.10,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { void: 1.4, dark: 1.2 },
    flavorTags: ["end-of-world", "expanse"]
  }
}

const REGION_FALLBACKS = {
  celestial: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.10,
    elementalBias: { light: 1.4, arcane: 1.2 },
    flavorTags: ["celestial"]
  },
  
  cavern: {
    hpMult: 1.05,
    atkMult: 1.00,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 0.95,
    dodgeMult: 0.95,
    accuracyMult: 1.05,
    elementalBias: { earth: 1.3, dark: 1.1 },
    flavorTags: ["cavernous"]
  },
  
  desert: {
    hpMult: 1.00,
    atkMult: 1.15,
    defMult: 0.95,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.3, wind: 1.1 },
    flavorTags: ["desert"]
  },
  
  forest: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.05,
    critMult: 1.00,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.2 },
    flavorTags: ["forest"]
  },
  
  mountains: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { earth: 1.3, wind: 1.1 },
    flavorTags: ["mountainous"]
  },
  
  plains: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { wind: 1.2 },
    flavorTags: ["plains"]
  },
  
  ruins: {
    hpMult: 1.05,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { dark: 1.2, earth: 1.1 },
    flavorTags: ["ruined"]
  },
  
  swamp: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 0.95,
    elementalBias: { poison: 1.3, water: 1.1 },
    flavorTags: ["swamp"]
  },
  
  tundra: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.90,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { ice: 1.4, wind: 1.1 },
    flavorTags: ["tundra"]
  },
  
  void: {
    hpMult: 1.00,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { void: 1.5, chaos: 1.2 },
    flavorTags: ["void"]
  }
}

const BIOME_MODIFIERS = {
  biome_arctic: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.90,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { ice: 1.4, wind: 1.1 },
    flavorTags: ["arctic"]
  },
  
  biome_cave: {
    hpMult: 1.05,
    atkMult: 1.00,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 0.95,
    dodgeMult: 0.95,
    accuracyMult: 1.05,
    elementalBias: { earth: 1.3, dark: 1.1 },
    flavorTags: ["cave"]
  },
  
  biome_coastal: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.10,
    accuracyMult: 1.00,
    elementalBias: { water: 1.3, wind: 1.1 },
    flavorTags: ["coastal"]
  },
  
  biome_desert: {
    hpMult: 1.00,
    atkMult: 1.15,
    defMult: 0.95,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.4, wind: 1.1 },
    flavorTags: ["desert"]
  },
  
  biome_forest: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.05,
    critMult: 1.00,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.3 },
    flavorTags: ["forest"]
  },
  
  biome_mountain: {
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 0.95,
    accuracyMult: 1.00,
    elementalBias: { earth: 1.3, wind: 1.1 },
    flavorTags: ["mountain"]
  },
  
  biome_plains: {
    hpMult: 1.00,
    atkMult: 1.05,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.05,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { wind: 1.2 },
    flavorTags: ["plains"]
  },
  
  biome_swamp: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 0.90,
    critMult: 0.95,
    dodgeMult: 0.90,
    accuracyMult: 0.95,
    elementalBias: { poison: 1.4, water: 1.1 },
    flavorTags: ["swamp"]
  },
  
  biome_void: {
    hpMult: 1.00,
    atkMult: 1.20,
    defMult: 0.90,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { void: 1.5, chaos: 1.2 },
    flavorTags: ["void"]
  }
}

const WEATHER_MODIFIERS = {
  clear: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: {},
    flavorTags: ["clear-skies"]
  },
  
  fog: {
    hpMult: 1.00,
    atkMult: 1.00,
    defMult: 1.00,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.10,
    accuracyMult: 0.90,
    elementalBias: { illusion: 1.2 },
    flavorTags: ["foggy"]
  },
  
  rain: {
    hpMult: 1.00,
    atkMult: 0.95,
    defMult: 1.00,
    spdMult: 0.95,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { water: 1.3 },
    flavorTags: ["rainfall"]
  },
  
  storm: {
    hpMult: 1.00,
    atkMult: 1.10,
    defMult: 0.95,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { lightning: 1.4, wind: 1.2 },
    flavorTags: ["storming"]
  },
  
  blizzard: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.10,
    spdMult: 0.85,
    critMult: 1.00,
    dodgeMult: 0.90,
    accuracyMult: 0.95,
    elementalBias: { ice: 1.5 },
    flavorTags: ["blizzard"]
  },
  
  heatwave: {
    hpMult: 0.95,
    atkMult: 1.10,
    defMult: 0.95,
    spdMult: 1.05,
    critMult: 1.10,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { fire: 1.4 },
    flavorTags: ["heatwave"]
  }
}

/* ==================
 * CRISIS MODIFIERS
 * ================== */

const CRISIS_MODIFIERS = {
  beastUprising: {
    hpMult: 1.20,
    atkMult: 1.20,
    defMult: 1.10,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.3, chaos: 1.1 },
    flavorTags: ["beast-uprising"]
  },
  
  voidRift: {
    hpMult: 1.10,
    atkMult: 1.25,
    defMult: 0.90,
    spdMult: 1.10,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { void: 1.6, chaos: 1.3 },
    flavorTags: ["void-rift"]
  },
  
  spiritAwakening: {
    hpMult: 1.00,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.10,
    accuracyMult: 1.05,
    elementalBias: { spirit: 1.5, light: 1.2 },
    flavorTags: ["spirit-awakening"]
  }
}

/* ==================
 * EVENT MODIFIERS
 * ================== */

const EVENT_MODIFIERS = {
  celestialAlignment: {
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.00,
    spdMult: 1.10,
    critMult: 1.10,
    dodgeMult: 1.05,
    accuracyMult: 1.10,
    elementalBias: { light: 1.5, arcane: 1.3 },
    flavorTags: ["celestial-alignment"]
  },
  
  harvestFestival: {
    hpMult: 1.10,
    atkMult: 1.00,
    defMult: 1.05,
    spdMult: 1.00,
    critMult: 1.00,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { nature: 1.2 },
    flavorTags: ["harvest-festival"]
  },
  
  eclipseNight: {
    hpMult: 1.00,
    atkMult: 1.15,
    defMult: 0.95,
    spdMult: 1.05,
    critMult: 1.15,
    dodgeMult: 1.00,
    accuracyMult: 1.00,
    elementalBias: { dark: 1.5, void: 1.2 },
    flavorTags: ["eclipse-night"]
  }
}

export const REGION_MODIFIERS = {
  subregions: SUBREGION_MODIFIERS,       // from Message 1/3
  specialZones: SPECIAL_ZONE_MODIFIERS,  // from Message 2/3
  regions: {
    ...REGION_FALLBACKS,                 // from Message 2/3
    ...buildBiomeRegionModifiers(BIOME_PRESETS, REGION_BIOMES)
  },
  biomes: BIOME_MODIFIERS,               // from Message 3/3
  weather: WEATHER_MODIFIERS,            // from Message 3/3
  crisis: CRISIS_MODIFIERS,              // from Message 3/3
  events: EVENT_MODIFIERS                // from Message 3/3
};

function normalizeModifiers(block) {
  return {
    ...DEFAULT_MODIFIERS,
    ...block,
    elementalBias: { ...DEFAULT_MODIFIERS.elementalBias, ...(block.elementalBias || {}) },
    flavorTags: [...(block.flavorTags || [])]
  };
}


function buildBiomeRegionModifiers(BIOME_PRESETS, REGION_BIOMES) {
  const result = {};
  for (const [regionKey, biomeKey] of Object.entries(REGION_BIOMES)) {
    const preset = BIOME_PRESETS[biomeKey];
    if (!preset) continue;

    result[regionKey] = normalizeModifiers({
      ...preset
    });
  }
  return result;
}

export function getAllModifiersForContext(context) {
  const {
    subregion,
    specialZone,
    region,
    biome,
    weather,
    crisis,
    event
  } = context;

  const layers = [];

  if (subregion && REGION_MODIFIERS.subregions[subregion]) {
    layers.push(REGION_MODIFIERS.subregions[subregion]);
  }

  if (specialZone && REGION_MODIFIERS.specialZones[specialZone]) {
    layers.push(REGION_MODIFIERS.specialZones[specialZone]);
  }

  if (region && REGION_MODIFIERS.regions[region]) {
    layers.push(REGION_MODIFIERS.regions[region]);
  }

  if (biome && REGION_MODIFIERS.biomes[biome]) {
    layers.push(REGION_MODIFIERS.biomes[biome]);
  }

  if (weather && REGION_MODIFIERS.weather[weather]) {
    layers.push(REGION_MODIFIERS.weather[weather]);
  }

  if (crisis && REGION_MODIFIERS.crisis[crisis]) {
    layers.push(REGION_MODIFIERS.crisis[crisis]);
  }

  if (event && REGION_MODIFIERS.events[event]) {
    layers.push(REGION_MODIFIERS.events[event]);
  }

  // merge all layers
  const final = { ...DEFAULT_MODIFIERS, elementalBias: {}, flavorTags: [] };

  for (const layer of layers) {
    final.hpMult *= layer.hpMult;
    final.atkMult *= layer.atkMult;
    final.defMult *= layer.defMult;
    final.spdMult *= layer.spdMult;
    final.critMult *= layer.critMult;
    final.dodgeMult *= layer.dodgeMult;
    final.accuracyMult *= layer.accuracyMult;

    for (const [element, weight] of Object.entries(layer.elementalBias || {})) {
      final.elementalBias[element] = (final.elementalBias[element] || 1.0) * weight;
    }
    final.flavorTags.push(...(layer.flavorTags || []));
  }
  return final;
}

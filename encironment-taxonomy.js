// environment-taxonomy.js
// Canonical Phase D registries: crises, weather, anomalies, migrations, globals, flavor tags, interactions

export const CRISIS_TYPES = {
  BEAST_TIDE_SMALL: {
    key: "beast_tide_small",
    label: "Small Beast Tide",
    category: "beast_tide",
    intensity: 1,
    description: "Localized surge of aggressive fauna near key routes and edges.",
    tags: ["beast", "pressure", "local"]
  },
  BEAST_TIDE_MEDIUM: {
    key: "beast_tide_medium",
    label: "Medium Beast Tide",
    category: "beast_tide",
    intensity: 2,
    description: "Region-wide increase in beast aggression and encounter density.",
    tags: ["beast", "pressure", "regional"]
  },
  BEAST_TIDE_LARGE: {
    key: "beast_tide_large",
    label: "Large Beast Tide",
    category: "beast_tide",
    intensity: 3,
    description: "Full ecological surge; apex predators roam freely.",
    tags: ["beast", "pressure", "apex", "high_danger"]
  },
  MONSTER_HORDE: {
    key: "monster_horde",
    label: "Monster Horde",
    category: "monster_horde",
    intensity: 3,
    description: "Aberrations, undead, and other horrors overrun the region.",
    tags: ["monster", "horde", "high_danger"]
  },
  AERIAL_MIGRATION_SURGE: {
    key: "aerial_migration_surge",
    label: "Aerial Migration Surge",
    category: "migration",
    intensity: 2,
    description: "Flying beasts disrupt travel and visibility.",
    tags: ["air", "migration", "visibility"]
  },
  GROUND_MIGRATION_SURGE: {
    key: "ground_migration_surge",
    label: "Ground Migration Surge",
    category: "migration",
    intensity: 2,
    description: "Massive terrestrial movement; trampling hazards and stampedes.",
    tags: ["ground", "migration", "hazard"]
  },
  INVASIVE_PANIC: {
    key: "invasive_panic",
    label: "Invasive Panic",
    category: "invasive",
    intensity: 3,
    description: "A hyper-predator invades, causing local monsters to flee or behave erratically.",
    tags: ["apex", "panic", "displacement"]
  },
  ELEMENTAL_CATACLYSM: {
    key: "elemental_cataclysm",
    label: "Elemental Cataclysm",
    category: "elemental",
    intensity: 3,
    description: "Region-wide elemental imbalance reshapes combat and encounters.",
    tags: ["elemental", "cataclysm", "high_danger"]
  }
};

export const WEATHER_TYPES = {
  CLEAR: { key: "clear", label: "Clear Skies", group: "baseline" },
  OVERCAST: { key: "overcast", label: "Overcast", group: "baseline" },
  FOG: { key: "fog", label: "Fog", group: "baseline" },

  THUNDERSTORM: { key: "thunderstorm", label: "Thunderstorm", group: "storm" },
  VOLCANIC_LIGHTNING: { key: "volcanic_lightning", label: "Volcanic Lightning", group: "storm" },
  TEMPEST_FRONT: { key: "tempest_front", label: "Tempest Front", group: "storm" },
  SUPERCELL: { key: "supercell", label: "Supercell", group: "storm" },
  HABOOB: { key: "haboob", label: "Haboob", group: "storm" },

  RAIN: { key: "rain", label: "Rain", group: "precipitation" },
  HEAVY_RAIN: { key: "heavy_rain", label: "Heavy Rain", group: "precipitation" },
  ACID_RAIN: { key: "acid_rain", label: "Acid Rain", group: "precipitation" },
  ASHFALL: { key: "ashfall", label: "Ashfall", group: "precipitation" },
  SNOW: { key: "snow", label: "Snow", group: "precipitation" },
  BLIZZARD: { key: "blizzard", label: "Blizzard", group: "precipitation" },

  ARCANE_WINDS: { key: "arcane_winds", label: "Arcane Winds", group: "exotic" },
  ASTRAL_DRIZZLE: { key: "astral_drizzle", label: "Astral Drizzle", group: "exotic" },
  VOID_MISTS: { key: "void_mists", label: "Void Mists", group: "exotic" },
  EMBERFALL: { key: "emberfall", label: "Emberfall", group: "exotic" }
};

export const ANOMALIES = {
  FIRE_RIFT: {
    key: "fire_rift",
    label: "Fire Rift",
    family: "elemental",
    description: "A tear leaking raw flame into the world.",
    tags: ["fire", "rift"]
  },
  FROST_BLOOM: {
    key: "frost_bloom",
    label: "Frost Bloom",
    family: "elemental",
    description: "Localized explosion of crystalline frost.",
    tags: ["frost", "crystal"]
  },
  STORM_NODE: {
    key: "storm_node",
    label: "Storm Node",
    family: "elemental",
    description: "A static locus of storm energy.",
    tags: ["storm", "lightning"]
  },
  EARTH_PULSE: {
    key: "earth_pulse",
    label: "Earth Pulse",
    family: "elemental",
    description: "The ground hums with primal force.",
    tags: ["earth", "primal"]
  },
  ARCANE_SURGE: {
    key: "arcane_surge",
    label: "Arcane Surge",
    family: "arcane",
    description: "Arcane currents spike unpredictably.",
    tags: ["arcane", "unstable"]
  },
  VOID_TEAR: {
    key: "void_tear",
    label: "Void Tear",
    family: "void",
    description: "A thin wound in reality itself.",
    tags: ["void", "corruption"]
  },
  TIME_ECHO: {
    key: "time_echo",
    label: "Time Echo",
    family: "temporal",
    description: "Moments repeat and overlap strangely.",
    tags: ["time", "echo"]
  },
  GRAVITY_WELL: {
    key: "gravity_well",
    label: "Gravity Well",
    family: "spatial",
    description: "Gravity bends around an unseen center.",
    tags: ["gravity", "distortion"]
  },
  SPATIAL_DISTORTION: {
    key: "spatial_distortion",
    label: "Spatial Distortion",
    family: "spatial",
    description: "Distances feel wrong and twisted.",
    tags: ["space", "distortion"]
  },
  FUNGAL_OVERGROWTH: {
    key: "fungal_overgrowth",
    label: "Fungal Overgrowth",
    family: "biological",
    description: "Sprawling fungal colonies warp the terrain.",
    tags: ["fungus", "toxic"]
  },
  CRYSTAL_BLOOM: {
    key: "crystal_bloom",
    label: "Crystal Bloom",
    family: "mineral",
    description: "Crystalline growths resonate with strange energy.",
    tags: ["crystal", "resonance"]
  },
  PRIMAL_AWAKENING: {
    key: "primal_awakening",
    label: "Primal Awakening",
    family: "primal",
    description: "Ancient forces stir beneath the surface.",
    tags: ["primal", "ancient"]
  }
};

export const MIGRATIONS = {
  WOLF_PACK: {
    key: "wolf_pack_migration",
    label: "Wolf Pack Migration",
    family: "beast",
    movementType: "ground",
    description: "Wolves relocate in coordinated packs.",
    tags: ["wolf", "pack"]
  },
  ELK_HERD: {
    key: "elk_herd_migration",
    label: "Elk Herd Migration",
    family: "beast",
    movementType: "ground",
    description: "Elk herds shift grazing grounds.",
    tags: ["herd", "grazing"]
  },
  DIRE_BOAR: {
    key: "dire_boar_migration",
    label: "Dire Boar Migration",
    family: "beast",
    movementType: "ground",
    description: "Aggressive boars churn the landscape.",
    tags: ["boar", "aggressive"]
  },
  RAPTOR_MIGRATION: {
    key: "raptor_migration",
    label: "Raptor Migration",
    family: "beast",
    movementType: "ground",
    description: "Predatory raptors sweep through hunting grounds.",
    tags: ["raptor", "predator"]
  },
  SKY_SERPENT: {
    key: "sky_serpent_migration",
    label: "Sky Serpent Migration",
    family: "beast",
    movementType: "air",
    description: "Sky serpents drift across the region.",
    tags: ["serpent", "air"]
  },
  UNDEAD_DRIFT: {
    key: "undead_drift",
    label: "Undead Drift",
    family: "undead",
    movementType: "ground",
    description: "Restless dead wander in loose formations.",
    tags: ["undead", "drift"]
  },
  VOIDSPAWN_CREEP: {
    key: "voidspawn_creep",
    label: "Voidspawn Creep",
    family: "void",
    movementType: "ground",
    description: "Void-touched creatures slowly encroach.",
    tags: ["void", "corruption"]
  },
  SLIME_BLOOM: {
    key: "slime_bloom_migration",
    label: "Slime Bloom Migration",
    family: "ooze",
    movementType: "ground",
    description: "Slimes ooze across the terrain in numbers.",
    tags: ["slime", "ooze"]
  },
  INSECT_SWARM: {
    key: "insect_swarm_migration",
    label: "Insect Swarm Migration",
    family: "insect",
    movementType: "air",
    description: "Swarming insects darken the skies.",
    tags: ["insect", "swarm"]
  },
  GOLEM_MARCH: {
    key: "golem_march",
    label: "Golem March",
    family: "construct",
    movementType: "ground",
    description: "Constructs relocate with implacable purpose.",
    tags: ["golem", "construct"]
  }
};

export const GLOBAL_MODIFIERS = {
  BLOOD_MOON: {
    key: "blood_moon",
    label: "Blood Moon",
    description: "Aggression and critical strikes surge across the world.",
    tags: ["moon", "aggression", "crit"]
  },
  SOLAR_FLARE: {
    key: "solar_flare",
    label: "Solar Flare",
    description: "Magic is disrupted; lightning and fire grow volatile.",
    tags: ["solar", "magic_disruption"]
  },
  CELESTIAL_ALIGNMENT: {
    key: "celestial_alignment",
    label: "Celestial Alignment",
    description: "Celestial and astral forces are in harmony.",
    tags: ["celestial", "astral"]
  },
  DEEPWINTER: {
    key: "deepwinter",
    label: "Deepwinter",
    description: "Enduring cold grips the world.",
    tags: ["winter", "frost"]
  },
  VERDANT_BLOOM: {
    key: "verdant_bloom",
    label: "Verdant Bloom",
    description: "Life flourishes; healing and growth intensify.",
    tags: ["nature", "healing"]
  },
  RIFT_SEASON: {
    key: "rift_season",
    label: "Rift Season",
    description: "Anomalies and rifts appear more frequently.",
    tags: ["rift", "anomaly"]
  }
};

export const FLAVOR_TAGS = [
  "frostbitten",
  "winterborn",
  "crystal-frost",
  "infernal",
  "magma-scorched",
  "storm-kissed",
  "tempest-forged",
  "void-touched",
  "paradox-charged",
  "deepwild",
  "overgrown",
  "primeval",
  "mire-born",
  "bog-dweller",
  "marsh-haunted",
  "arcane-surge",
  "astral",
  "starlit",
  "unmaking",
  "ancestral"
];

export const ENVIRONMENT_INTERACTIONS = {
  STORM_CONDUCTION: {
    key: "storm_conduction",
    label: "Storm Conduction",
    description: "Lightning abilities chain more often during storms.",
    triggers: { weatherGroups: ["storm"] },
    effectTags: ["lightning", "chain"]
  },
  FROSTBITE_THRESHOLD: {
    key: "frostbite_threshold",
    label: "Frostbite Threshold",
    description: "Cold weather increases slow and ice DOT potency.",
    triggers: { weatherKeys: ["snow", "blizzard"], tags: ["frost"] },
    effectTags: ["slow", "ice_dot"]
  },
  HEAT_EXHAUSTION: {
    key: "heat_exhaustion",
    label: "Heat Exhaustion",
    description: "Hot conditions reduce healing effectiveness.",
    triggers: { weatherKeys: ["emberfall", "volcanic_lightning"] },
    effectTags: ["reduced_healing"]
  },
  VOID_RESONANCE: {
    key: "void_resonance",
    label: "Void Resonance",
    description: "Void anomalies increase corruption status chance.",
    triggers: { anomalyFamilies: ["void"] },
    effectTags: ["corruption"]
  },
  ARCANE_OVERLOAD: {
    key: "arcane_overload",
    label: "Arcane Overload",
    description: "Arcane anomalies increase crit chance for magic abilities.",
    triggers: { anomalyFamilies: ["arcane"] },
    effectTags: ["magic_crit"]
  },
  TOXIC_BLOOM: {
    key: "toxic_bloom",
    label: "Toxic Bloom",
    description: "Swamp anomalies add poison bursts to DOT ticks.",
    triggers: { anomalyKeys: ["fungal_overgrowth"], biomeTags: ["swamp"] },
    effectTags: ["poison"]
  },
  STAMPEDE_HAZARD: {
    key: "stampede_hazard",
    label: "Stampede Hazard",
    description: "Migration events add random physical hazard hits.",
    triggers: { crisisCategories: ["beast_tide"], migration: true },
    effectTags: ["physical_hazard"]
  },
  LUNAR_SURGE: {
    key: "lunar_surge",
    label: "Lunar Surge",
    description: "Blood Moon increases spirit and astral damage.",
    triggers: { globalKeys: ["blood_moon"] },
    effectTags: ["spirit", "astral"]
  },
  SOLAR_BURN: {
    key: "solar_burn",
    label: "Solar Burn",
    description: "Solar Flare adds burn chance to fire abilities.",
    triggers: { globalKeys: ["solar_flare"] },
    effectTags: ["burn"]
  },
  CRYSTAL_ECHO: {
    key: "crystal_echo",
    label: "Crystal Echo",
    description: "Crystal anomalies reflect a small portion of damage.",
    triggers: { anomalyKeys: ["crystal_bloom"] },
    effectTags: ["reflect"]
  }
};

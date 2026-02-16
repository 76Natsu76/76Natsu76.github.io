export const REGION_IDENTITY = {

  "forest-edge": {
    archetype: "forestlands",
    personality: "A quiet threshold where the wild begins to whisper.",
    traits: ["nature", "beast", "growth"],
    biomeAffinity: ["deep_forest", "wildwood"],
    anomalyAffinity: ["fungal_bloom", "nature_surge"],
    migrationAffinity: ["beast_migration"],
    globalResonance: ["verdant_bloom"],
    stabilityDrift: +0.02,
    dangerDrift: +0.00,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "verdant-woods": {
    archetype: "forestlands",
    personality: "A lush expanse where sunlight filters through ancient leaves.",
    traits: ["nature", "growth"],
    biomeAffinity: ["wildwood", "overgrowth"],
    anomalyAffinity: ["fungal_bloom"],
    migrationAffinity: ["stag_migration"],
    globalResonance: ["verdant_bloom"],
    stabilityDrift: +0.02,
    dangerDrift: +0.01,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "primordial-grove": {
    archetype: "forestlands",
    personality: "Roots older than memory pulse with ancient magic.",
    traits: ["nature", "arcane", "primal"],
    biomeAffinity: ["overgrowth", "grove", "deep_forest"],
    anomalyAffinity: ["nature_surge", "arcane_bloom"],
    migrationAffinity: ["beast_migration"],
    globalResonance: ["verdant_bloom"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "verdant-wildwood": {
    archetype: "forestlands",
    personality: "A deep wild where the forest watches back.",
    traits: ["nature", "beast"],
    biomeAffinity: ["wildwood", "deep_forest"],
    anomalyAffinity: ["fungal_bloom"],
    migrationAffinity: ["wolf_pack"],
    globalResonance: ["verdant_bloom"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "plains-field": {
    archetype: "plains",
    personality: "Open fields swept by gentle winds and roaming herds.",
    traits: ["wind", "beast"],
    biomeAffinity: ["plains", "open_steppe"],
    anomalyAffinity: ["wind_shear"],
    migrationAffinity: ["herd_migration"],
    globalResonance: ["stormfront"],
    stabilityDrift: +0.02,
    dangerDrift: +0.00,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "highland-cliffs": {
    archetype: "highlands",
    personality: "Jagged cliffs carved by relentless winds.",
    traits: ["wind", "storm"],
    biomeAffinity: ["high_cliffs", "storm_cliffs"],
    anomalyAffinity: ["storm_node"],
    migrationAffinity: ["eagle_migration"],
    globalResonance: ["thunder_surge"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "sunspire-highlands": {
    archetype: "highlands",
    personality: "Sunlit peaks where storms gather their strength.",
    traits: ["storm", "fire"],
    biomeAffinity: ["storm_highlands", "high_cliffs"],
    anomalyAffinity: ["solar_flare", "storm_node"],
    migrationAffinity: ["skybeast_migration"],
    globalResonance: ["solar_convergence"],
    stabilityDrift: +0.01,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "highlands-of-thorne": {
    archetype: "highlands",
    personality: "A rugged frontier of stone and storm.",
    traits: ["earth", "storm"],
    biomeAffinity: ["stone_pass", "high_cliffs"],
    anomalyAffinity: ["quake_rift"],
    migrationAffinity: ["rockbeast_migration"],
    globalResonance: ["stormfront"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "mountains": {
    archetype: "mountains",
    personality: "Ancient peaks that pierce the sky.",
    traits: ["earth", "wind"],
    biomeAffinity: ["stone_pass", "high_cliffs"],
    anomalyAffinity: ["quake_rift"],
    migrationAffinity: ["mountain_goat_migration"],
    globalResonance: ["stormfront"],
    stabilityDrift: +0.02,
    dangerDrift: +0.01,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "titanfall": {
    archetype: "cataclysmic_highlands",
    personality: "A land scarred by a celestial impact.",
    traits: ["chaos", "fire", "earth"],
    biomeAffinity: ["titanic_crater", "stone_pass"],
    anomalyAffinity: ["chaos_fissure"],
    migrationAffinity: ["titanborn_migration"],
    globalResonance: ["chaos_storm"],
    stabilityDrift: -0.02,
    dangerDrift: +0.05,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "swamp-marsh": {
    archetype: "swamp",
    personality: "A murky wetland where decay feeds new life.",
    traits: ["poison", "water", "fungus"],
    biomeAffinity: ["marsh", "bog"],
    anomalyAffinity: ["fungal_bloom"],
    migrationAffinity: ["swamp_beast_migration"],
    globalResonance: ["plague_mist"],
    stabilityDrift: +0.00,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "desert-dunes": {
    archetype: "desert",
    personality: "Endless dunes shaped by scorching winds.",
    traits: ["fire", "earth"],
    biomeAffinity: ["dunes", "sunscorched_dunes"],
    anomalyAffinity: ["heat_mirage"],
    migrationAffinity: ["sand_serpent_migration"],
    globalResonance: ["solar_convergence"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "shattered-desert": {
    archetype: "chaos_desert",
    personality: "A fractured wasteland where reality splinters.",
    traits: ["fire", "chaos", "earth"],
    biomeAffinity: ["shattered_wastes", "dunes"],
    anomalyAffinity: ["chaos_fissure"],
    migrationAffinity: ["shardbeast_migration"],
    globalResonance: ["chaos_storm"],
    stabilityDrift: -0.01,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "volcanic-wastes": {
    archetype: "volcanic",
    personality: "Ash and fire churn beneath a darkened sky.",
    traits: ["fire", "earth"],
    biomeAffinity: ["ashlands", "magma_fields"],
    anomalyAffinity: ["magma_surge"],
    migrationAffinity: ["fire_elemental_migration"],
    globalResonance: ["inferno_cycle"],
    stabilityDrift: -0.01,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "volcano-rim": {
    archetype: "volcanic",
    personality: "A fiery frontier where the earth never sleeps.",
    traits: ["fire", "chaos"],
    biomeAffinity: ["magma_fields", "ashlands"],
    anomalyAffinity: ["magma_surge"],
    migrationAffinity: ["lava_beast_migration"],
    globalResonance: ["inferno_cycle"],
    stabilityDrift: -0.02,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "emberforge-depths": {
    archetype: "volcanic_underdeep",
    personality: "Molten halls echo with the roar of ancient forges.",
    traits: ["fire", "metal"],
    biomeAffinity: ["molten_underdeep", "magma_fields"],
    anomalyAffinity: ["forge_eruption"],
    migrationAffinity: ["metalbeast_migration"],
    globalResonance: ["inferno_cycle"],
    stabilityDrift: -0.02,
    dangerDrift: +0.05,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "emberfang-ridge": {
    archetype: "volcanic_ridge",
    personality: "A burning ridge where fire breathes through the earth.",
    traits: ["fire", "chaos"],
    biomeAffinity: ["ember_ridge", "ashlands"],
    anomalyAffinity: ["flame_rift"],
    migrationAffinity: ["emberwolf_migration"],
    globalResonance: ["inferno_cycle"],
    stabilityDrift: -0.01,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "molten-underdeep": {
    archetype: "volcanic_underdeep",
    personality: "A labyrinth of molten stone and ancient pressure.",
    traits: ["fire", "earth"],
    biomeAffinity: ["molten_underdeep", "magma_fields"],
    anomalyAffinity: ["magma_surge"],
    migrationAffinity: ["underdeep_elemental_migration"],
    globalResonance: ["inferno_cycle"],
    stabilityDrift: -0.02,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "tundra-wastes": {
    archetype: "frostlands",
    personality: "A frozen expanse where the wind carries ancient whispers.",
    traits: ["ice", "wind"],
    biomeAffinity: ["tundra", "frozen_expanse"],
    anomalyAffinity: ["frost_bloom"],
    migrationAffinity: ["frostbeast_migration"],
    globalResonance: ["deepwinter"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "frostlands": {
    archetype: "frostlands",
    personality: "A crystalline wilderness shaped by eternal winter.",
    traits: ["ice", "arcane"],
    biomeAffinity: ["frozen_expanse", "crystalline_frost"],
    anomalyAffinity: ["frost_bloom"],
    migrationAffinity: ["ice_elemental_migration"],
    globalResonance: ["deepwinter"],
    stabilityDrift: +0.01,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "cave-entrance": {
    archetype: "caverns",
    personality: "The threshold into the world below.",
    traits: ["earth", "dark"],
    biomeAffinity: ["cave", "stone_pass"],
    anomalyAffinity: ["echo_rift"],
    migrationAffinity: ["cavebeast_migration"],
    globalResonance: ["underdeep_pressure"],
    stabilityDrift: +0.01,
    dangerDrift: +0.01,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "crystal-caverns": {
    archetype: "caverns",
    personality: "Crystalline halls that hum with arcane resonance.",
    traits: ["arcane", "light"],
    biomeAffinity: ["crystal_caverns", "prism_caverns"],
    anomalyAffinity: ["arcane_bloom"],
    migrationAffinity: ["crystalbeast_migration"],
    globalResonance: ["mana_flux"],
    stabilityDrift: +0.00,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "shadow-labyrinth": {
    archetype: "void_caverns",
    personality: "A twisting maze where shadows whisper.",
    traits: ["dark", "void"],
    biomeAffinity: ["void_labyrinth", "underdeep"],
    anomalyAffinity: ["void_tear"],
    migrationAffinity: ["shadowbeast_migration"],
    globalResonance: ["void_storm"],
    stabilityDrift: -0.01,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "ruins-outskirts": {
    archetype: "ruins",
    personality: "Crumbling stones echo with forgotten voices.",
    traits: ["dark", "arcane"],
    biomeAffinity: ["ruins", "forgotten_ruins"],
    anomalyAffinity: ["arcane_echo"],
    migrationAffinity: ["undead_migration"],
    globalResonance: ["eclipse"],
    stabilityDrift: +0.00,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "eternal-citadel": {
    archetype: "celestial_ruins",
    personality: "A fallen fortress where divine power still lingers.",
    traits: ["holy", "light"],
    biomeAffinity: ["celestial_fortress", "ascension_spires"],
    anomalyAffinity: ["radiant_surge"],
    migrationAffinity: ["seraph_migration"],
    globalResonance: ["divine_convergence"],
    stabilityDrift: +0.02,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "azure-coast": {
    archetype: "coastlands",
    personality: "A bright shoreline shaped by tides and wind.",
    traits: ["water", "wind"],
    biomeAffinity: ["coastal", "reef"],
    anomalyAffinity: ["tide_surge"],
    migrationAffinity: ["seabird_migration"],
    globalResonance: ["stormfront"],
    stabilityDrift: +0.02,
    dangerDrift: +0.01,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "stormbreaker-coast": {
    archetype: "stormlands",
    personality: "A violent coastline where storms never rest.",
    traits: ["storm", "water"],
    biomeAffinity: ["storm_coast", "thunder_coast"],
    anomalyAffinity: ["storm_node"],
    migrationAffinity: ["stormbeast_migration"],
    globalResonance: ["thunder_surge"],
    stabilityDrift: +0.00,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "outcast-island": {
    archetype: "island",
    personality: "A lonely island battered by shifting tides.",
    traits: ["water", "nature"],
    biomeAffinity: ["island", "coastal"],
    anomalyAffinity: ["tide_surge"],
    migrationAffinity: ["seabird_migration"],
    globalResonance: ["stormfront"],
    stabilityDrift: +0.01,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "stormforge-sanctum": {
    archetype: "stormlands",
    personality: "A sanctum where lightning and magic intertwine.",
    traits: ["storm", "arcane"],
    biomeAffinity: ["storm_cliffs", "arcane_storm"],
    anomalyAffinity: ["storm_node", "arcane_bloom"],
    migrationAffinity: ["storm_elemental_migration"],
    globalResonance: ["thunder_surge"],
    stabilityDrift: -0.01,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "arcstone-enclave": {
    archetype: "arcane_highlands",
    personality: "A nexus of runes and storm‑charged mana.",
    traits: ["arcane", "storm"],
    biomeAffinity: ["mana_fields", "arcane_storm"],
    anomalyAffinity: ["arcane_bloom"],
    migrationAffinity: ["mana_beast_migration"],
    globalResonance: ["mana_flux"],
    stabilityDrift: +0.00,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "void-spire": {
    archetype: "voidlands",
    personality: "A towering spire where reality frays.",
    traits: ["void", "chaos"],
    biomeAffinity: ["void_barrens", "entropy_rifts"],
    anomalyAffinity: ["void_tear"],
    migrationAffinity: ["voidspawn_migration"],
    globalResonance: ["void_storm"],
    stabilityDrift: -0.02,
    dangerDrift: +0.05,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "void-frontier": {
    archetype: "voidlands",
    personality: "The edge of the known world, where corruption spreads.",
    traits: ["void", "dark"],
    biomeAffinity: ["corruption_fields", "void_barrens"],
    anomalyAffinity: ["corruption_bloom"],
    migrationAffinity: ["corruption_beast_migration"],
    globalResonance: ["void_storm"],
    stabilityDrift: -0.01,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "arcane-riftlands": {
    archetype: "arcane_realms",
    personality: "A land fractured by raw magical energy.",
    traits: ["arcane", "cosmic"],
    biomeAffinity: ["arcane_rift", "mana_fields"],
    anomalyAffinity: ["arcane_bloom"],
    migrationAffinity: ["riftbeast_migration"],
    globalResonance: ["mana_flux"],
    stabilityDrift: +0.00,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "abyss-gate": {
    archetype: "abyssal",
    personality: "A gateway into the depths of shadow.",
    traits: ["dark", "void"],
    biomeAffinity: ["abyssal_depths", "shadow_trench"],
    anomalyAffinity: ["void_tear"],
    migrationAffinity: ["abyssal_beast_migration"],
    globalResonance: ["eclipse"],
    stabilityDrift: -0.01,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "abyssal-scar": {
    archetype: "abyssal",
    personality: "A wound in the world where nightmares seep through.",
    traits: ["dark", "chaos"],
    biomeAffinity: ["nightmare_rifts", "abyssal_depths"],
    anomalyAffinity: ["nightmare_bloom"],
    migrationAffinity: ["nightmare_migration"],
    globalResonance: ["eclipse"],
    stabilityDrift: -0.02,
    dangerDrift: +0.05,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "celestial-expanse": {
    archetype: "celestial",
    personality: "A radiant realm touched by divine light.",
    traits: ["holy", "light"],
    biomeAffinity: ["radiant_fields", "ascension_spires"],
    anomalyAffinity: ["radiant_surge"],
    migrationAffinity: ["seraph_migration"],
    globalResonance: ["divine_convergence"],
    stabilityDrift: +0.03,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "radiant-ascension-spire": {
    archetype: "celestial",
    personality: "A towering spire where light gathers in pure form.",
    traits: ["holy", "light"],
    biomeAffinity: ["ascension_spires", "celestial_fortress"],
    anomalyAffinity: ["radiant_surge"],
    migrationAffinity: ["seraph_migration"],
    globalResonance: ["divine_convergence"],
    stabilityDrift: +0.03,
    dangerDrift: +0.03,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "seraphic-crucible": {
    archetype: "celestial",
    personality: "A divine crucible where celestial fire is refined into pure judgment.",
    traits: ["holy", "light", "fire"],
    biomeAffinity: ["seraphic_plains", "celestial_fortress"],
    anomalyAffinity: ["radiant_surge", "holy_convergence"],
    migrationAffinity: ["seraph_migration"],
    globalResonance: ["divine_convergence"],
    stabilityDrift: +0.03,
    dangerDrift: +0.04,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "trainers-city": {
    archetype: "civilization",
    personality: "A bustling hub of commerce, competition, and restless ambition.",
    traits: ["city", "humanoid", "order"],
    biomeAffinity: ["city"],
    anomalyAffinity: ["arcane_echo"],
    migrationAffinity: [],
    globalResonance: ["prosperity_cycle"],
    stabilityDrift: +0.05,
    dangerDrift: +0.00,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "spirit-kingdom": {
    archetype: "spiritual_realm",
    personality: "A kingdom where the veil between the living and the ethereal grows thin.",
    traits: ["arcane", "spirit", "light"],
    biomeAffinity: ["settlement", "arcane_rift"],
    anomalyAffinity: ["spirit_bloom", "arcane_bloom"],
    migrationAffinity: ["spirit_migration"],
    globalResonance: ["divine_convergence"],
    stabilityDrift: +0.02,
    dangerDrift: +0.02,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "worldbreaker-horizon": {
    archetype: "cataclysmic",
    personality: "A horizon shattered by cosmic force, where the world strains to hold together.",
    traits: ["chaos", "cosmic", "fire"],
    biomeAffinity: ["chaos_fields", "titanic_crater"],
    anomalyAffinity: ["chaos_fissure", "cosmic_rift"],
    migrationAffinity: ["titanborn_migration"],
    globalResonance: ["chaos_storm"],
    stabilityDrift: -0.03,
    dangerDrift: +0.06,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  },

  "worlds-end-expanse": {
    archetype: "cosmic_wasteland",
    personality: "A desolate frontier at the edge of existence, where reality thins into starlight.",
    traits: ["cosmic", "void", "chaos"],
    biomeAffinity: ["nightmare_rifts", "cosmic_wastes"],
    anomalyAffinity: ["cosmic_rift", "void_tear"],
    migrationAffinity: ["eldritch_migration"],
    globalResonance: ["eclipse", "chaos_storm"],
    stabilityDrift: -0.03,
    dangerDrift: +0.05,
    professionBias: { /* e.g., warrior: +5 */ },
    elementBias: { /* e.g., fire: +10 */ },
    subraceBias: { /* e.g., undead: +15 */ }
  }
}; // END REGION_IDENTITY

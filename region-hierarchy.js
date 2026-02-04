// REGION_HIERARCHY.js

export const REGION_HIERARCHY = {
  /* =========================
   * EARLY / MID REGIONS
   * ========================= */

  forest: {
    tier: 1,
    subregions: {
      forest_edge:        { tier: 1, biome: "forest" },
      forest_entry:       { tier: 1, biome: "forest" }, // alias-style entry zone if you use it
      deep_forest:        { tier: 3, biome: "forest" },
      verdant_woods:      { tier: 2, biome: "forest" },
      verdant_wildwood:   { tier: 2, biome: "forest" }
    }
  },

  plains: {
    tier: 1,
    subregions: {
      plains_field:       { tier: 1, biome: "plains" },
      open_steppe:        { tier: 1, biome: "steppe" },
      sunspire_highlands: { tier: 2, biome: "highlands" } // plains → highlands transition
    }
  },

  city: {
    tier: 1,
    subregions: {
      trainers_city:      { tier: 1, biome: "urban" }
      // future: city_slums, noble_district, trade_port, etc.
    }
  },

  swamp: {
    tier: 1,
    subregions: {
      swamp_marsh:        { tier: 1, biome: "swamp" },
      drowned_marsh:      { tier: 2, biome: "swamp" },
      whispering_marsh:   { tier: 2, biome: "swamp" }
    }
  },

  desert: {
    tier: 2,
    subregions: {
      desert_dunes:       { tier: 2, biome: "desert" },
      sunscorched_dunes:  { tier: 3, biome: "desert" },
      shattered_desert:   { tier: 3, biome: "desert" }
    }
  },

  tundra: {
    tier: 2,
    subregions: {
      tundra_wastes:      { tier: 2, biome: "tundra" },
      frostlands:         { tier: 3, biome: "tundra" },
      crystalline_tundra: { tier: 3, biome: "tundra_crystal" }
    }
  },

  mountains: {
    tier: 2,
    subregions: {
      highland_cliffs:    { tier: 2, biome: "highlands" },
      highlands_of_thorne:{ tier: 3, biome: "storm_highlands" },
      mountain_peak:      { tier: 3, biome: "mountain_peak" }
    }
  },

  cavern: {
    tier: 2,
    subregions: {
      cave_entrance:      { tier: 1, biome: "cave" },
      crystal_pass:       { tier: 2, biome: "crystal_cave" },
      crystal_caverns:    { tier: 3, biome: "crystal_cave" },
      deep_caverns:       { tier: 3, biome: "deep_caverns" },
      underdeep:          { tier: 3, biome: "underdeep" },
      subterranean:       { tier: 2, biome: "subterranean" }
    }
  },

  ruins: {
    tier: 2,
    subregions: {
      ruins_outskirts:    { tier: 2, biome: "ruins" },
      ruined_kingdom:     { tier: 3, biome: "ruined_kingdom" },
      forgotten_ruins:    { tier: 3, biome: "forgotten_ruins" }
    }
  },

  primordial_grove: {
    tier: 3,
    subregions: {
      elderwood_heart:    { tier: 4, biome: "ancient_forest" },
      primeval_overgrowth:{ tier: 5, biome: "ancient_forest" }
    }
  },

  /* =========================
   * VOID / CELESTIAL / ARCANE
   * ========================= */

  void: {
    tier: 3,
    subregions: {
      void_realm:         { tier: 3, biome: "void" },
      void_spire:         { tier: 4, biome: "void_wastes" },
      shadow_labyrinth:   { tier: 4, biome: "void_labyrinth" },
      corrupted:          { tier: 3, biome: "corrupted" }
    }
  },

  abyssal_scar: {
    tier: 3,
    subregions: {
      abyss_gate:         { tier: 3, biome: "abyssal" },
      abyssal_deep:       { tier: 4, biome: "abyssal" },
      abyssal_scar:       { tier: 4, biome: "abyssal" }
    }
  },

  void_frontier: {
    tier: 4,
    subregions: {
      worlds_end_expanse: { tier: 4, biome: "void_frontier" }
    }
  },

  celestial: {
    tier: 3,
    subregions: {
      astral_plane:       { tier: 3, biome: "astral" },
      spirit_kingdom:     { tier: 3, biome: "astral_spirit" }
    }
  },

  celestial_expanse: {
    tier: 4,
    subregions: {
      celestial_expanse:        { tier: 4, biome: "celestial" },
      radiant_ascension_spire:  { tier: 5, biome: "celestial_spire" },
      seraphic_crucible:        { tier: 5, biome: "celestial_forge" },
      celestial_horizon:        { tier: 4, biome: "celestial_horizon" }
    }
  },

  eternal_citadel: {
    tier: 5,
    subregions: {
      eternal_citadel:    { tier: 5, biome: "celestial_fortress" }
    }
  },

  astral_nexus: {
    tier: 6,
    subregions: {
      astral_nexus:       { tier: 6, biome: "astral_nexus" }
    }
  },

  arcane_rift: {
    tier: 3,
    subregions: {
      arcane_riftlands:   { tier: 3, biome: "arcane_rift" },
      arcstone_enclave:   { tier: 3, biome: "arcane" },
      stormforge_sanctum: { tier: 4, biome: "arcane_storm" }
    }
  },

  /* =========================
   * TITANIC / LATEGAME REGIONS
   * ========================= */

  worldbreaker_horizon: {
    tier: 5,
    subregions: {
      volcano_rim:        { tier: 4, biome: "volcano" },
      volcanic_wastes:    { tier: 4, biome: "magma" },
      emberforge_depths:  { tier: 5, biome: "molten_crest" },
      emberfang_ridge:    { tier: 5, biome: "molten_crest" },
      molten_underdeep:   { tier: 5, biome: "magma" },
      titanfall:          { tier: 6, biome: "titanic_crater" }
    }
  },

  /* =========================
   * OCEANIC / COASTAL
   * ========================= */

  ocean: {
    tier: 1,
    subregions: {
      western_coast:      { tier: 1, biome: "coastal" },
      azure_coast:        { tier: 1, biome: "coastal" },
      stormbreaker_coast: { tier: 2, biome: "storm_coast" },
      outcast_island:     { tier: 2, biome: "island" },
      elusive_reef:       { tier: 2, biome: "reef" },
      point_nemo:         { tier: 3, biome: "open_ocean" },
      deep_abyss:         { tier: 4, biome: "abyss" },
      leviathan_trench:   { tier: 5, biome: "abyss" },
      abyssal_rift:       { tier: 6, biome: "eldritch_abyss" }
    }
  }
};

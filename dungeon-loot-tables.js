/************************************************************
 * dungeon-loot-tables.js — Canonical Dungeon Loot Tables
 ************************************************************/

export const DUNGEON_LOOT_TABLES = {

  /************************************************************
   * CAVERNS OF THE FIRST ECHO
   ************************************************************/
  cavern_floor_1: {
    goldRange: [5, 20],
    xpRange: [10, 25],
    items: [
      { itemKey: "stone_fragment", weight: 10, min: 1, max: 2 },
      { itemKey: "torch", weight: 5, min: 1, max: 1 },
      { itemKey: "minor_healing_potion", weight: 3, min: 1, max: 1 }
    ]
  },

  cavern_floor_2: {
    goldRange: [15, 35],
    xpRange: [20, 40],
    items: [
      { itemKey: "deepstone_shard", weight: 8, min: 1, max: 2 },
      { itemKey: "reinforced_pickaxe", weight: 2, min: 1, max: 1 },
      { itemKey: "torch", weight: 4, min: 1, max: 1 }
    ]
  },

  cavern_boss: {
    goldRange: [50, 120],
    xpRange: [100, 200],
    items: [
      { itemKey: "obsidian_fragment", weight: 10, min: 1, max: 1 },
      { itemKey: "obsidian_core", weight: 3, min: 1, max: 1 },
      { itemKey: "rare_gemstone", weight: 1, min: 1, max: 1 }
    ]
  },

  /************************************************************
   * STORMSPIRE ASCENT
   ************************************************************/
  storm_floor_1: {
    goldRange: [10, 25],
    xpRange: [20, 40],
    items: [
      { itemKey: "charged_crystal", weight: 8, min: 1, max: 1 },
      { itemKey: "storm_essence", weight: 3, min: 1, max: 1 },
      { itemKey: "wind_feather", weight: 5, min: 1, max: 2 }
    ]
  },

  storm_floor_2: {
    goldRange: [20, 40],
    xpRange: [30, 50],
    items: [
      { itemKey: "storm_essence", weight: 6, min: 1, max: 1 },
      { itemKey: "tempest_core", weight: 2, min: 1, max: 1 },
      { itemKey: "charged_crystal", weight: 4, min: 1, max: 2 }
    ]
  },

  storm_boss: {
    goldRange: [80, 160],
    xpRange: [150, 300],
    items: [
      { itemKey: "stormcore", weight: 10, min: 1, max: 1 },
      { itemKey: "tempest_relic", weight: 2, min: 1, max: 1 },
      { itemKey: "storm_crown_fragment", weight: 1, min: 1, max: 1 }
    ]
  },

  /************************************************************
   * ASTRAL RIFT LABYRINTH
   ************************************************************/
  astral_floor_1: {
    goldRange: [20, 40],
    xpRange: [40, 80],
    items: [
      { itemKey: "astral_dust", weight: 10, min: 1, max: 2 },
      { itemKey: "mana_thread", weight: 5, min: 1, max: 1 },
      { itemKey: "astral_shard", weight: 2, min: 1, max: 1 }
    ]
  },

  astral_floor_2: {
    goldRange: [40, 80],
    xpRange: [60, 120],
    items: [
      { itemKey: "astral_shard", weight: 8, min: 1, max: 1 },
      { itemKey: "riftcore", weight: 3, min: 1, max: 1 },
      { itemKey: "void_essence", weight: 2, min: 1, max: 1 }
    ]
  },

  astral_boss: {
    goldRange: [120, 240],
    xpRange: [200, 400],
    items: [
      { itemKey: "astral_shard", weight: 10, min: 1, max: 2 },
      { itemKey: "astral_core", weight: 3, min: 1, max: 1 },
      { itemKey: "sovereign_relic", weight: 1, min: 1, max: 1 }
    ]
  },

  /************************************************************
   * ENDLESS ABYSS (scaling handled in dungeon-engine)
   ************************************************************/
  endless_base: {
    goldRange: [10, 25],
    xpRange: [15, 35],
    items: [
      { itemKey: "abyss_dust", weight: 10, min: 1, max: 2 },
      { itemKey: "void_fragment", weight: 4, min: 1, max: 1 },
      { itemKey: "shimmering_essence", weight: 2, min: 1, max: 1 }
    ]
  },

  /************************************************************
   * GREAT DUNGEON OF 100 FLOORS — 10 BANDS
   ************************************************************/
  great_dungeon_band_1: {
    goldRange: [5, 15],
    xpRange: [10, 20],
    items: [
      { itemKey: "slime_core", weight: 10, min: 1, max: 2 },
      { itemKey: "weak_potion", weight: 5, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_2: {
    goldRange: [10, 25],
    xpRange: [20, 40],
    items: [
      { itemKey: "goblin_ear", weight: 10, min: 1, max: 2 },
      { itemKey: "sturdy_leather", weight: 4, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_3: {
    goldRange: [20, 40],
    xpRange: [40, 80],
    items: [
      { itemKey: "orc_tusk", weight: 10, min: 1, max: 2 },
      { itemKey: "iron_chunk", weight: 4, min: 1, max: 2 }
    ]
  },

  great_dungeon_band_4: {
    goldRange: [40, 80],
    xpRange: [80, 160],
    items: [
      { itemKey: "shadow_fang", weight: 10, min: 1, max: 2 },
      { itemKey: "enchanted_cloth", weight: 3, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_5: {
    goldRange: [80, 120],
    xpRange: [120, 240],
    items: [
      { itemKey: "void_fragment", weight: 10, min: 1, max: 2 },
      { itemKey: "abyssal_ink", weight: 3, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_6: {
    goldRange: [120, 200],
    xpRange: [200, 350],
    items: [
      { itemKey: "astral_dust", weight: 10, min: 1, max: 2 },
      { itemKey: "mana_thread", weight: 3, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_7: {
    goldRange: [200, 300],
    xpRange: [300, 500],
    items: [
      { itemKey: "riftcore", weight: 8, min: 1, max: 1 },
      { itemKey: "void_essence", weight: 4, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_8: {
    goldRange: [300, 450],
    xpRange: [500, 800],
    items: [
      { itemKey: "astral_shard", weight: 8, min: 1, max: 1 },
      { itemKey: "ancient_relic", weight: 2, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_9: {
    goldRange: [450, 700],
    xpRange: [800, 1200],
    items: [
      { itemKey: "abyssal_core", weight: 6, min: 1, max: 1 },
      { itemKey: "mythic_fragment", weight: 1, min: 1, max: 1 }
    ]
  },

  great_dungeon_band_10: {
    goldRange: [700, 1200],
    xpRange: [1200, 2000],
    items: [
      { itemKey: "sovereign_relic", weight: 5, min: 1, max: 1 },
      { itemKey: "legendary_essence", weight: 1, min: 1, max: 1 }
    ]
  },

  /************************************************************
   * MIMIC LOOT (universal)
   ************************************************************/
  mimic_loot: {
    goldRange: [20, 60],
    xpRange: [30, 80],
    items: [
      { itemKey: "mimic_tooth", weight: 10, min: 1, max: 1 },
      { itemKey: "sticky_resin", weight: 5, min: 1, max: 2 },
      { itemKey: "rare_gemstone", weight: 1, min: 1, max: 1 }
    ]
  }
};

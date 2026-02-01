export const DUNGEON_LOOT_TABLES = {
  "cavern_floor_1": {
    "goldRange": [5, 20],
    "xpRange": [10, 25],
    "items": [
      { "itemKey": "stone_fragment", "weight": 10, "min": 1, "max": 2 },
      { "itemKey": "torch", "weight": 5, "min": 1, "max": 1 }
    ]
  },

  "storm_floor_2": {
    "goldRange": [20, 40],
    "xpRange": [30, 50],
    "items": [
      { "itemKey": "charged_crystal", "weight": 8, "min": 1, "max": 1 },
      { "itemKey": "storm_essence", "weight": 3, "min": 1, "max": 1 }
    ]
  },

  "astral_boss": {
    "goldRange": [100, 200],
    "xpRange": [200, 400],
    "items": [
      { "itemKey": "astral_shard", "weight": 10, "min": 1, "max": 1 },
      { "itemKey": "riftcore", "weight": 2, "min": 1, "max": 1 }
    ]
  },

  "endless_base": {
    goldRange: [10, 25],
    xpRange: [15, 35],
    items: [
      { itemKey: "abyss_dust", weight: 10, min: 1, max: 2 },
      { itemKey: "void_fragment", weight: 4, min: 1, max: 1 },
      { itemKey: "shimmering_essence", weight: 2, min: 1, max: 1 }
    ]
  }
};

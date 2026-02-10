export const REGION_ENCOUNTER_TABLES = {
  forest: {
    base: [
      { enemyKey: "wolf", weight: 40 },
      { enemyKey: "boar", weight: 30 },
      { enemyKey: "forest_bandit", weight: 20 },
      { enemyKey: "sprite", weight: 10 }
    ],
    rare: [
      { enemyKey: "forest_spirit", weight: 3 },
      { enemyKey: "ancient_treant", weight: 1 }
    ]
  },

  plains: {
    base: [
      { enemyKey: "wild_horse", weight: 40 },
      { enemyKey: "bandit_raider", weight: 30 },
      { enemyKey: "giant_beetle", weight: 20 },
      { enemyKey: "wind_sprite", weight: 10 }
    ],
    rare: [
      { enemyKey: "storm_elemental", weight: 2 }
    ]
  },

  mountain: {
    base: [
      { enemyKey: "rock_golem", weight: 40 },
      { enemyKey: "mountain_wolf", weight: 30 },
      { enemyKey: "harpy", weight: 20 },
      { enemyKey: "stone_sprite", weight: 10 }
    ],
    rare: [
      { enemyKey: "earth_titan", weight: 1 }
    ]
  },

  capital_city: {
    safeZone: true
  }
};


/*// encounter table JSON equivalent

export const REGION_ENCOUNTER_TABLES = {
  "forest-edge": {
    "common":   { "tiers": [1, 2] },
    "uncommon": { "tiers": [2] },
    "rare":     { "tiers": [2, 3] },
    "boss":     { "tiers": [3] }
  },
  "deep-forest": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },
  "plains-field": {
    "common":   { "tiers": [1] },
    "uncommon": { "tiers": [1, 2] },
    "rare":     { "tiers": [2] },
    "boss":     { "tiers": [3] }
  },
  "swamp-marsh": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },

  "desert-dunes": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },

  "verdant-woods": {
    "common":   { "tiers": [1, 2] },
    "uncommon": { "tiers": [2] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },

  "frostlands": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3, 4] },
    "boss":     { "tiers": [5] }
  },

  "volcanic-wastes": {
    "common":   { "tiers": [3] },
    "uncommon": { "tiers": [3, 4] },
    "rare":     { "tiers": [4, 5] },
    "boss":     { "tiers": [6] }
  },

  "primordial-grove": {
    "common":   { "tiers": [3] },
    "uncommon": { "tiers": [3, 4] },
    "rare":     { "tiers": [4, 5] },
    "boss":     { "tiers": [6] }
  },

  "celestial-expanse": {
    "common":   { "tiers": [4] },
    "uncommon": { "tiers": [4, 5] },
    "rare":     { "tiers": [5, 6] },
    "boss":     { "tiers": [7] }
  },

  "eternal-citadel": {
    "common":   { "tiers": [4] },
    "uncommon": { "tiers": [4, 5] },
    "rare":     { "tiers": [5, 6] },
    "boss":     { "tiers": [7] }
  },

  "worldbreaker-horizon": {
    "common":   { "tiers": [5] },
    "uncommon": { "tiers": [5, 6] },
    "rare":     { "tiers": [6, 7] },
    "boss":     { "tiers": [7] }
  },

  "astral-nexus": {
    "common":   { "tiers": [5] },
    "uncommon": { "tiers": [5, 6] },
    "rare":     { "tiers": [6, 7] },
    "boss":     { "tiers": [7] }
  },

  "void-realm": {
    "common":   { "tiers": [4] },
    "uncommon": { "tiers": [4, 5] },
    "rare":     { "tiers": [5, 6] },
    "boss":     { "tiers": [6, 7] }
  },

  "abyssal-deep": {
    "common":   { "tiers": [5] },
    "uncommon": { "tiers": [5, 6] },
    "rare":     { "tiers": [6, 7] },
    "boss":     { "tiers": [7] }
  },

  "forest": {
    "common":   { "tiers": [1] },
    "uncommon": { "tiers": [1, 2] },
    "rare":     { "tiers": [2] },
    "boss":     { "tiers": [3] }
  },

  "plains": {
    "common":   { "tiers": [1] },
    "uncommon": { "tiers": [1, 2] },
    "rare":     { "tiers": [2] },
    "boss":     { "tiers": [3] }
  },

  "swamp": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },

  "desert": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },

  "tundra": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3] },
    "boss":     { "tiers": [4] }
  },

  "mountains": {
    "common":   { "tiers": [2] },
    "uncommon": { "tiers": [2, 3] },
    "rare":     { "tiers": [3, 4] },
    "boss":     { "tiers": [5] }
  },

  "void": {
    "common":   { "tiers": [4] },
    "uncommon": { "tiers": [4, 5] },
    "rare":     { "tiers": [5, 6] },
    "boss":     { "tiers": [6, 7] }
  },

  "celestial": {
    "common":   { "tiers": [4] },
    "uncommon": { "tiers": [4, 5] },
    "rare":     { "tiers": [5, 6] },
    "boss":     { "tiers": [6, 7] }
  },

  "arcane-rift": {
    "common":   { "tiers": [4] },
    "uncommon": { "tiers": [4, 5] },
    "rare":     { "tiers": [5] },
    "boss":     { "tiers": [6] }
  },

  "elderwood-heart": {
    "common":   { "tiers": [3] },
    "uncommon": { "tiers": [3, 4] },
    "rare":     { "tiers": [4, 5] },
    "boss":     { "tiers": [6] }
  },

  "primeval-overgrowth": {
    "common":   { "tiers": [3] },
    "uncommon": { "tiers": [3, 4] },
    "rare":     { "tiers": [4, 5] },
    "boss":     { "tiers": [6] }
  },

  "celestial-horizon": {
    "common":   { "tiers": [5] },
    "uncommon": { "tiers": [5, 6] },
    "rare":     { "tiers": [6, 7] },
    "boss":     { "tiers": [7] }
  },

  "worlds-end-expanse": {
    "common":   { "tiers": [5] },
    "uncommon": { "tiers": [5, 6] },
    "rare":     { "tiers": [6, 7] },
    "boss":     { "tiers": [7] }
  }
};
*/

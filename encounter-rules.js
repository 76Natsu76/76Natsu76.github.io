// encounter-rules.js

export const ENCOUNTER_RULES = {
  region: {
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
  },

  biome: {
    forest: {
      families: {
        beast:  3,
        fae:    1,
        plant:  2
      }
    },
    plains: {
      families: {
        beast:   2,
        human:   2,
        bandit:  2
      }
    },
    swamp: {
      families: {
        undead:  2,
        beast:   2,
        hag:     1
      }
    }
  },

  weather: {
    storm: {
      rarityMult: { rare: 1.2, boss: 1.1 }
    },
    fog: {
      familyMult: { undead: 1.3 }
    }
  },

  crisis: {
    beastUprising: {
      familyMult: { beast: 1.5 }
    },
    undeadRising: {
      familyMult: { undead: 1.7 }
    }
  },

  event: {
    harvestFestival: {
      rarityMult: { common: 1.1, rare: 1.1 }
    }
  }
};

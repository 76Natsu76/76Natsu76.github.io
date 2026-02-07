// encounter-rules.js

export const ENCOUNTER_RULES = {
  region: {
    "forest-edge": {
      weights: {
        common:   { tiers: [1, 2], weight: 60 },
        uncommon: { tiers: [2],    weight: 25 },
        rare:     { tiers: [2, 3], weight: 10 },
        boss:     { tiers: [3],    weight: 5 }
      }
    },
    "deep-forest": {
      weights: {
        common:   { tiers: [2],    weight: 50 },
        uncommon: { tiers: [2, 3], weight: 25 },
        rare:     { tiers: [3],    weight: 15 },
        boss:     { tiers: [4],    weight: 10 }
      }
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

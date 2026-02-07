// encounter-rules.js

import { REGION_ENCOUNTER_TABLES } from "./region-encounter-tables.js";

export const ENCOUNTER_RULES = {
  region: buildRegionRules(REGION_ENCOUNTER_TABLES),

  // Optional future expansion
  subregion: {
    // "deep_forest_north": { familyMult: { beast: 1.2, fae: 1.1 } }
  },

  biome: {
    forest: {
      families: { beast: 3, plantfolk: 2, fae: 1 }
    },
    plains: {
      families: { beast: 2, human: 2, bandit: 2 }
    },
    swamp: {
      families: { undead: 2, beast: 2, hag: 1 }
    },
    desert: {
      families: { beast: 2, elemental: 1, bandit: 1 }
    },
    tundra: {
      families: { beast: 1, undead: 1, elemental: 2 }
    },
    ocean: {
      families: { aquatic: 3, beast: 1 }
    }
  },

  weather: {
    storm: {
      rarityMult: { rare: 1.2, boss: 1.1 },
      familyMult: { elemental: 1.3 }
    },
    fog: {
      familyMult: { undead: 1.3 }
    },
    blizzard: {
      familyMult: { elemental: 1.2 }
    }
  },

  crisis: {
    beastUprising: {
      familyMult: { beast: 1.5 }
    },
    undeadRising: {
      familyMult: { undead: 1.7 }
    },
    elementalSurge: {
      familyMult: { elemental: 1.5 }
    }
  },

  event: {
    harvestFestival: {
      rarityMult: { common: 1.1, rare: 1.1 }
    },
    eclipseNight: {
      familyMult: { void: 1.4 }
    }
  },

  flavor: {
    "void-touched": { family: "void", weight: 2 },
    "storm-kissed": { family: "elemental", weight: 2 },
    "deepwild":     { family: "beast", weight: 1.5 }
  }
};

function buildRegionRules(regionEncounterTables) {
  const region = {};

  for (const [regionKey, entry] of Object.entries(regionEncounterTables)) {
    const weights = {};
    for (const [rarity, data] of Object.entries(entry)) {
      weights[rarity] = {
        tiers: data.tiers || [],
        weight: defaultRarityWeight(rarity)
      };
    }
    region[regionKey] = { weights };
  }

  return region;
}

function defaultRarityWeight(rarity) {
  switch (rarity) {
    case "common":   return 60;
    case "uncommon": return 25;
    case "rare":     return 10;
    case "boss":     return 5;
    default:         return 10;
  }
}

// season-definitions.js
// 3F-7: Canonical seasonal cycle definitions

export const SEASONS = [ "spring", "summer", "autumn", "winter" ];

export const SEASON_DEFINITIONS = {
  spring: {
    durationMs: 3 * 24 * 60 * 60 * 1000, // 3 days
    encounterMult: {
      beast: 1.2,
      plantfolk: 1.3
    },
    lootMult: {
      herbs: 1.5
    },
    weatherBias: {
      rain: 1.3
    }
  },

  summer: {
    durationMs: 3 * 24 * 60 * 60 * 1000,
    encounterMult: {
      fire: 1.3,
      desert: 1.2
    },
    lootMult: {
      fireEssence: 1.4
    },
    weatherBias: {
      heatwave: 1.4
    }
  },

  autumn: {
    durationMs: 3 * 24 * 60 * 60 * 1000,
    encounterMult: {
      undead: 1.3,
      fae: 1.1
    },
    lootMult: {
      harvest: 1.6
    },
    weatherBias: {
      fog: 1.3
    }
  },

  winter: {
    durationMs: 3 * 24 * 60 * 60 * 1000,
    encounterMult: {
      frost: 1.4,
      tundra: 1.3
    },
    lootMult: {
      frostShard: 1.5
    },
    weatherBias: {
      blizzard: 1.4
    }
  }
};

/************************************************************
 * mounts.js
 * Canonical mount definitions
 ************************************************************/

export const MOUNTS = {
  // Legacy / world-drop / raid mounts
  forest_stag: {
    id: "forest_stag",
    name: "Forest Stag",
    rarity: "uncommon",
    speedBonus: 10,
    travelCostReduction: 5,
    description: "A proud stag attuned to the deep woods.",
    tags: ["forest", "nature"],
    obtain: {
      type: "drop",
      source: "forest_region",
      chance: 0.02
    },
    // Used by travel-time.js as multiplier
    speed: 1.4
  },

  ember_steed: {
    id: "ember_steed",
    name: "Ember Steed",
    rarity: "rare",
    speedBonus: 18,
    travelCostReduction: 8,
    description: "A fiery horse leaving embers in its wake.",
    tags: ["fire", "desert"],
    obtain: {
      type: "worldBoss",
      bossKey: "ember_tyrant",
      chance: 0.03
    },
    speed: 1.8
  },

  void_drake: {
    id: "void_drake",
    name: "Void Drake",
    rarity: "epic",
    speedBonus: 25,
    travelCostReduction: 12,
    description: "A draconic mount that slips between realities.",
    tags: ["void", "endgame"],
    obtain: {
      type: "raid",
      raidKey: "void_citadel"
    },
    speed: 2.5
  },

  // Stable / progression mounts
  donkey: {
    id: "donkey",
    name: "Donkey",
    rarity: "common",
    description: "A sturdy, reliable mount.",
    speed: 1.2,
    speedBonus: 5,
    travelCostReduction: 2,
    tags: ["basic", "beast"],
    obtain: {
      type: "shop",
      source: "starter_stable"
    }
  },

  horse: {
    id: "horse",
    name: "Horse",
    rarity: "uncommon",
    description: "A fast and loyal steed.",
    speed: 1.5,
    speedBonus: 10,
    travelCostReduction: 4,
    tags: ["basic", "beast"],
    obtain: {
      type: "shop",
      source: "regional_stable"
    }
  },

  warhorse: {
    id: "warhorse",
    name: "Warhorse",
    rarity: "rare",
    description: "A powerful mount trained for battle.",
    speed: 2.0,
    speedBonus: 18,
    travelCostReduction: 6,
    tags: ["military", "noble"],
    obtain: {
      type: "faction",
      source: "royal_guard"
    }
  },

  royal_stallion: {
    id: "royal_stallion",
    name: "Royal Stallion",
    rarity: "legendary",
    description: "A majestic steed of the royal family.",
    speed: 3.0,
    speedBonus: 25,
    travelCostReduction: 10,
    tags: ["royal", "endgame"],
    obtain: {
      type: "quest",
      source: "royal_throne_questline"
    }
  }
};

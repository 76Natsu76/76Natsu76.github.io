// biome-loot.js
// Biome-specific rare drops and natural materials.

export const biomeLoot = {
  forest: {
    rareDrops: [
      { id: "ancient_bark", chance: 0.02 },
      { id: "forest_heart", chance: 0.01 }
    ],
    materials: [
      "softwood",
      "forest_resin",
      "leaf_bundle"
    ]
  },

  cave: {
    rareDrops: [
      { id: "glowing_crystal", chance: 0.015 }
    ],
    materials: [
      "stone_fragment",
      "cave_moss"
    ]
  },

  mountain: {
    rareDrops: [
      { id: "stormcore_shard", chance: 0.02 }
    ],
    materials: [
      "granite_chunk",
      "wind_ore"
    ]
  },

  astral: {
    rareDrops: [
      { id: "astral_shard", chance: 0.02 }
    ],
    materials: [
      "void_dust",
      "astral_thread"
    ]
  },

  swamp: {
    rareDrops: [
      { id: "bog_heart", chance: 0.015 }
    ],
    materials: [
      "swamp_reed",
      "murk_slime"
    ]
  }
};

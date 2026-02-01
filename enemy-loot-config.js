// enemy-loot-config.js
// Unified variant + tag loot configuration.
// Variant multipliers come from ENEMY_VARIANTS.
// Tag-based loot is defined here.

import { ENEMY_VARIANTS } from "./enemy-variants.js";
import { ENEMY_TAGS } from "./enemy-tags.js";

// -----------------------------
// VARIANT CONFIG
// -----------------------------
const variants = {};

for (const key in ENEMY_VARIANTS) {
  const v = ENEMY_VARIANTS[key];
  variants[key.toLowerCase()] = {
    goldMultiplier: v.lootMult || 1,
    extraItems: v.extraLoot || [] // optional future expansion
  };
}

// -----------------------------
// TAG CONFIG (loot only)
// -----------------------------
const tags = {
  elemental: {
    extraItems: [
      { id: "elemental_core", chance: 0.10 }
    ]
  },

  undead: {
    extraItems: [
      { id: "bone_fragment", chance: 0.50 }
    ]
  },

  wind: {
    extraItems: [
      { id: "wind_essence", chance: 0.20 }
    ]
  },

  fire: {
    extraItems: [
      { id: "ember_fragment", chance: 0.20 }
    ]
  },

  void: {
    extraItems: [
      { id: "void_fragment", chance: 0.15 }
    ]
  },

  beast: {
    extraItems: [
      { id: "beast_fang", chance: 0.25 }
    ]
  }
};

// -----------------------------
// EXPORT
// -----------------------------
export const enemyLootConfig = {
  variants,
  tags
};

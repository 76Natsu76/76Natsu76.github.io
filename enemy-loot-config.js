// enemy-loot-config.js
// Unified variant + tag loot configuration

import { ENEMY_VARIANTS } from "./enemy-variants.js";

const variants = {};
for (const key in ENEMY_VARIANTS) {
  const v = ENEMY_VARIANTS[key];
  variants[key.toLowerCase()] = {
    goldMultiplier: v.lootMult || 1,
    extraItems: v.extraLoot || []
  };
}

const tags = {
  elemental: {
    extraItems: [{ id: "elemental_core", chance: 0.10 }]
  },
  undead: {
    extraItems: [{ id: "bone_fragment", chance: 0.50 }]
  },
  wind: {
    extraItems: [{ id: "wind_essence", chance: 0.20 }]
  }
};

export const enemyLootConfig = { variants, tags };

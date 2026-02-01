// profession-loot.js
// Adapter layer that extracts loot from PROFESSION_DEFINITIONS.
// This keeps profession loot centralized and future-proof.

import { PROFESSION_DEFINITIONS } from "./profession-definitions.js";

export const professionLoot = {};

for (const key in PROFESSION_DEFINITIONS) {
  const def = PROFESSION_DEFINITIONS[key];
  const lower = key.toLowerCase();

  // Normalize lootKit structure
  const kit = def.lootKit || {};

  professionLoot[lower] = {
    weapons: kit.weapons || [],
    armor: kit.armor || [],
    consumables: kit.consumables || [],
    misc: kit.misc || [],
    table: def.lootTable || {}
  };
}

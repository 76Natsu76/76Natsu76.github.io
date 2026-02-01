// profession-loot.js
// Adapter layer that extracts loot from PROFESSION_DEFINITIONS

import { PROFESSION_DEFINITIONS } from "./profession-definitions.js";

export const professionLoot = {};

for (const key in PROFESSION_DEFINITIONS) {
  const def = PROFESSION_DEFINITIONS[key];
  if (!def.lootKit && !def.lootTable) continue;

  professionLoot[key.toLowerCase()] = {
    weapons: def.lootKit?.weapons || [],
    armor: def.lootKit?.armor || [],
    consumables: def.lootKit?.consumables || [],
    misc: def.lootKit?.misc || [],
    table: def.lootTable || {}
  };
}

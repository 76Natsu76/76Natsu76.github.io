// expand-region-enemies.js

import { ENEMY_GROUP_RULES } from "./enemy_group_rules.js";
import { ENEMY_REGIONS } from "./enemy-regions.js";
import { ENEMIES } from "./enemies.js";

export function expandRegionEnemies() {
  const expanded = {};

  // Pre-index enemies by family for fast lookup
  const enemiesByFamily = {};
  for (const key in ENEMIES) {
    const fam = ENEMIES[key].family;
    if (!fam) continue;
    if (!enemiesByFamily[fam]) enemiesByFamily[fam] = [];
    enemiesByFamily[fam].push(key);
  }

  for (const region in ENEMY_REGIONS) {
    const explicit = new Set(ENEMY_REGIONS[region]);
    const rules = ENEMY_GROUP_RULES[region];

    if (rules) {
      const allFamilies = [
        ...(rules.basic || []),
        ...(rules.elite || []),
        ...(rules.boss || [])
      ];

      for (const fam of allFamilies) {
        const list = enemiesByFamily[fam];
        if (!list) continue;
        for (const enemyKey of list) {
          explicit.add(enemyKey);
        }
      }
    }

    expanded[region] = Array.from(explicit);
  }

  return expanded;
}

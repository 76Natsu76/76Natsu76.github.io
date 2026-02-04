// expand-region-enemies.js

import { ENEMY_GROUP_RULES } from "./enemy-group-rules.js";
import { ENEMY_REGIONS } from "./enemy-regions.js";
import { ENEMIES } from "./enemies.js";
import { FAMILY_TIERS } from "./family-tiers.js";
import { REGION_TIERS } from "./region-tiers.js";


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
          const enemy = ENEMIES[enemyKey];
          if (!enemy) continue;
      
          const famTier = FAMILY_TIERS[enemy.family] || 1;
          const regionTier = REGION_TIERS[region] || 1;
      
          if (famTier > regionTier) continue; // ⭐ TIER GATE
      
          explicit.add(enemyKey);
        }
      }
    }

    expanded[region] = Array.from(explicit);
  }

  return expanded;
}

export const EXPANDED_ENEMY_REGIONS = expandRegionEnemies();

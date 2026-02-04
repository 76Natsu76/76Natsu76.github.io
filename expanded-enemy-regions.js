// expanded-enemy-regions.js
import { ENEMY_GROUP_RULES } from "./enemy-group-rules.js";
import { ENEMY_REGIONS } from "./enemy-regions.js";
import { ENEMIES } from "./enemies.js";

import { FAMILY_TIERS } from "./family-tiers.js";
import { REGION_TIERS } from "./region-tiers.js";
import { TIERED_MATRIX } from "./tiered-matrix.js";

export function expandRegionEnemies() {
  const expanded = {};

  // Pre-index enemies by family
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
    const regionTier = REGION_TIERS[region] || 1;

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
          const entry = TIERED_MATRIX[enemyKey];
          if (!entry) continue;

          const familyTier = entry.familyTier;
          const maxRegionTier = entry.maxRegionTier;

          // ⭐ TIER GATES
          if (familyTier > regionTier) continue;
          if (maxRegionTier > regionTier) continue;

          explicit.add(enemyKey);
        }
      }
    }

    expanded[region] = Array.from(explicit);
  }

  return expanded;
}

export const EXPANDED_ENEMY_REGIONS = expandRegionEnemies();

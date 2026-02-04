// ENEMY_REGIONS.js
// Auto‑generated inverse mapping from REGION_ENEMIES.js

import { REGION_ENEMIES } from "./region-enemies.js";

export const ENEMY_REGIONS = (() => {
  const map = {};

  for (const [region, enemies] of Object.entries(REGION_ENEMIES)) {
    for (const enemy of enemies) {
      if (!map[enemy]) map[enemy] = [];
      map[enemy].push(region);
    }
  }

  // Sort region lists for consistency
  for (const enemy of Object.keys(map)) {
    map[enemy] = Array.from(new Set(map[enemy])).sort();
  }

  return map;
})();

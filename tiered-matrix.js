// tiered-matrix.js
import { SUBRACE_FAMILY_INDEX } from "./subrace-family-index.js";
import { FAMILY_TIERS } from "./family-tiers.js";
import { REGION_TIERS } from "./region-tiers.js";
import { ENEMIES } from "./enemies.js";


export const TIER_NAMES = {
  1: "Mundane",
  2: "Elite",
  3: "Mythic",
  4: "Titanic",
  5: "Cosmic"
};

// Build enemy → regions map from region → enemies
import { ENEMY_REGIONS as REGION_ENEMIES } from "./enemy-regions.js";

const ENEMY_REGIONS = {};

for (const [region, enemyList] of Object.entries(REGION_ENEMIES)) {
  for (const enemyKey of enemyList) {
    if (!ENEMY_REGIONS[enemyKey]) ENEMY_REGIONS[enemyKey] = [];
    ENEMY_REGIONS[enemyKey].push(region);
  }
}

export const TIERED_MATRIX = {};

for (const enemyKey in ENEMIES) {
  const enemy = ENEMIES[enemyKey];

  // 1. Resolve subrace
  const subrace = enemy.subrace || SUBRACE_FAMILY_INDEX[enemyKey] || null;

  // 2. Resolve family
  const family =
    enemy.family ||
    SUBRACE_FAMILY_INDEX[subrace] ||
    SUBRACE_FAMILY_INDEX[enemyKey] ||
    "unknown";

  // 3. Resolve family tier
  const familyTier = FAMILY_TIERS[family] || 1;

  // 4. Resolve allowed explicit regions
  const allowedRegions = ENEMY_REGIONS[enemyKey] || [];

  // 5. Resolve region tiers
  const allowedRegionTiers = allowedRegions.map(r => REGION_TIERS[r] || 1);

  // 6. Compute max region tier
  const maxRegionTier = allowedRegionTiers.length
    ? Math.max(...allowedRegionTiers)
    : 1;

  // 7. Build entry
  TIERED_MATRIX[enemyKey] = {
    key: enemyKey,
    name: enemy.name,
    subrace,
    family,
    familyTier,
    allowedRegions,
    allowedRegionTiers,
    maxRegionTier,
    tierName: TIER_NAMES[familyTier] || "Unknown"
  };
}

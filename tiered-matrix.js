// tiered-matrix.js
// New hierarchical tier resolver for enemies
// Uses subregion tiers (primary), canonical tiers (fallback), and family tiers.

import { ENEMIES } from "./enemies.js";
import { SUBRACE_FAMILY_INDEX } from "./subrace-family-index.js";
import { FAMILY_TIERS } from "./family-tiers.js";

import { REGION_HIERARCHY } from "./region-hierarchy.js";
import { REGION_CANONICAL_MAP } from "./region-canonical.js";
import { ENEMY_REGIONS } from "./enemy-regions.js"; // enemy → [subregions]

// Tier names (expandable)
export const TIER_NAMES = {
  1: "Mundane",
  2: "Elite",
  3: "Mythic",
  4: "Titanic",
  5: "Cosmic",
  6: "Eternal",
  7: "Transcendent"
};

// Build a lookup for subregion tiers
const SUBREGION_TIERS = {};
for (const [canonical, def] of Object.entries(REGION_HIERARCHY)) {
  for (const [subregion, subdef] of Object.entries(def.subregions)) {
    SUBREGION_TIERS[subregion] = subdef.tier;
  }
}

// Build a lookup for canonical region tiers
const CANONICAL_TIERS = {};
for (const [canonical, def] of Object.entries(REGION_HIERARCHY)) {
  CANONICAL_TIERS[canonical] = def.tier;
}

// Helper: resolve region tier for a subregion
function resolveRegionTier(regionKey) {
  // 1. Subregion tier (primary)
  if (SUBREGION_TIERS[regionKey]) return SUBREGION_TIERS[regionKey];

  // 2. Canonical region tier (fallback)
  const canonical = REGION_CANONICAL_MAP[regionKey];
  if (canonical && CANONICAL_TIERS[canonical]) {
    return CANONICAL_TIERS[canonical];
  }

  // 3. Unknown region → Tier 1 fallback
  return 1;
}

// Main matrix
export const TIERED_MATRIX = {};

for (const enemyKey of Object.keys(ENEMIES)) {
  const enemy = ENEMIES[enemyKey];

  // 1. Resolve subrace
  const subrace =
    enemy.subrace ||
    SUBRACE_FAMILY_INDEX[enemyKey] ||
    null;

  // 2. Resolve family
  const family =
    enemy.family ||
    SUBRACE_FAMILY_INDEX[subrace] ||
    SUBRACE_FAMILY_INDEX[enemyKey] ||
    "unknown";

  // 3. Resolve family tier
  const familyTier = FAMILY_TIERS[family] || 1;

  // 4. Resolve allowed subregions
  const allowedRegions = ENEMY_REGIONS[enemyKey] || [];

  // 5. Resolve region tiers
  const allowedRegionTiers = allowedRegions.map(resolveRegionTier);

  // 6. Compute max region tier
  const maxRegionTier = allowedRegionTiers.length
    ? Math.max(...allowedRegionTiers)
    : 1;

  // 7. Final enemy tier = max(familyTier, regionTier)
  const finalTier = Math.max(familyTier, maxRegionTier);

  // 8. Build entry
  TIERED_MATRIX[enemyKey] = {
    key: enemyKey,
    name: enemy.name,
    subrace,
    family,
    familyTier,
    allowedRegions,
    allowedRegionTiers,
    maxRegionTier,
    finalTier,
    tierName: TIER_NAMES[finalTier] || "Unknown"
  };
}

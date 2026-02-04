// REGION_ENEMIES.js
// New hierarchical region → enemy mapping
// Built from legacy ENEMY_REGIONS + REGION_HIERARCHY + REGION_CANONICAL_MAP
// This is intentionally data‑driven so you can refine distribution rules over time.

import { REGION_HIERARCHY } from "./region-hierarchy.js";
import { REGION_CANONICAL_MAP } from "./region-canonical.js";
import { ENEMY_REGIONS as LEGACY_ENEMY_REGIONS } from "./enemy-regions-legacy.js";

/**
 * Utility: detect if a key is a canonical region.
 */
const CANONICAL_REGIONS = new Set(Object.keys(REGION_HIERARCHY));

/**
 * Utility: detect if a key is a known subregion.
 */
const SUBREGIONS = new Set(Object.keys(REGION_CANONICAL_MAP));

/**
 * Build a new subregion‑based region→enemy map from the legacy canonical map.
 *
 * Rules (A + C hybrid, as agreed):
 * 1. If the legacy key is a subregion:
 *    - Assign its enemies directly to that subregion.
 * 2. If the legacy key is a canonical region:
 *    - Distribute its enemies to all subregions of that canonical region (baseline).
 *    - If the canonical region has no subregions, keep them at canonical level.
 * 3. If the legacy key is neither canonical nor subregion:
 *    - Try to resolve via REGION_CANONICAL_MAP (if it’s an alias).
 *    - If still unresolved, keep as a “fallback” canonical bucket under that key.
 *
 * You can later refine distribution by:
 *  - adding per‑enemy metadata (family, biome, tier)
 *  - adding per‑subregion filters
 *  - or overriding specific subregion lists.
 */
function buildRegionEnemies(legacyMap, hierarchy, canonicalMap) {
  const regionEnemies = {};

  // Initialize all subregions and canonical regions with empty arrays
  for (const [canonical, def] of Object.entries(hierarchy)) {
    // canonical bucket (optional, used as fallback / summary)
    if (!regionEnemies[canonical]) regionEnemies[canonical] = new Set();

    // subregions
    for (const subKey of Object.keys(def.subregions || {})) {
      if (!regionEnemies[subKey]) regionEnemies[subKey] = new Set();
    }
  }

  // Pass 1: process legacy keys
  for (const [legacyRegionKey, enemies] of Object.entries(legacyMap)) {
    const enemyList = Array.from(new Set(enemies)); // dedupe

    // Case 1: legacy key is a known subregion
    if (SUBREGIONS.has(legacyRegionKey)) {
      const subKey = legacyRegionKey;
      if (!regionEnemies[subKey]) regionEnemies[subKey] = new Set();
      for (const e of enemyList) {
        regionEnemies[subKey].add(e);
      }
      continue;
    }

    // Case 2: legacy key is a canonical region
    if (CANONICAL_REGIONS.has(legacyRegionKey)) {
      const canonical = legacyRegionKey;
      const def = hierarchy[canonical];
      const subregionKeys = Object.keys(def.subregions || {});

      if (subregionKeys.length === 0) {
        // No subregions yet → keep at canonical level
        for (const e of enemyList) {
          regionEnemies[canonical].add(e);
        }
      } else {
        // Distribute to all subregions (baseline coverage)
        for (const subKey of subregionKeys) {
          if (!regionEnemies[subKey]) regionEnemies[subKey] = new Set();
          for (const e of enemyList) {
            regionEnemies[subKey].add(e);
          }
        }
      }
      continue;
    }

    // Case 3: legacy key is neither canonical nor subregion
    // Try to resolve via canonical map (alias → canonical)
    const maybeCanonical = canonicalMap[legacyRegionKey];
    if (maybeCanonical && CANONICAL_REGIONS.has(maybeCanonical)) {
      const canonical = maybeCanonical;
      const def = hierarchy[canonical];
      const subregionKeys = Object.keys(def.subregions || {});

      if (subregionKeys.length === 0) {
        if (!regionEnemies[canonical]) regionEnemies[canonical] = new Set();
        for (const e of enemyList) {
          regionEnemies[canonical].add(e);
        }
      } else {
        for (const subKey of subregionKeys) {
          if (!regionEnemies[subKey]) regionEnemies[subKey] = new Set();
          for (const e of enemyList) {
            regionEnemies[subKey].add(e);
          }
        }
      }
      continue;
    }

    // Case 4: completely unknown region key → keep as its own bucket
    // This is your “doesn’t make sense yet, but don’t lose data” path.
    if (!regionEnemies[legacyRegionKey]) regionEnemies[legacyRegionKey] = new Set();
    for (const e of enemyList) {
      regionEnemies[legacyRegionKey].add(e);
    }
  }

  // Convert all Sets to arrays for export
  const finalized = {};
  for (const [regionKey, enemySet] of Object.entries(regionEnemies)) {
    finalized[regionKey] = Array.from(enemySet);
  }

  return finalized;
}

// Build the new map once at module load.
export const REGION_ENEMIES = buildRegionEnemies(
  LEGACY_ENEMY_REGIONS,
  REGION_HIERARCHY,
  REGION_CANONICAL_MAP
);

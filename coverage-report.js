/* coverage-report.js
   Run this AFTER EnemyRegistry.loadAll()
   Example:
      await EnemyRegistry.loadAll();
      generateCoverageReport();
*/

import { EnemyRegistry } from "./enemy-registry.js";
import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";

export function generateCoverageReport() {
  console.log("=== ENEMY COVERAGE REPORT ===");

  const enemies = EnemyRegistry.enemies;
  const regionMap = EnemyRegistry.regionMap;

  // Collect all families and rarities used in biomes/regions
  const allFamilies = new Set();
  const allRarities = new Set();

  // Extract biome encounter families
  for (const biomeKey in BIOMES) {
    const biome = BIOMES[biomeKey];
    if (biome.encounterWeights) {
      for (const fam in biome.encounterWeights) {
        allFamilies.add(fam);
      }
    }
  }

  // Extract region rarity weights
  for (const regionKey in WORLD_DATA.regions) {
    const region = WORLD_DATA.regions[regionKey];
    if (region.rarityWeights) {
      region.rarityWeights.forEach(r => allRarities.add(r.id));
    }
  }

  // Build lookup tables
  const enemiesByFamily = {};
  const enemiesByRarity = {};
  const enemiesByRegion = {};

  enemies.forEach(e => {
    if (!enemiesByFamily[e.family]) enemiesByFamily[e.family] = [];
    enemiesByFamily[e.family].push(e);

    if (!enemiesByRarity[e.rarity]) enemiesByRarity[e.rarity] = [];
    enemiesByRarity[e.rarity].push(e);

    const allowedRegions = regionMap[e.key] || [];
    allowedRegions.forEach(r => {
      if (!enemiesByRegion[r]) enemiesByRegion[r] = [];
      enemiesByRegion[r].push(e);
    });
  });

  const missing = [];

  // Scan every region
  for (const regionKey in WORLD_DATA.regions) {
    const region = WORLD_DATA.regions[regionKey];
    const biomeKey = region.biome;
    const biome = BIOMES[biomeKey];

    if (!biome) continue;

    const biomeFamilies = Object.keys(biome.encounterWeights || {});
    const regionRarities = region.rarityWeights.map(r => r.id);

    biomeFamilies.forEach(family => {
      regionRarities.forEach(rarity => {
        const pool = enemies.filter(e =>
          (regionMap[e.key] || []).includes(regionKey) &&
          e.family === family &&
          e.rarity === rarity
        );

        if (pool.length === 0) {
          missing.push({
            region: regionKey,
            biome: biomeKey,
            family,
            rarity
          });
        }
      });
    });
  }

  if (missing.length === 0) {
    console.log("All combinations covered. No missing enemies.");
    return;
  }

  console.log("=== MISSING ENEMY COMBINATIONS ===");
  missing.forEach(m => {
    console.log(
      `Region: ${m.region.padEnd(15)} | Biome: ${m.biome.padEnd(15)} | Family: ${m.family.padEnd(12)} | Rarity: ${m.rarity}`
    );
  });

  console.log(`\nTotal missing combinations: ${missing.length}`);
  console.log("====================================");

  return missing;
}

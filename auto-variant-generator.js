/* auto-variant-generator.js
   Requires:
     - EnemyRegistry.loadAll()
     - generateCoverageReport()
*/

import { EnemyRegistry } from "./enemy-registry.js";
import { generateCoverageReport } from "./coverage-report.js";

export async function autoGenerateMissingEnemies() {
  await EnemyRegistry.loadAll();

  const missing = generateCoverageReport();
  if (!missing || missing.length === 0) {
    console.log("No missing combinations. Nothing to generate.");
    return;
  }

  const newEnemies = [];

  for (const m of missing) {
    const { region, family, rarity } = m;

    // Find a base enemy of this family to clone
    const base = EnemyRegistry.enemies.find(e => e.family === family);
    if (!base) {
      console.warn(`No base enemy found for family=${family}. Skipping.`);
      continue;
    }

    // Build a new key
    const key = `${family}_${rarity}_${region}`.replace(/\s+/g, "_");

    const newEnemy = {
      key,
      name: `${rarity} ${family} (${region})`,
      family,
      rarity,
      element: base.element || "neutral",

      // Base stats scaled by rarity
      baseHP: Math.round((base.baseHP ?? 50) * rarityScale(rarity)),
      baseATK: Math.round((base.baseATK ?? 5) * rarityScale(rarity)),
      baseDEF: Math.round((base.baseDEF ?? 2) * rarityScale(rarity)),

      // Copy tags/abilities/behavior from base
      tags: base.tags || [],
      abilities: base.abilities || [],
      ultimate: base.ultimate || null,

      // Region placement
      region: [region],

      // Flavor
      flavor: base.flavor || `${family} adapted to ${region}`
    };

    newEnemies.push(newEnemy);
  }

  console.log("=== AUTO-GENERATED ENEMIES ===");
  console.log(JSON.stringify(newEnemies, null, 2));

  return newEnemies;
}

function rarityScale(rarity) {
  switch (rarity.toLowerCase()) {
    case "common": return 1.0;
    case "uncommon": return 1.15;
    case "rare": return 1.35;
    case "epic": return 1.6;
    case "elite": return 1.9;
    case "mythical": return 2.3;
    case "legendary": return 2.8;
    case "ancient": return 3.4;
    default: return 1.0;
  }
}

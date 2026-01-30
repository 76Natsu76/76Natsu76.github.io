// auto-variant-generator.js — Hybrid Tier Variant Generator

import { EnemyRegistry } from "./enemyRegistry.js";

(async function generateVariants() {
  await EnemyRegistry.loadAll();

  const families = EnemyRegistry.families;

  // ---------------------------------------------------------
  // 1. Only Tier 1–2 families get variants
  // ---------------------------------------------------------
  const tier12Families = Object.values(families)
    .filter(f => f.tier === 1 || f.tier === 2)
    .map(f => f.key);

  console.log("Generating variants for Tier 1–2 families:");
  console.log(tier12Families.join(", "));
  console.log("");

  // ---------------------------------------------------------
  // 2. Rarity scaling rules
  // ---------------------------------------------------------
  const rarityScaling = {
    "uncommon": { hpMult: 1.10, atkMult: 1.10, defMult: 1.05 },
    "rare":     { hpMult: 1.20, atkMult: 1.20, defMult: 1.10 },
    "elite":    { hpMult: 1.35, atkMult: 1.30, defMult: 1.20 },
    "mythical": { hpMult: 1.55, atkMult: 1.45, defMult: 1.30 },
    "boss":     { hpMult: 1.80, atkMult: 1.60, defMult: 1.40 },
    "final":    { hpMult: 2.20, atkMult: 1.90, defMult: 1.60 }
  };

  // ---------------------------------------------------------
  // 3. Generate variants for each family
  // ---------------------------------------------------------
  const generated = {};

  for (const famKey of tier12Families) {
    const family = families[famKey];

    for (const rarity of Object.keys(rarityScaling)) {
      const scale = rarityScaling[rarity];

      const variantKey = `${famKey}_${rarity}`;
      generated[variantKey] = {
        key: variantKey,
        family: famKey,
        rarity,
        flavor: `${rarity} variant of the ${famKey} family.`,
        combatModifiers: {
          hpMult: scale.hpMult,
          atkMult: scale.atkMult,
          defMult: scale.defMult
        },
        elementAffinity: {},
        tags: [],
        abilities: [],
        ultimate: null
      };
    }
  }

  // ---------------------------------------------------------
  // 4. Output JSON
  // ---------------------------------------------------------
  console.log("=== AUTO-GENERATED VARIANTS JSON ===");
  console.log(JSON.stringify(generated, null, 2));
})();

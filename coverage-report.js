// coverage-report.js — Hybrid Tier Coverage Checker

import { EnemyRegistry } from "./enemyRegistry.js";

(async function runCoverageReport() {
  await EnemyRegistry.loadAll();

  const families = EnemyRegistry.families;
  const enemies = EnemyRegistry.enemies;
  const regionMap = EnemyRegistry.regionMap;

  // ---------------------------------------------
  // 1. Identify Tier 1–2 families (combinatorial)
  // ---------------------------------------------
  const tier12Families = Object.values(families)
    .filter(f => f.tier === 1 || f.tier === 2)
    .map(f => f.key);

  console.log("=== Tier 1–2 Families (Checked for Coverage) ===");
  console.log(tier12Families.join(", "));
  console.log("");

  // ---------------------------------------------
  // 2. Build lookup: family → enemies
  // ---------------------------------------------
  const familyBuckets = {};
  for (const fam of tier12Families) {
    familyBuckets[fam] = [];
  }

  for (const e of enemies) {
    const fam = e.family;
    if (familyBuckets[fam]) {
      familyBuckets[fam].push(e);
    }
  }

  // ---------------------------------------------
  // 3. Check missing base enemies per family
  // ---------------------------------------------
  console.log("=== Missing Base Enemies (Tier 1–2) ===");
  for (const fam of tier12Families) {
    if (familyBuckets[fam].length === 0) {
      console.log(`❌ Family '${fam}' has NO base enemies`);
    }
  }
  console.log("");

  // ---------------------------------------------
  // 4. Check rarity coverage per family
  // ---------------------------------------------
  const rarities = ["common", "uncommon", "rare", "elite", "mythical", "boss", "final"];

  console.log("=== Missing Rarity Coverage (Tier 1–2 Families) ===");

  for (const fam of tier12Families) {
    const famEnemies = familyBuckets[fam];
    const found = new Set(famEnemies.map(e => e.rarity));

    const missing = rarities.filter(r => !found.has(r));
    if (missing.length > 0) {
      console.log(`⚠ Family '${fam}' missing rarities: ${missing.join(", ")}`);
    }
  }
  console.log("");

  // ---------------------------------------------
  // 5. Region × Family coverage
  // ---------------------------------------------
  console.log("=== Region × Family Coverage (Tier 1–2) ===");

  const regionFamilies = {};

  for (const [enemyKey, region] of Object.entries(regionMap)) {
    const enemy = enemies.find(e => e.key === enemyKey);
    if (!enemy) continue;

    const fam = enemy.family;
    if (!tier12Families.includes(fam)) continue;

    if (!regionFamilies[region]) regionFamilies[region] = new Set();
    regionFamilies[region].add(fam);
  }

  for (const region of Object.keys(regionFamilies)) {
    const present = Array.from(regionFamilies[region]);
    const missing = tier12Families.filter(f => !present.includes(f));

    if (missing.length > 0) {
      console.log(`⚠ Region '${region}' missing families: ${missing.join(", ")}`);
    }
  }
  console.log("");

  // ---------------------------------------------
  // 6. Variant coverage
  // ---------------------------------------------
  console.log("=== Variant Coverage (Tier 1–2 Families) ===");

  for (const fam of tier12Families) {
    const famEnemies = familyBuckets[fam];
    const variants = famEnemies.filter(e => e.variant);

    if (variants.length === 0) {
      console.log(`⚠ Family '${fam}' has NO variants`);
    }
  }

  console.log("\n=== Coverage Report Complete ===");
})();

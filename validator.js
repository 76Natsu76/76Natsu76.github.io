// validator.js — Final Hybrid Validator (Matches Your Actual Files)

import { EnemyRegistry } from "./enemyRegistry.js";

(async function validate() {
  await EnemyRegistry.loadAll();

  const families = EnemyRegistry.families;
  const variants = EnemyRegistry.variants;
  const enemies = EnemyRegistry.enemies;
  const tags = EnemyRegistry.tags;
  const abilities = EnemyRegistry.abilities;
  const ultimates = EnemyRegistry.ultimates;

  const subraceMap = EnemyRegistry.subraceMap; // enemy-subrace.json (objects)
  const subraceFamilyIndex = await fetchJSON("./subrace-family-index.json");
  const regionMap = EnemyRegistry.regionMap;

  console.log("=== VALIDATION REPORT ===\n");

  // ---------------------------------------------------------
  // 1. Validate Families
  // ---------------------------------------------------------
  console.log("=== FAMILY VALIDATION ===");

  for (const [key, fam] of Object.entries(families)) {
    if (!fam.tier) {
      console.log(`❌ Family '${key}' missing tier`);
    }

    // Tier 1–2 must have full templates
    if (fam.tier === 1 || fam.tier === 2) {
      if (fam.baseHP == null) console.log(`❌ Tier 1–2 family '${key}' missing baseHP`);
      if (fam.baseATK == null) console.log(`❌ Tier 1–2 family '${key}' missing baseATK`);
      if (fam.baseDEF == null) console.log(`❌ Tier 1–2 family '${key}' missing baseDEF`);
      if (!fam.behavior) console.log(`❌ Tier 1–2 family '${key}' missing behavior`);
    }
  }

  console.log("");

  // ---------------------------------------------------------
  // 2. Validate Subrace → Family Mapping
  // ---------------------------------------------------------
  console.log("=== SUBRACE → FAMILY VALIDATION ===");

  for (const [subrace, fam] of Object.entries(subraceFamilyIndex)) {
    if (!families[fam]) {
      console.log(`❌ Subrace '${subrace}' maps to missing family '${fam}'`);
    }
  }

  console.log("");

  // ---------------------------------------------------------
  // 3. Validate enemy-subrace.json entries
  // ---------------------------------------------------------
  console.log("=== ENEMY-SUBRACE.JSON VALIDATION ===");

  for (const [enemyKey, entry] of Object.entries(subraceMap)) {
    if (!entry.subrace) {
      console.log(`❌ Enemy '${enemyKey}' missing 'subrace' field in enemy-subrace.json`);
      continue;
    }

    const subrace = entry.subrace;

    if (!subraceFamilyIndex[subrace] && !families[subrace]) {
      console.log(`❌ Enemy '${enemyKey}' references unknown subrace '${subrace}'`);
    }
  }

  console.log("");

  // ---------------------------------------------------------
  // 4. Validate Variants
  // ---------------------------------------------------------
  console.log("=== VARIANT VALIDATION ===");

  for (const [key, variant] of Object.entries(variants)) {
    if (!variant.family) {
      console.log(`❌ Variant '${key}' missing family`);
      continue;
    }

    if (!families[variant.family]) {
      console.log(`❌ Variant '${key}' references missing family '${variant.family}'`);
    }

    if (!variant.rarity) {
      console.log(`❌ Variant '${key}' missing rarity`);
    }

    if (!variant.combatModifiers) {
      console.log(`❌ Variant '${key}' missing combatModifiers`);
    }
  }

  console.log("");

  // ---------------------------------------------------------
  // 5. Validate Enemies
  // ---------------------------------------------------------
  console.log("=== ENEMY VALIDATION ===");

  for (const enemy of enemies) {
    const key = enemy.key;

    // Required fields
    if (!enemy.name) console.log(`❌ Enemy '${key}' missing name`);
    if (!enemy.rarity) console.log(`❌ Enemy '${key}' missing rarity`);
    if (enemy.level == null) console.log(`❌ Enemy '${key}' missing level`);

    // Family
    if (!enemy.family) {
      console.log(`❌ Enemy '${key}' missing family`);
    } else if (!families[enemy.family]) {
      console.log(`❌ Enemy '${key}' references missing family '${enemy.family}'`);
    }

    // Subrace
    const subraceEntry = subraceMap[key];
    if (!subraceEntry) {
      console.log(`⚠ Enemy '${key}' missing subrace entry in enemy-subrace.json`);
    } else {
      const subrace = subraceEntry.subrace;
      if (!subraceFamilyIndex[subrace] && !families[subrace]) {
        console.log(`❌ Enemy '${key}' references unknown subrace '${subrace}'`);
      }
    }

    // Variant
    if (enemy.variant && !variants[enemy.variant]) {
      console.log(`❌ Enemy '${key}' references missing variant '${enemy.variant}'`);
    }

    // Region
    if (!regionMap[key]) {
      console.log(`❌ Enemy '${key}' missing region assignment`);
    }

    // Abilities
    if (enemy.abilities) {
      for (const a of enemy.abilities) {
        if (!abilities[a]) {
          console.log(`❌ Enemy '${key}' references missing ability '${a}'`);
        }
      }
    }

    // Tags
    if (enemy.tags) {
      for (const t of enemy.tags) {
        if (!tags[t]) {
          console.log(`❌ Enemy '${key}' references missing tag '${t}'`);
        }
      }
    }

    // Ultimate
    if (enemy.ultimate && !ultimates[enemy.ultimate]) {
      console.log(`❌ Enemy '${key}' references missing ultimate '${enemy.ultimate}'`);
    }
  }

  console.log("\n=== VALIDATION COMPLETE ===");
})();

// Helper
async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load " + path);
  return await res.json();
}

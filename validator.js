// validator.js — Hybrid Family Validator

import { EnemyRegistry } from "./enemyRegistry.js";

(async function validate() {
  await EnemyRegistry.loadAll();

  const families = EnemyRegistry.families;
  const variants = EnemyRegistry.variants;
  const enemies = EnemyRegistry.enemies;
  const tags = EnemyRegistry.tags;
  const abilities = EnemyRegistry.abilities;
  const ultimates = EnemyRegistry.ultimates;
  const subraceMap = EnemyRegistry.subraceMap;
  const raceMap = EnemyRegistry.raceMap;
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

    // Tier 3–7 minimal families are allowed to have null stats
  }

  console.log("");

  // ---------------------------------------------------------
  // 2. Validate Subrace → Family Mapping
  // ---------------------------------------------------------
  console.log("=== SUBRACE → FAMILY VALIDATION ===");

  for (const [subrace, fam] of Object.entries(subraceMap)) {
    if (!families[fam]) {
      console.log(`❌ Subrace '${subrace}' maps to missing family '${fam}'`);
    }
  }

  console.log("");

  // ---------------------------------------------------------
  // 3. Validate Race → Family Mapping
  // ---------------------------------------------------------
  console.log("=== RACE → FAMILY VALIDATION ===");

  for (const [race, fam] of Object.entries(raceMap)) {
    if (!families[fam]) {
      console.log(`❌ Race '${race}' maps to missing family '${fam}'`);
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

    // --- Required fields ---
    if (!enemy.name) console.log(`❌ Enemy '${key}' missing name`);
    if (!enemy.rarity) console.log(`❌ Enemy '${key}' missing rarity`);
    if (enemy.level == null) console.log(`❌ Enemy '${key}' missing level`);

    // --- Family ---
    const fam = enemy.family;
    if (!fam) {
      console.log(`❌ Enemy '${key}' missing family`);
    } else if (!families[fam]) {
      console.log(`❌ Enemy '${key}' references missing family '${fam}'`);
    }

    // --- Subrace ---
    const subrace = enemy.subrace || subraceMap[key];
    if (subrace && !subraceMap[subrace] && !families[subrace]) {
      console.log(`❌ Enemy '${key}' references missing subrace '${subrace}'`);
    }

    // --- Race ---
    const race = enemy.race || raceMap[key];
    if (race && !raceMap[race] && !families[race]) {
      console.log(`❌ Enemy '${key}' references missing race '${race}'`);
    }

    // --- Variant ---
    if (enemy.variant && !variants[enemy.variant]) {
      console.log(`❌ Enemy '${key}' references missing variant '${enemy.variant}'`);
    }

    // --- Region ---
    if (!regionMap[key]) {
      console.log(`⚠ Enemy '${key}' missing region assignment`);
    }

    // --- Abilities ---
    if (enemy.abilities) {
      for (const a of enemy.abilities) {
        if (!abilities[a]) {
          console.log(`❌ Enemy '${key}' references missing ability '${a}'`);
        }
      }
    }

    // --- Tags ---
    if (enemy.tags) {
      for (const t of enemy.tags) {
        if (!tags[t]) {
          console.log(`❌ Enemy '${key}' references missing tag '${t}'`);
        }
      }
    }

    // --- Ultimate ---
    if (enemy.ultimate && !ultimates[enemy.ultimate]) {
      console.log(`❌ Enemy '${key}' references missing ultimate '${enemy.ultimate}'`);
    }
  }

  console.log("\n=== VALIDATION COMPLETE ===");
})();

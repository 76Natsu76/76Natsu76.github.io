// enemyRegistry.js — HYBRID FAMILY VERSION (JS module)

import { ENEMY_FAMILIES } from "./enemy-families.js";
import { ENEMY_VARIANTS } from "./enemy-variants.js";
import { ENEMY_TAGS } from "./enemy-tags.js";
import { ENEMY_BEHAVIORS } from "./enemy-behaviors.js";
import { ENEMY_ABILITIES } from "./enemy-abilities.js";
import { ENEMY_ULTIMATES } from "./enemy-ultimates.js";

import { ENEMIES } from "./enemies.js"; // array
import { ENEMY_REGIONS } from "./enemy-regions.js";
import { SUBRACE_FAMILY_INDEX } from "./subrace-family-index.js";
import { RACE_FAMILY_INDEX } from "./race-family-index.js";

export const EnemyRegistry = {
  families: ENEMY_FAMILIES,
  variants: ENEMY_VARIANTS,
  tags: ENEMY_TAGS,
  behaviors: ENEMY_BEHAVIORS,
  abilities: ENEMY_ABILITIES,
  ultimates: ENEMY_ULTIMATES,

  enemies: Object.values(ENEMIES),
  regionMap: ENEMY_REGIONS,
  subraceMap: SUBRACE_FAMILY_INDEX,
  raceMap: RACE_FAMILY_INDEX,

  // No async loading needed anymore
  loadAll() {
    return true;
  },

  getEnemy(key) {
    const normalized = key.toLowerCase().replace(/[\s-]/g, "_");
    return this.enemies.find(e => e.key === normalized) || null;
  },

  // ---------------------------------------------------------
  // FAMILY RESOLUTION (Hybrid Tier System)
  // ---------------------------------------------------------
  resolveFamily(raw) {
    // 1. Direct family on enemy
    if (raw.family && this.families[raw.family]) {
      return this.families[raw.family];
    }

    // 2. Subrace → family mapping
    const subrace = raw.subrace || this.subraceMap[raw.key];
    if (subrace && this.families[subrace]) {
      return this.families[subrace];
    }

    // 3. Race → family mapping
    const race = raw.race || this.raceMap[raw.key];
    if (race && this.families[race]) {
      return this.families[race];
    }

    throw new Error(`No valid family found for enemy '${raw.key}'`);
  },

  // ---------------------------------------------------------
  // BASE STAT RESOLUTION
  // ---------------------------------------------------------
  resolveBaseStat(rawValue, familyValue, defaultValue = 0) {
    if (rawValue != null) return rawValue;
    if (familyValue != null) return familyValue;
    return defaultValue;
  },

  // ---------------------------------------------------------
  // BUILD ENEMY TEMPLATE
  // ---------------------------------------------------------
  buildEnemyTemplate(key) {
    console.log("buildEnemyTemplate in enemy-registry received key =", key);
    const raw = this.getEnemy(key);
    if (!raw) throw new Error("Unknown enemy: " + key);

    // --- FAMILY ---
    const family = this.resolveFamily(raw);

    // --- VARIANT ---
    const variant = raw.variant ? this.variants[raw.variant] : null;

    // --- FAMILY + VARIANT MODIFIERS ---
    const famMod = family.familyModifiers || {};
    const varMod = variant?.combatModifiers || {};

    const hpMult  = (famMod.hpMult  ?? 1) * (varMod.hpMult  ?? 1);
    const atkMult = (famMod.atkMult ?? 1) * (varMod.atkMult ?? 1);
    const defMult = (famMod.defMult ?? 1) * (varMod.defMult ?? 1);

    // --- BASE STATS ---
    const baseHP  = this.resolveBaseStat(raw.baseHP,  family.baseHP,  50) * hpMult;
    const baseATK = this.resolveBaseStat(raw.baseATK, family.baseATK, 5)  * atkMult;
    const baseDEF = this.resolveBaseStat(raw.baseDEF, family.baseDEF, 5)  * defMult;

    // --- ELEMENTAL AFFINITY ---
    const elementAffinity = {
      ...(family.elementAffinity || {}),
      ...(variant?.elementAffinity || {})
    };

    // --- BEHAVIOR ---
    const behaviorKey = variant?.behavior || family.behavior;
    const behavior = this.behaviors[behaviorKey] || null;

    // --- TAGS ---
    const tagKeys = [
      ...(family.tags || []),
      ...(variant?.tags || [])
    ];
    const resolvedTags = tagKeys.map(t => this.tags[t]).filter(Boolean);

    // --- ABILITIES ---
    const abilityKeys = [
      ...(family.abilities || []),
      ...(variant?.abilities || [])
    ];
    const resolvedAbilities = abilityKeys.map(a => this.abilities[a]).filter(Boolean);

    // --- ULTIMATE ---
    const ultimateKey = variant?.ultimate || family.ultimate || null;
    const ultimate = ultimateKey ? this.ultimates[ultimateKey] : null;

    // --- REGION ---
    const region = this.regionMap[raw.key] || null;

    // --- SUBRACE ---
    const subrace = raw.subrace || this.subraceMap[raw.key] || null;

    // --- LOOT / EFFECTS ---
    const lootTable = parseMaybeJSON(raw.lootTableJSON) || raw.lootTable || [];
    const activeEffects = parseMaybeJSON(raw.activeEffectsJSON) || raw.activeEffects || [];

    return {
      key: raw.key,
      name: raw.name,

      family: raw.family || family.key,
      variant: raw.variant || null,
      subrace,

      rarity: raw.rarity,
      element: raw.element,
      level: raw.level,

      baseHP,
      baseATK,
      baseDEF,

      elementAffinity,
      behavior,

      tags: resolvedTags,
      abilities: resolvedAbilities,
      ultimate,

      lootTable,
      activeEffects,

      region,

      flavor: variant?.flavor || family.flavor || ""
    };
  }
};

// ---------------------------------------------------------
// Helper
// ---------------------------------------------------------
function parseMaybeJSON(value) {
  if (!value) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

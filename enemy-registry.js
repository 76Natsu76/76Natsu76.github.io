// enemyRegistry.js — HYBRID FAMILY VERSION (JS module)

import { ENEMY_FAMILIES } from "./enemy-families.js";
import { ENEMY_VARIANTS } from "./enemy-variants.js";
import { ENEMY_TAGS } from "./enemy-tags.js";
import { ENEMY_BEHAVIORS } from "./enemy-behaviors.js";
import { ENEMY_ABILITIES } from "./enemy-abilities.js";
import { ENEMY_ULTIMATES } from "./enemy-ultimates.js";

import { ENEMIES } from "./enemies.js";
import { EXPANDED_ENEMY_REGIONS as ENEMY_REGIONS } from "./expanded-enemy-regions.js";
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

  loadAll() {
    return true;
  },

  getEnemy(key) {
    const normalized = key.toLowerCase().replace(/[\s-]/g, "_");
    return this.enemies.find(e => e.key === normalized) || null;
  },

  resolveFamily(raw) {
    if (raw.family && this.families[raw.family]) {
      return this.families[raw.family];
    }

    const subrace = raw.subrace || this.subraceMap[raw.key];
    if (subrace && this.families[subrace]) {
      return this.families[subrace];
    }

    const race = raw.race || this.raceMap[raw.key];
    if (race && this.families[race]) {
      return this.families[race];
    }

    throw new Error(`No valid family found for enemy '${raw.key}'`);
  },

  resolveBaseStat(rawValue, familyValue, defaultValue = 0) {
    if (rawValue != null) return rawValue;
    if (familyValue != null) return familyValue;
    return defaultValue;
  },

  buildEnemyTemplate(key) {
    const raw = this.getEnemy(key);
    if (!raw) throw new Error("Unknown enemy: " + key);

    const family = this.resolveFamily(raw);
    const variant = raw.variant ? this.variants[raw.variant] : null;

    const famMod = family.familyModifiers || {};
    const varMod = variant?.combatModifiers || {};

    // ⭐ FIXED: NaN-safe multipliers
    const hpMult  = ((famMod.hpMult  ?? 1) * (varMod.hpMult  ?? 1)) || 1;
    const atkMult = ((famMod.atkMult ?? 1) * (varMod.atkMult ?? 1)) || 1;
    const defMult = ((famMod.defMult ?? 1) * (varMod.defMult ?? 1)) || 1;

    const baseHP  = this.resolveBaseStat(raw.baseHP,  family.baseHP,  50) * hpMult;
    const baseATK = this.resolveBaseStat(raw.baseATK, family.baseATK, 5)  * atkMult;
    const baseDEF = this.resolveBaseStat(raw.baseDEF, family.baseDEF, 5)  * defMult;

    const elementAffinity = {
      ...(family.elementAffinity || {}),
      ...(variant?.elementAffinity || {})
    };

    const behaviorKey = variant?.behavior || family.behavior;
    const behavior = this.behaviors[behaviorKey] || null;

    const tagKeys = [
      ...(family.tags || []),
      ...(variant?.tags || [])
    ];
    const resolvedTags = tagKeys.map(t => this.tags[t]).filter(Boolean);

    const abilityKeys = [
      ...(family.abilities || []),
      ...(variant?.abilities || [])
    ];
    const resolvedAbilities = abilityKeys.map(a => this.abilities[a]).filter(Boolean);

    const ultimateKey = variant?.ultimate || family.ultimate || null;
    const ultimate = ultimateKey ? this.ultimates[ultimateKey] : null;

    const region = this.regionMap[raw.key] || null;
    const subrace = raw.subrace || this.subraceMap[raw.key] || null;

    const lootTable = parseMaybeJSON(raw.lootTableJSON) || raw.lootTable || [];
    const activeEffects = parseMaybeJSON(raw.activeEffectsJSON) || raw.activeEffects || [];
    
    return {
      key: raw.key,
      name: raw.name,
    
      family: family.key,   // ← FIXED
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

function parseMaybeJSON(value) {
  if (!value) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

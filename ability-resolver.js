/************************************************************
 * ability-resolver.js — Modern Damage + Ability Resolution
 ************************************************************/

import { ABILITY_DEFINITIONS } from './ability-definitions.js';
import { SUBRACE_ABILITY_DEFINITIONS } from './subrace-ability-definitions.js';

import { applyStatusEffect } from './status-engine.js';
import { scheduleDOT, scheduleHOT } from './dot-hot-engine.js';
import { applyShield, absorbDamageWithShield } from './shield-engine.js';
import { cleanseEffects } from './cleanse-engine.js';
import { worldModifiers } from './world-modifiers.js';
import { talentModifiers } from './talent-modifiers.js';

/************************************************************
 * MAIN ENTRY: castAbility()
 ************************************************************/
export function castAbility(attacker, defender, abilityKey, context, logs) {
  const ability = resolveAbilityObject(attacker, abilityKey);

  if (!ability) {
    logs.push(`ERROR: Ability '${abilityKey}' not found.`);
    return;
  }

  // Cooldown check
  if (attacker.cooldowns?.[abilityKey] > 0) {
    logs.push(`${attacker.name} tries to use ${ability.name}, but it is on cooldown.`);
    return;
  }

  // Mana check
  if (attacker.manaCurrent < (ability.manaCost || 0)) {
    logs.push(`${attacker.name} lacks mana for ${ability.name}.`);
    return;
  }

  attacker.manaCurrent -= ability.manaCost || 0;

  // Hit / Crit + Damage
  const hitData = computeHitData(attacker, defender, ability, context);

  if (!hitData.isHit) {
    logs.push(`${attacker.name}'s ${ability.name || ability.key} misses ${defender.name}.`);
    return;
  }

  const dmg = computeFinalDamage(attacker, defender, ability, hitData, context);

  applyDamage(attacker, defender, ability, dmg, hitData, logs);

  // Lifesteal
  if (ability.combatTags?.includes('lifesteal') && dmg > 0) {
    const heal = Math.floor(dmg * 0.25);
    attacker.hpCurrent = Math.min(attacker.hpMax, attacker.hpCurrent + heal);
    logs.push(`${attacker.name} absorbs ${heal} health through lifesteal.`);
  }

  // Status Effects
  if (ability.statusEffects?.length) {
    for (const effect of ability.statusEffects) {
      if (effect.type === 'shield') {
        applyShield(attacker, effect, logs);
      } else if (effect.type === 'cleanse') {
        cleanseEffects(attacker, effect, logs);
      } else if (isDOT(effect.type)) {
        scheduleDOT(defender, effect, attacker, logs);
      } else if (isHOT(effect.type)) {
        scheduleHOT(attacker, effect, attacker, logs);
      } else {
        applyStatusEffect(defender, effect, attacker, logs);
        logs.push(`${defender.name} is affected by ${effect.type}.`);
      }
    }
  }

  // Cooldown assignment
  if (!attacker.cooldowns) attacker.cooldowns = {};
  attacker.cooldowns[abilityKey] = ability.cooldown || 0;

  logs.push(`${attacker.name} uses ${ability.name} on ${defender.name} for ${dmg} damage.`);
}

/************************************************************
 * Resolve ability object (profession + subrace)
 ************************************************************/
function resolveAbilityObject(attacker, abilityKey) {
  const prof = attacker.profession;
  const subrace = attacker.subrace;

  if (ABILITY_DEFINITIONS[prof]?.[abilityKey]) {
    return ABILITY_DEFINITIONS[prof][abilityKey];
  }

  if (SUBRACE_ABILITY_DEFINITIONS[subrace]?.[abilityKey]) {
    return SUBRACE_ABILITY_DEFINITIONS[subrace][abilityKey];
  }

  return null;
}

/****************************************************
 * HIT / CRIT (modern)
 ****************************************************/
export function computeHitData(attacker, defender, ability, context) {
  // Base hit
  const accuracy = attacker.accuracyMult || 1.0;
  const evade = defender.evadeMult || 1.0;

  let hitChance = 0.95 * accuracy / Math.max(0.1, evade);
  hitChance = Math.max(0.05, Math.min(0.99, hitChance));

  const isHit = Math.random() <= hitChance;

  // Crit
  let critChance = attacker.critChance || 0.05;
  critChance += context?.critBoost || 0;
  critChance = Math.max(0, Math.min(critChance, 0.75)); // cap at 75%

  const isCrit = isHit && Math.random() <= critChance;

  return {
    isHit,
    isCrit,
    damageMult: isCrit ? (attacker.critDamageMult || 1.5) : 1.0
  };
}

/****************************************************
 * BASE DAMAGE CALCULATION
 ****************************************************/
export function calculateBaseDamage(attacker, defender, ability) {
  const atk = attacker.atk || 1;
  const def = defender.def || 0;

  const raw = Math.max(1, atk - def * 0.5);
  const power = ability.basePower || ability.power || 1.0;

  return raw * power;
}

/****************************************************
 * DAMAGE VARIANCE
 ****************************************************/
export function applyVariance(dmg) {
  const variance = 0.9 + Math.random() * 0.2; // ±10%
  return dmg * variance;
}

/****************************************************
 * LEVEL SCALING
 ****************************************************/
export function applyLevelScaling(dmg, attacker, ability) {
  if (!ability.scalingPerLevel) return dmg;
  return dmg + attacker.level * ability.scalingPerLevel;
}

/****************************************************
 * ELEMENTAL MODIFIERS
 ****************************************************/
export function applyElementalModifiers(dmg, attacker, defender) {
  if (typeof ELEMENTAL_CHART === 'undefined') return dmg;

  const atkElem = attacker.element || "normal";
  const defElem = defender.element || "normal";

  const mult = ELEMENTAL_CHART[atkElem]?.[defElem] || 1.0;
  return dmg * mult;
}

/****************************************************
 * WORLD / REGION / WEATHER MODIFIERS
 ****************************************************/
export function applyWorldModifiers(dmg, attacker, defender, ability, context) {
  if (!context?.modifiers || !context.modifiers.modifyDamage) return dmg;
  return context.modifiers.modifyDamage(attacker, defender, ability, dmg);
}

/****************************************************
 * TALENT MODIFIERS
 ****************************************************/
export function applyTalentModifiers(dmg, attacker, ability) {
  if (!attacker.talents) return dmg;
  return talentModifiers.modifyDamage(attacker, ability, dmg);
}

/****************************************************
 * FINAL DAMAGE PIPELINE
 ****************************************************/
export function computeFinalDamage(attacker, defender, ability, hitData, context) {
  let dmg = calculateBaseDamage(attacker, defender, ability);

  dmg = applyVariance(dmg);
  dmg = applyLevelScaling(dmg, attacker, ability);
  dmg = applyElementalModifiers(dmg, attacker, defender);
  dmg = applyWorldModifiers(dmg, attacker, defender, ability, context);
  dmg = applyTalentModifiers(dmg, attacker, ability);

  dmg *= hitData.damageMult;

  return Math.max(1, Math.floor(dmg));
}

/****************************************************
 * SHIELD + DAMAGE APPLICATION
 ****************************************************/
export function applyDamage(attacker, defender, ability, dmg, hitData, logs) {
  let final = dmg;

  final = absorbDamageWithShield(defender, final, logs);

  defender.hpCurrent = Math.max(0, defender.hpCurrent - final);

  if (hitData.isCrit) {
    logs.push("Critical hit!");
  }

  logs.push(`${attacker.name} deals ${final} damage to ${defender.name}.`);

  if (defender.hpCurrent <= 0) {
    logs.push(`${defender.name} is defeated.`);
  }

  return final;
}

/************************************************************
 * Helpers
 ************************************************************/
function isDOT(type) {
  return ['burn', 'poison', 'bleed', 'acid', 'curse'].includes(type);
}

function isHOT(type) {
  return ['hot_percent', 'heal_over_time'].includes(type);
}

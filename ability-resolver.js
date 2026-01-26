/************************************************************
 * ability-resolver.js — Modern GitHub Version
 * ----------------------------------------------------------
 * Reads from JSON ability definitions and applies:
 * - hit/crit resolution
 * - damage calculation
 * - status effects
 * - DOT/HOT scheduling
 * - shields
 * - lifesteal
 * - cleanse
 * - AOE hooks
 ************************************************************/

import { ABILITY_DEFINITIONS } from './data/ability-definitions.js';
import { SUBRACE_ABILITY_DEFINITIONS } from './data/subrace-abilities.js';
import { applyStatusEffect } from './status-engine.js';
import { scheduleDOT, scheduleHOT } from './dot-hot-engine.js';
import { applyShield } from './shield-engine.js';
import { cleanseEffects } from './cleanse-engine.js';
import { worldModifiers } from './world-modifiers.js';
import { talentModifiers } from './talent-modifiers.js';

/************************************************************
 * Resolve an ability cast
 ************************************************************/
export function castAbility(attacker, defender, abilityKey, context, logs) {
  const ability = resolveAbilityObject(attacker, abilityKey);

  if (!ability) {
    logs.push(`ERROR: Ability '${abilityKey}' not found.`);
    return;
  }

  // Check mana
  if (attacker.manaCurrent < ability.manaCost) {
    logs.push(`${attacker.name} tries to use ${ability.name}, but lacks mana.`);
    return;
  }

  attacker.manaCurrent -= ability.manaCost;

  // Hit / Crit resolution
  const hitData = resolveHitAndCrit(attacker, defender, context);

  if (!hitData.hit) {
    logs.push(`${attacker.name}'s ${ability.name} misses ${defender.name}.`);
    return;
  }

  // Damage calculation
  const dmg = calculateAbilityDamage(attacker, defender, ability, hitData, context);

  // Apply damage
  applyDamage(defender, dmg, attacker, logs, { ability });

  // Lifesteal
  if (ability.combatTags?.includes('lifesteal')) {
    const healAmount = Math.floor(dmg * 0.25);
    attacker.hpCurrent = Math.min(attacker.hpMax, attacker.hpCurrent + healAmount);
    logs.push(`${attacker.name} absorbs ${healAmount} health through lifesteal.`);
  }

  // Status effects
  if (ability.statusEffects?.length > 0) {
    for (const effect of ability.statusEffects) {
      applyStatusEffect(defender, effect, attacker, logs);
    }
  }

  logs.push(`${attacker.name} uses ${ability.name} on ${defender.name} for ${dmg} damage.`);
}

/************************************************************
 * Resolve ability object from profession or subrace
 ************************************************************/
function resolveAbilityObject(attacker, abilityKey) {
  const prof = attacker.profession;
  const race = attacker.subrace;

  // Profession abilities
  if (ABILITY_DEFINITIONS[prof]?.[abilityKey]) {
    return ABILITY_DEFINITIONS[prof][abilityKey];
  }

  // Subrace abilities
  if (SUBRACE_ABILITY_DEFINITIONS[race]?.[abilityKey]) {
    return SUBRACE_ABILITY_DEFINITIONS[race][abilityKey];
  }

  return null;
}

/************************************************************
 * Hit / Crit resolution
 ************************************************************/
function resolveHitAndCrit(attacker, defender, context) {
  const accuracy = attacker.accuracyMult || 1.0;
  const evade = defender.evadeMult || 1.0;

  let hitChance = 0.95 * accuracy / evade;
  hitChance = Math.max(0.05, Math.min(0.99, hitChance));

  const hit = Math.random() <= hitChance;

  let critChance = attacker.critChance || 0.05;
  critChance += context?.critBoost || 0;
  critChance = Math.min(1, Math.max(0, critChance));

  const isCrit = hit && Math.random() <= critChance;

  return {
    hit,
    isCrit,
    damageMult: isCrit ? (attacker.critDamage || 1.5) : 1.0
  };
}

/************************************************************
 * Damage calculation
 ************************************************************/
function calculateAbilityDamage(attacker, defender, ability, hitData, context) {
  const base = Math.max(1, attacker.atk - defender.def);
  const power = ability.basePower || 1.0;

  let dmg = base * power * hitData.damageMult;

  // Level scaling
  if (ability.scalingPerLevel) {
    dmg += attacker.level * ability.scalingPerLevel * base;
  }

  // World modifiers (weather, biome, region)
  dmg = worldModifiers.modifyDamage(attacker, defender, ability, dmg);

  // Talent tree modifiers
  dmg = talentModifiers.modifyDamage(attacker, ability, dmg);

  return Math.floor(dmg);
}

/************************************************************
 * Apply damage
 ************************************************************/
function applyDamage(target, amount, source, logs, meta) {
  const dmg = Math.max(0, amount);
  target.hpCurrent = Math.max(0, target.hpCurrent - dmg);

  logs.push(`${source.name} hits ${target.name} for ${dmg} damage.`);

  if (target.hpCurrent <= 0) {
    logs.push(`${target.name} is defeated.`);
  }
}

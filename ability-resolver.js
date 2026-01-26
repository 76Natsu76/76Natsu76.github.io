/************************************************************
 * ability-resolver.js — Fully Implemented Modern Version
 ************************************************************/

import { ABILITY_DEFINITIONS } from './ability-definitions.json';
import { SUBRACE_ABILITY_DEFINITIONS } from './subrace-ability-definitions.json';

import { applyStatusEffect, processStatusesAtTurnStart } from './status-engine.js';
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
  if (attacker.manaCurrent < ability.manaCost) {
    logs.push(`${attacker.name} lacks mana for ${ability.name}.`);
    return;
  }

  attacker.manaCurrent -= ability.manaCost;

  // Hit / Crit
  const hitData = resolveHitAndCrit(attacker, defender, context);
  if (!hitData.hit) {
    logs.push(`${attacker.name}'s ${ability.name} misses ${defender.name}.`);
    return;
  }

  // Damage
  const dmg = calculateAbilityDamage(attacker, defender, ability, hitData, context);

  // Apply damage (with shield absorption)
  applyDamage(defender, dmg, attacker, logs, { ability });

  // Lifesteal
  if (ability.combatTags?.includes('lifesteal')) {
    const heal = Math.floor(dmg * 0.25);
    attacker.hpCurrent = Math.min(attacker.hpMax, attacker.hpCurrent + heal);
    logs.push(`${attacker.name} absorbs ${heal} health through lifesteal.`);
  }

  // Status Effects
  if (ability.statusEffects?.length > 0) {
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

/************************************************************
 * Hit / Crit
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
 * Damage Calculation
 ************************************************************/
function calculateAbilityDamage(attacker, defender, ability, hitData, context) {
  const base = Math.max(1, attacker.atk - defender.def);
  const power = ability.basePower || 1.0;

  let dmg = base * power * hitData.damageMult;

  // Level scaling
  if (ability.scalingPerLevel) {
    dmg += attacker.level * ability.scalingPerLevel * base;
  }

  // World modifiers
  dmg = worldModifiers.modifyDamage(attacker, defender, ability, dmg);

  // Talent modifiers
  dmg = talentModifiers.modifyDamage(attacker, ability, dmg);

  return Math.floor(dmg);
}

/************************************************************
 * Apply Damage (with shield absorption)
 ************************************************************/
function applyDamage(target, amount, source, logs, meta) {
  let dmg = amount;

  // Shield absorption
  dmg = absorbDamageWithShield(target, dmg, logs);

  target.hpCurrent = Math.max(0, target.hpCurrent - dmg);

  logs.push(`${source.name} hits ${target.name} for ${dmg} damage.`);

  if (target.hpCurrent <= 0) {
    logs.push(`${target.name} is defeated.`);
  }
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

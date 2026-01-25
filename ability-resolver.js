// ability-resolver.js

import { applyDamage } from "./damage-helpers.js";
import { applyStatusEffect } from "./status-effects.js";

export function resolveAbility(attacker, defender, ability, context, logs) {
  const base = (ability.power || 0) + attacker.atk;
  const dmg = applyDamage(attacker, defender, base, context, logs, { abilityKey: ability.key });

  if (ability.statusEffects) {
    for (const eff of ability.statusEffects) {
      applyStatusEffect(defender, eff);
      if (logs) logs.push(`${defender.name} is affected by ${eff.type}.`);
    }
  }

  if (ability.selfStatusEffects) {
    for (const eff of ability.selfStatusEffects) {
      applyStatusEffect(attacker, eff);
      if (logs) logs.push(`${attacker.name} gains ${eff.type}.`);
    }
  }

  return dmg;
}

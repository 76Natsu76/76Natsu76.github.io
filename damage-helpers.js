// damage-helpers.js

import { ELEMENT_MATRIX } from "./element-matrix.js";
import { WEATHER_DAMAGE_EFFECTS } from "./weatherTable.js";
import { applyShieldReduction } from "./status-effects.js";

export function rollChance(p) {
  return Math.random() < p;
}

export function computeHitChance(attacker, defender, weatherKey) {
  const base = 0.9;
  const acc = attacker.accuracy || 0;
  const eva = defender.evasion || 0;
  const wfx = WEATHER_DAMAGE_EFFECTS[weatherKey];
  const weatherMod = wfx && wfx.accuracyPenalty ? -wfx.accuracyPenalty : 0;
  return Math.max(0.05, Math.min(0.99, base + acc - eva + weatherMod));
}

export function computeCritChance(attacker, weatherKey) {
  const base = attacker.critChance || 0.05;
  const wfx = WEATHER_DAMAGE_EFFECTS[weatherKey];
  const weatherMod = wfx && wfx.critBoost ? wfx.critBoost : wfx && wfx.critPenalty ? -wfx.critPenalty : 0;
  return Math.max(0, Math.min(1, base + weatherMod));
}

export function computeElementMultiplier(attackerElement, defenderElement) {
  if (!attackerElement || !defenderElement) return 1;
  const row = ELEMENT_MATRIX[attackerElement];
  if (!row) return 1;
  return row[defenderElement] != null ? row[defenderElement] : 1;
}

export function getWeatherDamageMultiplier(attacker, weatherKey) {
  const wfx = WEATHER_DAMAGE_EFFECTS[weatherKey];
  if (!wfx) return 1;
  let mult = 1;
  if (attacker.element && wfx.damageBoost && wfx.damageBoost[attacker.element]) {
    mult *= 1 + wfx.damageBoost[attacker.element];
  }
  if (attacker.element && wfx.damagePenalty && wfx.damagePenalty[attacker.element]) {
    mult *= 1 - wfx.damagePenalty[attacker.element];
  }
  return mult;
}

export function applyDamage(attacker, defender, baseDamage, context, logs, opts = {}) {
  const weatherKey = context.weatherKey || "clear";
  let dmg = baseDamage;

  if (attacker && attacker.element && defender.element) {
    const elemMult = computeElementMultiplier(attacker.element, defender.element);
    dmg = Math.floor(dmg * elemMult);
  }

  if (attacker) {
    const weatherMult = getWeatherDamageMultiplier(attacker, weatherKey);
    dmg = Math.floor(dmg * weatherMult);
  }

  const atk = attacker ? attacker.atk : defender.atk;
  const def = defender.def || 0;
  const mitigated = Math.max(1, Math.floor(dmg * (atk / (atk + def + 1))));

  let finalDmg = applyShieldReduction(defender, mitigated, logs);
  finalDmg = Math.max(0, finalDmg);

  defender.hpCurrent = Math.max(0, defender.hpCurrent - finalDmg);

  if (logs && finalDmg > 0) {
    const src = attacker ? attacker.name : "The environment";
    logs.push(`${src} deals ${finalDmg} damage to ${defender.name}.`);
  }

  return finalDmg;
}

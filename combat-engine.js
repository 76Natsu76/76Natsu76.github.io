// combat-engine.js

import { ELEMENT_MATRIX } from "./element-matrix.js";
import { chooseBossActionV3, chooseEnemyActionV3 } from "./enemy-ai.js";
import {
  weatherTable,
  WEATHER_DAMAGE_EFFECTS,
  WEATHER_COMBAT_LOGS,
  WEATHER_COMBAT_FLAVOR
} from "./weatherTable.js";
import {
  computeHitData,
  computeFinalDamage
} from "./ability-resolver.js";


/****************************************************
 * CORE CONTEXT
 ****************************************************/

export function buildCombatContext(regionKey, biomeKey, weatherKey, eventKey) {
  const weatherDef = weatherTable[weatherKey] || null;

  return {
    regionKey,
    biomeKey,
    weatherKey: weatherKey || (weatherDef ? weatherDef.key : "clear"),
    eventKey,
    turn: 1,
    lastPlayerActionType: null
  };
}

export function applyEnvironmentIntroFlavor(context, logs) {
  const weatherKey = context.weatherKey || "clear";
  const pool = WEATHER_COMBAT_FLAVOR[weatherKey];
  if (pool && pool.length && logs) {
    const line = pool[Math.floor(Math.random() * pool.length)];
    logs.push(line);
  }
}

/****************************************************
 * STATUS EFFECTS
 ****************************************************/

export function applyStatusEffect(target, effect) {
  if (!target.statusEffects) target.statusEffects = [];

  const eff = JSON.parse(JSON.stringify(effect));
  eff.duration = eff.duration != null ? eff.duration : eff.maxDuration || 1;
  eff.maxDuration = eff.maxDuration != null ? eff.maxDuration : eff.duration;

  if (eff.stack === "replace") {
    target.statusEffects = target.statusEffects.filter(e => e.type !== eff.type);
  }

  target.statusEffects.push(eff);
}

function tickCooldowns(entity) {
  if (!entity.cooldowns) return;
  for (const key in entity.cooldowns) {
    if (entity.cooldowns[key] > 0) {
      entity.cooldowns[key] -= 1;
    }
  }
}

export function tickStatusEffects(target, context, logs) {
  if (!target.statusEffects || !target.statusEffects.length) return;

  const remaining = [];

  for (let i = 0; i < target.statusEffects.length; i++) {
    const eff = target.statusEffects[i];

    if (eff.valuePerTurn && eff.type === "dot") {
      const dmg = eff.valuePerTurn;
      applyDamage(null, target, dmg, context, logs, {
        isDOT: true,
        statusType: eff.type,
        source: eff.source || "status"
      });
    }

    if (eff.valuePerTurn && eff.type === "hot") {
      const heal = eff.valuePerTurn;
      const before = target.hpCurrent;
      target.hpCurrent = Math.min(target.hpMax, target.hpCurrent + heal);
      if (logs) {
        logs.push(`${target.name} regenerates ${target.hpCurrent - before} HP.`);
      }
      window.showPopup("playerPanel", `+${heal}`, "heal");
    }

    eff.duration -= 1;

    if (eff.duration > 0) {
      remaining.push(eff);
    } else if (logs) {
      logs.push(`${target.name} is no longer affected by ${eff.type || "a status"}.`);
    }
  }
  target.statusEffects = remaining;
}

export function cleanseStatusEffects(entity) {
  entity.statusEffects = (entity.statusEffects || []).filter(
    e => e.type === "shield" || !e.isDebuff
  );
}

export function crowdControlCheck(entity, logs) {
  const effects = entity.statusEffects || [];

  let stunned = false;
  let silenced = false;
  let rooted = false;
  let feared = false;

  for (const eff of effects) {
    switch (eff.type) {
      case "stun":
        stunned = true;
        break;
      case "silence":
        silenced = true;
        break;
      case "root":
        rooted = true;
        break;
      case "fear":
        feared = true;
        break;
    }
  }

  const any = stunned || silenced || rooted || feared;

  if (any && logs) {
    if (stunned) logs.push(`${entity.name} is stunned and cannot act.`);
    if (silenced) logs.push(`${entity.name} is silenced and cannot cast spells.`);
    if (rooted) logs.push(`${entity.name} is rooted.`);
    if (feared) logs.push(`${entity.name} is feared and may act unpredictably.`);
  }

  return { stunned, silenced, rooted, feared, any };
}

export function applyShieldReduction(defender, incomingDamage, logs) {
  let dmg = incomingDamage;
  if (!defender.statusEffects || !defender.statusEffects.length) return dmg;

  for (let i = 0; i < defender.statusEffects.length; i++) {
    const eff = defender.statusEffects[i];
    if (eff.type === "shield" && eff.power > 0) {
      const absorbed = Math.min(eff.power, dmg);
      eff.power -= absorbed;
      dmg -= absorbed;

      if (logs) logs.push(`${defender.name}'s shield absorbs ${absorbed} damage.`);

      if (eff.power <= 0) {
        defender.statusEffects.splice(i, 1);
        i--;
      }
      if (dmg <= 0) return 0;
    }
  }

  return dmg;
}

/****************************************************
 * WEATHER MODIFIERS
 ****************************************************/

function getWeatherDamageMultiplier(attacker, weatherKey) {
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

function getWeatherCritModifier(weatherKey) {
  const wfx = WEATHER_DAMAGE_EFFECTS[weatherKey];
  if (!wfx) return 0;
  if (wfx.critBoost) return wfx.critBoost;
  if (wfx.critPenalty) return -wfx.critPenalty;
  return 0;
}

function getWeatherAccuracyModifier(weatherKey) {
  const wfx = WEATHER_DAMAGE_EFFECTS[weatherKey];
  if (!wfx) return 0;
  if (wfx.accuracyPenalty) return -wfx.accuracyPenalty;
  return 0;
}

/****************************************************
 * DAMAGE + HIT/CRIT
 ****************************************************/

function rollChance(p) {
  return Math.random() < p;
}

function computeHitChance(attacker, defender, context) {
  const base = 0.9;
  const acc = attacker.accuracy || 0;
  const eva = defender.evasion || 0;
  const weatherMod = getWeatherAccuracyModifier(context.weatherKey || "clear");
  return Math.max(0.05, Math.min(0.99, base + acc - eva + weatherMod));
}

function computeCritChance(attacker, context) {
  const base = attacker.critChance || 0.05;
  const weatherMod = getWeatherCritModifier(context.weatherKey || "clear");
  return Math.max(0, Math.min(1, base + weatherMod));
}

/**
 * ELEMENT_MATRIX entries are treated as additive modifiers:
 *   0.25  => 1.25x damage
 *  -0.20  => 0.80x damage
 *   0     => 1.00x damage
 */
function computeElementMultiplier(attackerElement, defenderElement) {
  if (!attackerElement || !defenderElement) return 1;

  const row = ELEMENT_MATRIX[attackerElement];
  if (!row) return 1;

  const val = row[defenderElement];

  if (val == null) return 1;

  // Interpret as offset from 1.0
  let mult = 1 + val;

  // Safety clamp so we never invert damage or explode it
  mult = Math.max(0.25, Math.min(2.5, mult));

  return mult;
}

export function applyDamage(attacker, defender, baseDamage, context, logs, opts = {}) { // we can use opts.crit
  const weatherKey = context.weatherKey || "clear";

  let dmg = baseDamage;

  // Elemental interaction
  if (attacker && attacker.element && defender.element) {
    const elemMult = computeElementMultiplier(attacker.element, defender.element);
    dmg = Math.floor(dmg * elemMult);
  }

  // Weather interaction
  if (attacker) {
    const weatherMult = getWeatherDamageMultiplier(attacker, weatherKey);
    dmg = Math.floor(dmg * weatherMult);
  }

  // Safety: never let damage go negative at this stage
  if (dmg < 0) dmg = 0;

  const atk = attacker ? attacker.atk : defender.atk;
  const def = defender.def || 0;
  const k = 0.015; // global tuning constant

  const mitigated = Math.max(1, Math.floor(dmg * Math.exp(-k * def)));

  let finalDmg = applyShieldReduction(defender, mitigated, logs);
  finalDmg = Math.max(0, finalDmg);

  defender.hpCurrent = Math.max(0, defender.hpCurrent - finalDmg);

  if (attacker?.isPlayer) {
    window.showPopup("enemyPanel", `-${finalDmg}`, "damage");
  } else {
    window.showPopup("playerPanel", `-${finalDmg}`, "damage");
  }

  // Ultimate charge gain
  if (attacker && attacker.isPlayer) {
    attacker.ultimateCharge = Math.min(
      attacker.ultimateChargeRequired || 100,
      (attacker.ultimateCharge || 0) + Math.floor(finalDmg * 0.5)
    );
  }

  if (defender && defender.isPlayer) {
    defender.ultimateCharge = Math.min(
      defender.ultimateChargeRequired || 100,
      (defender.ultimateCharge || 0) + Math.floor(finalDmg * 0.25)
    );
  }

  if (logs && finalDmg > 0) {
    const srcName = attacker ? attacker.name : "The environment";
    logs.push(`${srcName} deals ${finalDmg} damage to ${defender.name}.`);
  }

  return finalDmg;
}

/****************************************************
 * ABILITY RESOLUTION
 ****************************************************/

export function resolveAbilityUse(attacker, defender, ability, context, logs) {
  const abilityName = ability.name || ability.key;

  // --- COOLDOWN CHECK ---
  if (!attacker.cooldowns) attacker.cooldowns = {};
  const cd = attacker.cooldowns[ability.key] || 0;

  if (cd > 0) {
    logs.push(`${attacker.name} tries to use ${abilityName}, but it is on cooldown (${cd} turns left).`);
    return;
  }

  // --- MP CHECK ---
  const cost = ability.manaCost || ability.mpCost || 0;
  const currentMP = attacker.mana ?? attacker.manaCurrent ?? attacker.mp ?? 0;

  if (currentMP < cost) {
    logs.push(`${attacker.name} does not have enough MP for ${abilityName}.`);
    return;
  }

  // Deduct MP
  if (attacker.mana !== undefined) attacker.mana -= cost;
  if (attacker.manaCurrent !== undefined) attacker.manaCurrent -= cost;
  if (attacker.mp !== undefined) attacker.mp -= cost;

  // --- HIT / CRIT ---
  const hitData = computeHitData(attacker, defender, ability, context);

  if (!hitData.isHit) {
    logs.push(`${attacker.name}'s ${abilityName} misses!`);
    return;
  }

  // --- DAMAGE ---
  const dmg = computeFinalDamage(attacker, defender, ability, hitData, context);

  const finalDmg = applyDamage(attacker, defender, dmg, context, logs, {
    isAbility: true,
    abilityKey: ability.key,
    isCrit: hitData.isCrit
  });

  if (hitData.isCrit && logs && finalDmg > 0) {
    logs.push("Critical hit!");
  }

  // --- STATUS EFFECTS ---
  if (ability.statusEffects) {
    for (const eff of ability.statusEffects) {
      applyStatusEffect(defender, eff);
      logs.push(`${defender.name} is affected by ${eff.type}.`);
    }
  }

  if (ability.selfStatusEffects) {
    for (const eff of ability.selfStatusEffects) {
      applyStatusEffect(attacker, eff);
      logs.push(`${attacker.name} gains ${eff.type}.`);
    }
  }

  // --- APPLY COOLDOWN ---
  attacker.cooldowns[ability.key] = ability.cooldown || 0;
}

/****************************************************
 * BASIC ATTACK
 ****************************************************/

export function resolveBasicAttack(attacker, defender, context, logs) {
  const basicAbility = {
    key: "attack",
    name: "Attack",
    basePower: 1.0
  };

  const hitData = computeHitData(attacker, defender, basicAbility, context);

  if (!hitData.isHit) {
    if (logs) logs.push(`${attacker.name}'s attack misses!`);
    return;
  }

  const dmg = computeFinalDamage(attacker, defender, basicAbility, hitData, context);

  const finalDmg = applyDamage(attacker, defender, dmg, context, logs, {
    isBasic: true,
    isCrit: hitData.isCrit
  });

  if (hitData.isCrit && logs && finalDmg > 0) {
    logs.push("Critical hit!");
  }
}

/****************************************************
 * TURN RESOLUTION
 ****************************************************/

export function runEnemyTurn(enemy, player, context, logs) {
  const cc = crowdControlCheck(enemy, logs);
  if (cc.stunned) return;

  const aiContext = {
    lastPlayerActionType: context.lastPlayerActionType || null
  };

  const action = enemy.isBoss
    ? chooseBossActionV3(enemy, player, aiContext, logs)
    : chooseEnemyActionV3(enemy, player, aiContext, logs);

  if (action.type === "basic") {
    resolveBasicAttack(enemy, player, context, logs);
  } else if (action.type === "ability" && action.ability) {
    resolveAbilityUse(enemy, player, action.ability, context, logs);
    enemy.lastBossAction = action.ability.key || action.ability.name;
  }
}

export function runPlayerAction(player, enemy, action, context, logs) {
  const cc = crowdControlCheck(player, logs);
  if (cc.stunned) return;

  if (action.type === "basic") {
    resolveBasicAttack(player, enemy, context, logs);
  } else if (action.type === "ability" && action.ability) {
    resolveAbilityUse(player, enemy, action.ability, context, logs);
    context.lastPlayerActionType = action.ability.actionType || "ability";
  }

  if (action.type === "flee") {
    const chance = 0.5; // or scale by speed
    if (Math.random() < chance) {
      logs.push(`${player.name} successfully fled!`);
      context.fled = true;
    } else {
      logs.push(`${player.name} failed to flee!`);
    }
    return;
  }
}

/****************************************************
 * ROUND DRIVER
 ****************************************************/

export function runCombatRound(player, enemy, context, playerAction, logs) {
  logs = logs || [];

  tickStatusEffects(player, context, logs);
  tickStatusEffects(enemy, context, logs);

  const actors = [player, enemy].sort(
    (a, b) => (b.speed || 0) - (a.speed || 0)
  );

  for (const actor of actors) {
    if (player.hpCurrent <= 0 || enemy.hpCurrent <= 0) break;

    if (actor === player) {
      runPlayerAction(player, enemy, playerAction, context, logs);
    } else {
      runEnemyTurn(enemy, player, context, logs);
    }

    if (context.fled) {
      return { player, enemy, context, logs };
    }
  }
  
  tickCooldowns(player);
  tickCooldowns(enemy);

  context.turn += 1;
  return { player, enemy, context, logs };
}

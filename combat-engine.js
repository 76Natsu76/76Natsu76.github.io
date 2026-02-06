// combat-engine.js

import { ELEMENT_MATRIX } from "./element-matrix.js";
import { chooseBossActionV3, chooseEnemyActionV3 } from "./enemy-ai.js";
import {
  weatherTable,
  WEATHER_DAMAGE_EFFECTS,
  WEATHER_COMBAT_LOGS,
  WEATHER_COMBAT_FLAVOR
} from "./weatherTable.js";
import { computeHitData, computeFinalDamage } from "./ability-resolver.js";
import { FAMILY_SYNERGIES } from "./family-synergies.js";

/****************************************************
 * CORE CONTEXT
 ****************************************************/

function generateEnvironmentalFlavor(enemy) {
  const tags = enemy.flavorTags || [];
  if (!tags.length) return [];

  const lines = [];

  for (const tag of tags) {
    switch (tag) {
      case "storm-kissed":
      case "stormbreaker":
      case "tempest-forged":
        lines.push("The air crackles with storm energy.");
        break;

      case "void-touched":
      case "unmaking":
      case "paradox-charged":
        lines.push("Reality warps subtly around your foe.");
        break;

      case "deepwild":
      case "overgrown":
      case "primeval":
        lines.push("The dense wilderness shifts with unseen life.");
        break;

      case "frostbitten":
      case "winterborn":
      case "crystal-frost":
        lines.push("A biting chill hangs over the battlefield.");
        break;

      case "infernal":
      case "burning":
      case "magma-scorched":
        lines.push("Heat radiates from the creature like a furnace.");
        break;

      case "ancestral":
      case "spirit-awakening":
        lines.push("A spiritual presence stirs in the air.");
        break;

      case "arcane-surge":
      case "astral":
      case "starlit":
        lines.push("Arcane currents shimmer faintly around you.");
        break;

      default:
        // Generic fallback
        lines.push(`The environment shifts with a ${tag.replace(/-/g, " ")} influence.`);
        break;
    }
  }

  return lines;
}

export function buildCombatContext(regionKey, biomeKey, weatherKey, eventKey, mode = "solo") {
  const weatherDef = weatherTable[weatherKey] || null;

  return {
    regionKey,
    biomeKey,
    weatherKey: weatherKey || (weatherDef ? weatherDef.key : "clear"),
    eventKey,
    mode, // "solo" | "multiplayer" | "raid"
    turn: 1,
    lastPlayerActionType: null,
    fled: false,
    combatEnded: null, // "victory" | "defeat" | "draw" | "fled"
    grid: {
      playerRow: [],
      enemyRows: []
    }
  };
}

function assignPlayerPosition(player, context) {
  if (context.mode === "solo") {
    // Player is always frontline, column 0
    player.position = { row: 0, col: 0 };
    context.grid.playerRow = [player];
    return;
  }

  // Multiplayer / raid mode (to be expanded with raid system)
  if (!player.position) {
    player.position = { row: 0, col: 0 };
  }
  context.grid.playerRow = [player];
}

// Intro flavor
export function applyEnvironmentIntroFlavor(context, logs) {
  const weatherKey = context.weatherKey || "clear";
  const pool = WEATHER_COMBAT_FLAVOR[weatherKey];
  if (pool && pool.length && logs) {
    const line = pool[Math.floor(Math.random() * pool.length)];
    logs.push(line);
  }
  // NEW: merge weather + region flavor
  if (context.enemy && context.enemy.flavorTags) {
    const envLines = generateEnvironmentalFlavor(context.enemy);
    for (const l of envLines) logs.push(l);
  }
}

/****************************************************
 * STATUS EFFECTS
 ****************************************************/

export function applyStatusEffect(target, effect) {
  if (!target) return;
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
  if (!entity || !entity.cooldowns) return;
  for (const key in entity.cooldowns) {
    if (entity.cooldowns[key] > 0) {
      entity.cooldowns[key] -= 1;
    }
  }
}

export function tickStatusEffects(target, context, logs) {
  if (!target || !target.statusEffects || !target.statusEffects.length) return;

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
      // NEW: environmental DOT flavor
      if (target.flavorTags && Math.random() < 0.05) {
        const envLines = generateEnvironmentalFlavor(target);
        if (envLines.length) logs.push(envLines[Math.floor(Math.random() * envLines.length)]);
      }
    }

    if (eff.valuePerTurn && eff.type === "hot") {
      const heal = eff.valuePerTurn;
      const before = target.hpCurrent;
      target.hpCurrent = Math.min(target.hpMax, target.hpCurrent + heal);
      const healed = target.hpCurrent - before;
      if (logs && healed > 0) {
        logs.push(`${target.name} regenerates ${healed} HP.`);
      }
      if (healed > 0) {
        if (target.isPlayer) {
          window.showPopup("playerPanel", `+${healed}`, "heal");
        } else {
          window.showPopup("enemyPanel", `+${healed}`, "heal");
        }
      }
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
  if (!entity) return;
  entity.statusEffects = (entity.statusEffects || []).filter(
    e => e.type === "shield" || !e.isDebuff
  );
}

export function crowdControlCheck(entity, logs) {
  const effects = entity?.statusEffects || [];

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

function applyEnvironmentalStatusEffects(entity, context, logs) {
  if (!entity || !entity.environmentalModifiers) return;

  const tags = entity.flavorTags || [];
  if (!tags.length) return;

  // Low-frequency trigger
  if (Math.random() > 0.05) return;

  for (const tag of tags) {
    switch (tag) {
      case "frostbitten":
      case "winterborn":
      case "crystal-frost":
        applyStatusEffect(entity, {
          type: "slow",
          isDebuff: true,
          duration: 2,
          valuePerTurn: null
        });
        logs.push(`${entity.name} is chilled by the freezing air.`);
        break;

      case "mire-born":
      case "bog-dweller":
      case "marsh-haunted":
        applyStatusEffect(entity, {
          type: "dodge-down",
          isDebuff: true,
          duration: 2
        });
        logs.push(`${entity.name struggles in the thick swamp mire.`);
        break;

      case "sunscorched":
      case "blistering":
      case "infernal":
        applyStatusEffect(entity, {
          type: "dot",
          isDebuff: true,
          duration: 2,
          valuePerTurn: Math.floor(entity.hpMax * 0.02)
        });
        logs.push(`${entity.name suffers from the oppressive heat.`);
        break;

      case "storm-kissed":
      case "tempest-forged":
        applyStatusEffect(entity, {
          type: "charged",
          isDebuff: false,
          duration: 1
        });
        logs.push(`Static energy crackles around ${entity.name}.`);
        break;

      case "void-touched":
      case "unmaking":
      case "paradox-charged":
        applyStatusEffect(entity, {
          type: "corruption",
          isDebuff: true,
          duration: 2
        });
        logs.push(`Warped void energy distorts ${entity.name}'s form.`);
        break;

      default:
        break;
    }
  }
}

function triggerEnvironmentalHazard(entity, context, logs) {
  if (!entity || !entity.environmentalModifiers) return;
  const tags = entity.flavorTags || [];
  if (!tags.length) return;

  // Very low chance per round
  if (Math.random() > 0.03) return;

  for (const tag of tags) {
    switch (tag) {
      case "storm-kissed":
      case "tempest-forged":
      case "stormbreaker": {
        const dmg = Math.floor(entity.hpMax * 0.05);
        applyDamage(null, entity, dmg, context, logs, { isHazard: true });
        logs.push(`A sudden lightning strike hits ${entity.name}!`);
        break;
      }

      case "sunscorched":
      case "blistering":
      case "infernal": {
        const dmg = Math.floor(entity.hpMax * 0.04);
        applyDamage(null, entity, dmg, context, logs, { isHazard: true });
        logs.push(`A burst of scorching heat sears ${entity.name}.`);
        break;
      }

      case "void-touched":
      case "unmaking":
      case "paradox-charged": {
        applyStatusEffect(entity, {
          type: "corruption",
          isDebuff: true,
          duration: 2
        });
        logs.push(`A pulse of void energy distorts ${entity.name}.`);
        break;
      }

      case "mire-born":
      case "bog-dweller":
      case "marsh-haunted": {
        applyStatusEffect(entity, {
          type: "poison",
          isDebuff: true,
          duration: 2,
          valuePerTurn: Math.floor(entity.hpMax * 0.02)
        });
        logs.push(`Toxic swamp gases engulf ${entity.name}.`);
        break;
      }

      case "frostbitten":
      case "winterborn":
      case "crystal-frost": {
        applyStatusEffect(entity, {
          type: "slow",
          isDebuff: true,
          duration: 1
        });
        logs.push(`A freezing wind chills ${entity.name} to the bone.`);
        break;
      }

      case "arcane-surge":
      case "astral":
      case "starlit": {
        applyStatusEffect(entity, {
          type: "arcane-charge",
          isDebuff: false,
          duration: 1
        });
        logs.push(`Arcane energy surges unpredictably around ${entity.name}.`);
        break;
      }

      default:
        break;
    }
  }
}


/****************************************************
 * TACTICAL CLASSIFICATION
 ****************************************************/

function isTacticalEnemy(enemy) {
  if (enemy.tacticalProfile === "tactical") return true;
  if (enemy.tacticalProfile === "simple") return false;

  // AUTO rules
  if (enemy.rarity === "mythical" || enemy.rarity === "boss" || enemy.rarity === "final") return true;
  if ((enemy.tier || 1) >= 4) return true;
  if (["dragon", "void", "demon", "celestial", "aberration"].includes(enemy.family)) return true;
  if (enemy.tags?.includes("alpha") || enemy.tags?.includes("elder") || enemy.tags?.includes("champion")) return true;
  if (enemy.role === "caster" || enemy.role === "support" || enemy.role === "leader") return true;

  return false;
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

  let mult = 1 + val;
  mult = Math.max(0.25, Math.min(2.5, mult));

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

  // ENVIRONMENTAL ELEMENTAL BIAS (Step 1)
  if (attacker) {
    const envMods = attacker.environmentalModifiers || null;
    const bias = envMods?.elementalBias || null;

    // Prefer ability element if present, otherwise attacker.element
    const abilityElement = opts.abilityElement || null;
    const elem = abilityElement || attacker.element || null;

    if (elem && bias && bias[elem]) {
      dmg = Math.floor(dmg * bias[elem]);
    }
  }
  
  if (dmg < 0) dmg = 0;
  const def = defender.def || 0;
  const k = 0.015;

  const mitigated = Math.max(1, Math.floor(dmg * Math.exp(-k * def)));

  let finalDmg = applyShieldReduction(defender, mitigated, logs);
  finalDmg = Math.max(0, finalDmg);

  defender.hpCurrent = Math.max(0, defender.hpCurrent - finalDmg);

  if (attacker?.isPlayer) {
    window.showPopup("enemyPanel", `-${finalDmg}`, "damage");
  } else if (defender?.isPlayer) {
    window.showPopup("playerPanel", `-${finalDmg}`, "damage");
  }

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
 * POSITION / TARGETING HELPERS (MODEL 3)
 ****************************************************/

function normalizeEnemies(enemiesOrSingle) {
  if (!enemiesOrSingle) return [];
  if (Array.isArray(enemiesOrSingle)) return enemiesOrSingle;
  return [enemiesOrSingle];
}

function getLivingEnemies(enemies) {
  return enemies.filter(e => e && e.hpCurrent > 0);
}

function allEnemiesDead(enemies) {
  return !getLivingEnemies(enemies).length;
}

function pickPrimaryEnemy(enemies, action) {
  const living = getLivingEnemies(enemies);
  if (!living.length) return null;

  if (action && typeof action.targetIndex === "number") {
    const e = enemies[action.targetIndex];
    if (e && e.hpCurrent > 0) return e;
  }
  if (action && action.targetId) {
    const e = enemies.find(x => x.id === action.targetId && x.hpCurrent > 0);
    if (e) return e;
  }

  return living[0];
}

/**
 * Simple 2-row assignment for non-tactical solo encounters.
 * Front row: melee/brute/tank (or default)
 * Back row: ranged/caster/support
 */
function assignSimpleEnemyRows(enemies, context) {
  const frontRow = [];
  const backRow = [];

  enemies.forEach((e, idx) => {
    if (!e) return;
    const role = e.role || "melee";

    if (["ranged", "caster", "support"].includes(role)) {
      e.position = { row: 1, col: backRow.length };
      backRow.push(e);
    } else {
      e.position = { row: 0, col: frontRow.length };
      frontRow.push(e);
    }
  });

  context.grid.enemyRows = [];
  context.grid.enemyRows[0] = frontRow;
  context.grid.enemyRows[1] = backRow;
}

/**
 * Tactical formation assignment for stronger enemies / multiplayer.
 * For now: similar to simple, but prioritizes leaders/casters in back center.
 */
function assignTacticalEnemyFormation(enemies, context) {
  const frontRow = [];
  const backRow = [];

  // First pass: leaders/casters/support to back
  const leaders = [];
  const casters = [];
  const supports = [];
  const others = [];

  enemies.forEach(e => {
    if (!e) return;
    const role = e.role || "melee";
    if (role === "leader") leaders.push(e);
    else if (role === "caster") casters.push(e);
    else if (role === "support") supports.push(e);
    else others.push(e);
  });

  // Back row: leaders center, casters, supports
  const backOrdered = [...leaders, ...casters, ...supports];
  backOrdered.forEach((e, idx) => {
    e.position = { row: 1, col: idx };
    backRow.push(e);
  });

  // Front row: everyone else
  others.forEach((e, idx) => {
    e.position = { row: 0, col: idx };
    frontRow.push(e);
  });

  context.grid.enemyRows = [];
  context.grid.enemyRows[0] = frontRow;
  context.grid.enemyRows[1] = backRow;
}

function assignEnemyPositions(enemies, context) {
  const tactical = enemies.some(e => isTacticalEnemy(e));

  if (context.mode === "solo" && !tactical) {
    // Simple 2-row logic
    return assignSimpleEnemyRows(enemies, context);
  }

  // Tactical formation logic
  return assignTacticalEnemyFormation(enemies, context);
}

function getAdjacentEnemies(enemies, primary) {
  if (!primary || !primary.position) return [];
  const { row, col } = primary.position;
  return enemies.filter(e => {
    if (!e.position) return false;
    return e.position.row === row && Math.abs(e.position.col - col) === 1 && e.hpCurrent > 0;
  });
}

function getEnemiesInSameColumn(enemies, primary) {
  if (!primary || !primary.position) return [];
  const { col } = primary.position;
  return enemies.filter(e => e.position && e.position.col === col && e.hpCurrent > 0);
}

/****************************************************
 * ABILITY RESOLUTION (MULTI-TARGET AWARE)
 ****************************************************/

function getAbilityShape(ability) {
  const shape =
    ability.targetShape ||
    ability.areaShape ||
    ability.actionShape ||
    ability.shape ||
    null;

  const tags = ability.tags || [];

  if (shape) return shape;

  if (tags.includes("aoe")) return "aoe";
  if (tags.includes("line")) return "line";
  if (tags.includes("cone")) return "cone";
  if (tags.includes("cleave")) return "cleave";

  return "single";
}

function getAbilityTargets(attacker, enemies, primaryTarget, ability, context) {
  const shape = getAbilityShape(ability);
  const living = getLivingEnemies(enemies);

  if (!primaryTarget || !living.length) return [];

  // For now, mode does not change shapes, but hook is here for future:
  // - solo: simpler rules
  // - multiplayer/raid: full tactical rules
  // You can expand this later if you want melee vs backline restrictions, etc.

  switch (shape) {
    case "aoe":
      return living;

    case "cleave": {
      const adj = getAdjacentEnemies(enemies, primaryTarget);
      return [primaryTarget, ...adj];
    }

    case "line": {
      const colEnemies = getEnemiesInSameColumn(enemies, primaryTarget);
      return colEnemies.length ? colEnemies : [primaryTarget];
    }

    case "cone": {
      const adj = getAdjacentEnemies(enemies, primaryTarget);
      return [primaryTarget, ...adj];
    }

    case "single":
    default:
      return [primaryTarget];
  }
}

// Backward-compatible single-target wrapper
export function resolveAbilityUse(attacker, defender, ability, context, logs) {
  return resolveAbilityUseMulti(attacker, [defender], ability, defender, context, logs);
}

export function resolveAbilityUseMulti(attacker, enemies, ability, primaryTarget, context, logs) {
  const abilityName = ability.name || ability.key;

  if (!attacker.cooldowns) attacker.cooldowns = {};
  const cd = attacker.cooldowns[ability.key] || 0;

  if (cd > 0) {
    logs.push(
      `${attacker.name} tries to use ${abilityName}, but it is on cooldown (${cd} turns left).`
    );
    return;
  }

  const isUlt = ability.isUltimate;
  const cost = isUlt ? 0 : (ability.manaCost || ability.mpCost || 0);

  // Uniform MP read
  const currentMP =
    attacker.manaCurrent ??
    attacker.mana ??
    attacker.mp ??
    0;

  if (!isUlt && currentMP < cost) {
    logs.push(`${attacker.name} does not have enough MP for ${abilityName}.`);
    return;
  }

  // Deduct MP ONCE, only if not ultimate
  if (!isUlt && cost > 0) {
    const newMP = Math.max(0, currentMP - cost);
    attacker.manaCurrent = newMP;
    attacker.mana = newMP;
  }

  const targets = getAbilityTargets(attacker, enemies, primaryTarget, ability, context);
  if (!targets.length) {
    logs.push(`${attacker.name}'s ${abilityName} has no valid targets.`);
    return;
  }

  for (const target of targets) {
    if (!target || target.hpCurrent <= 0) continue;

    const hitData = computeHitData(attacker, target, ability, context);

    if (!hitData.isHit) {
      logs.push(`${attacker.name}'s ${abilityName} misses ${target.name}!`);
      continue;
    }

    const dmg = computeFinalDamage(attacker, target, ability, hitData, context);

    const finalDmg = applyDamage(attacker, target, dmg, context, logs, {
      isAbility: true,
      abilityKey: ability.key,
      isCrit: hitData.isCrit,
      abilityElement: ability.element || null
    });

    if (hitData.isCrit && logs && finalDmg > 0) {
      logs.push("Critical hit!");
    }

    // NEW: environmental flavor on ability hit
    if (attacker.flavorTags && attacker.flavorTags.length) {
      const envLines = generateEnvironmentalFlavor(attacker);
      if (envLines.length && Math.random() < 0.15) {
        logs.push(envLines[Math.floor(Math.random() * envLines.length)]);
      }
    }

    if (ability.statusEffects) {
      for (const eff of ability.statusEffects) {
        applyStatusEffect(target, eff);
        logs.push(`${target.name} is affected by ${eff.type}.`);
      }
    }
  }

  if (ability.selfStatusEffects) {
    for (const eff of ability.selfStatusEffects) {
      applyStatusEffect(attacker, eff);
      logs.push(`${attacker.name} gains ${eff.type}.`);
    }
  }

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
    if (logs) logs.push(`${attacker.name}'s attack misses ${defender.name}!`);
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

  // NEW: environmental flavor on basic attack
  if (attacker.flavorTags && attacker.flavorTags.length) {
    const envLines = generateEnvironmentalFlavor(attacker);
    if (envLines.length && Math.random() < 0.10) {
      logs.push(envLines[Math.floor(Math.random() * envLines.length)]);
    }
  }
}

/****************************************************
 * AI HELPERS (SIMPLE VS TACTICAL)
 ****************************************************/

function runSimpleAI(enemy, player, context, logs) {
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

function runTacticalAI(enemy, player, context, logs) {
  // For now, tactical AI uses the same core logic as simple AI,
  // but this is the hook where you can later add:
  // - focus fire
  // - protect casters
  // - formation abilities
  // - synergy abilities
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

/****************************************************
 * TURN RESOLUTION (MULTI-ENEMY)
 ****************************************************/

export function runEnemyTurn(enemy, player, context, logs) {
  if (context.mode === "solo" && !isTacticalEnemy(enemy)) {
    return runSimpleAI(enemy, player, context, logs);
  }
  return runTacticalAI(enemy, player, context, logs);
}

export function runPlayerAction(player, enemies, action, context, logs) {
  const cc = crowdControlCheck(player, logs);
  if (cc.stunned) return;

  if (action.type === "flee") {
    const chance = 0.5;
    if (Math.random() < chance) {
      logs.push(`${player.name} successfully fled!`);
      context.fled = true;
      context.combatEnded = "fled";
    } else {
      logs.push(`${player.name} failed to flee!`);
    }
    return;
  }

  const primaryTarget = pickPrimaryEnemy(enemies, action);
  if (!primaryTarget) {
    logs.push(`${player.name} has no valid target.`);
    return;
  }

  if (action.type === "basic") {
    resolveBasicAttack(player, primaryTarget, context, logs);
    context.lastPlayerActionType = "basic";
  } else if (action.type === "ability" && action.ability) {
    resolveAbilityUseMulti(player, enemies, action.ability, primaryTarget, context, logs);
    context.lastPlayerActionType = action.ability.actionType || "ability";
  }
}

function applyFamilySynergy(attacker, defender, baseDamage) {
  const atkFam = attacker.family;
  const defFam = defender.family;

  const synergy = FAMILY_SYNERGIES[atkFam] || {};
  const defense = FAMILY_SYNERGIES[defFam] || {};

  let dmg = baseDamage;

  // Attacker bonus
  if (synergy.bonusAgainst?.includes(defFam)) {
    dmg *= 1.20;
  }

  // Defender resistance
  if (defense.resistantTo?.includes(attacker.element)) {
    dmg *= 0.80;
  }

  // Defender weakness
  if (defense.weakTo?.includes(attacker.element)) {
    dmg *= 1.25;
  }

  // Defender immunity
  if (defense.immuneTo?.includes(attacker.element)) {
    dmg = 0;
  }

  return dmg;
}

/****************************************************
 * ROUND DRIVER (MULTI-ENEMY, MODEL 3 READY)
 ****************************************************/

export function runCombatRound(player, enemyOrEnemies, context, playerAction, logs) {
  logs = logs || [];

  const enemies = normalizeEnemies(enemyOrEnemies);

  // Ensure positions are assigned
  assignPlayerPosition(player, context);
  assignEnemyPositions(enemies, context);

  tickStatusEffects(player, context, logs);
  enemies.forEach(e => tickStatusEffects(e, context, logs));
  // STEP 2: Environmental status effects
  applyEnvironmentalStatusEffects(player, context, logs);
  enemies.forEach(e => applyEnvironmentalStatusEffects(e, context, logs));

  const weather = context.weatherKey;
  if (weather === "blizzard" && Math.random() < 0.05) {
    applyStatusEffect(entity, { type: "slow", duration: 1, isDebuff: true });
    logs.push(`${entity.name} is slowed by the blizzard winds.`);
  }
  
  if (weather === "storm" && Math.random() < 0.05) {
    applyStatusEffect(entity, { type: "charged", duration: 1 });
    logs.push(`Lightning dances around ${entity.name}.`);
  }

  const actors = [player, ...enemies].filter(a => a && a.hpCurrent > 0);
  actors.sort((a, b) => (b.speed || 0) - (a.speed || 0));

  for (const actor of actors) {
    if (player.hpCurrent <= 0) break;
    if (allEnemiesDead(enemies)) break;
    if (context.fled) break;

    if (actor === player) {
      runPlayerAction(player, enemies, playerAction, context, logs);
    } else {
      if (actor.hpCurrent > 0) {
        runEnemyTurn(actor, player, context, logs);
      }
    }

    if (context.fled) {
      context.combatEnded = "fled";
      break;
    }
    if (player.hpCurrent <= 0) {
      context.combatEnded = "defeat";
      break;
    }
    if (allEnemiesDead(enemies)) {
      context.combatEnded = "victory";
      break;
    }
  }

  tickCooldowns(player);
  enemies.forEach(e => tickCooldowns(e));

  context.turn += 1;
  // STEP 3: Environmental Hazards
  triggerEnvironmentalHazard(player, context, logs);
  enemies.forEach(e => triggerEnvironmentalHazard(e, context, logs));

  // NEW: occasional environmental reminder
  if (context.enemy && Math.random() < 0.03) {
    const envLines = generateEnvironmentalFlavor(context.enemy);
    if (envLines.length) {
      const line = envLines[Math.floor(Math.random() * envLines.length)];
      logs.push(line);
    }
  }

  const primaryEnemy = getLivingEnemies(enemies)[0] || enemies[0] || null;
  context.enemy = primaryEnemy;

  return {
    player,
    enemy: primaryEnemy,
    enemies,
    context,
    logs
  };
}

// combat-flow.js
// Turn-based orchestration layer for the modern engine

import { resolveEnemy } from "./resolveEnemy.js";
import { generateEncounter } from "./encounter-generator.js";
import { applyAllModifiers } from "./world-simulation.js";
import { executeAbility } from "./ability-resolver.js";
import { resolveEnemyAction } from "./enemy-ai.js";
import { tickStatusEffects } from "./status-effects.js";
import { resolveHitAndCrit } from "./combat-engine.js";

// If you have a dedicated player loader, swap this out:
import { loadPlayer } from "./player-registry.js";

// --------------------------------------------------
// Utility: shallow clone (to avoid mutating originals)
// --------------------------------------------------
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// --------------------------------------------------
// Build runtime player from stored record
// (You already have resolvePlayer in another file;
// if so, import and use that instead.)
// --------------------------------------------------
function resolvePlayer(raw) {
  const stats = raw.computedStatsJSON || {};

  const hpMax = stats.hpMax || 1;
  const manaMax = stats.manaMax || 0;

  const hpCurrent = Math.max(0, Math.min(raw.hpCurrent ?? hpMax, hpMax));
  const manaCurrent = Math.max(0, Math.min(raw.manaCurrent ?? manaMax, manaMax));

  return {
    id: raw.username,
    name: raw.username,
    level: raw.level || 1,
    profession: raw.profession,
    race: raw.race,
    subrace: raw.subrace,

    hpCurrent,
    hpMax,
    manaCurrent,
    manaMax,

    atk: stats.atk || 1,
    def: stats.def || 0,
    speed: stats.speed || 1,

    critChance: stats.critChance || 0.05,
    critDamage: stats.critDamage || 1.5,

    elementAffinity: stats.elementAffinity || {},

    statusEffects: Array.isArray(raw.playerStatusEffects)
      ? raw.playerStatusEffects
      : [],
    cooldowns: raw.cooldowns || {},
    pendingAction: null,

    abilities: raw.abilities || [], // or load from your ability system
    ultimate: raw.ultimate || null,
    ultimateCharge: raw.ultimateCharge || 0,
    ultimateChargeRequired: raw.ultimateChargeRequired || 100,

    equipment: raw.equipment || {},
    talentTree: raw.talentTree || {},
    talentPoints: raw.talentPoints || 0,

    inventory: raw.inventory || [],

    regionMetaJSON: raw.regionMetaJSON || {},

    isPlayer: true,
    lastAction: null,
    lastActionType: null
  };
}

// --------------------------------------------------
// Context builder
// --------------------------------------------------
function buildCombatContext(encounter, playerState, enemyState) {
  return {
    regionKey: encounter.regionKey,
    biomeKey: encounter.biome,
    weatherKey: encounter.weather,
    eventKey: encounter.event || null,
    hazard: encounter.hazard || null,
    finalModifiers: encounter.finalModifiers || {},
    logs: [],
    round: 1
  };
}

// --------------------------------------------------
// Public: startCombat(username, regionKey)
// --------------------------------------------------
export function startCombat(username, regionKey) {
  const logs = [];

  const rawPlayer = loadPlayerRecord(username);
  if (!rawPlayer) {
    throw new Error("Player not found: " + username);
  }

  const playerState = resolvePlayer(rawPlayer);

  const encounter = generateEncounter(regionKey, playerState);
  const enemyState = resolveEnemy(encounter.enemy, encounter);

  const context = buildCombatContext(
    { ...encounter, regionKey },
    playerState,
    enemyState
  );

  // Apply world/biome/weather modifiers
  applyAllModifiers(context, playerState, enemyState);

  logs.push(
    `You encounter **${enemyState.name}** in the ${regionKey}!`
  );

  // Initial hazard, if any
  if (encounter.hazard) {
    logs.push(`The area is hazardous: ${encounter.hazard.name || encounter.hazard}`);
  }

  context.logs = logs;

  const outcome = checkOutcome(playerState, enemyState);
  return {
    playerState,
    enemyState,
    context,
    logs,
    outcome
  };
}

// --------------------------------------------------
// Public: runCombatRound(combat, playerAction)
// combat: { playerState, enemyState, context }
// playerAction: { type, key?, itemId? }
// --------------------------------------------------
export function runCombatRound(combat, playerAction) {
  const logs = [];

  const playerState = clone(combat.playerState);
  const enemyState = clone(combat.enemyState);
  const context = clone(combat.context);

  context.round = (context.round || 0) + 1;
  logs.push(`— Round ${context.round} —`);

  // 1. Tick status effects
  tickStatusEffects(playerState, context, logs);
  tickStatusEffects(enemyState, context, logs);

  if (isDead(playerState) || isDead(enemyState)) {
    const outcome = checkOutcome(playerState, enemyState);
    return { playerState, enemyState, context, logs, outcome };
  }

  // 2. Determine turn order
  const first = (playerState.speed || 1) >= (enemyState.speed || 1)
    ? "player"
    : "enemy";

  if (first === "player") {
    playerTurn(playerState, enemyState, context, logs, playerAction);
    if (!isDead(enemyState)) {
      enemyTurn(enemyState, playerState, context, logs);
    }
  } else {
    enemyTurn(enemyState, playerState, context, logs);
    if (!isDead(playerState)) {
      playerTurn(playerState, enemyState, context, logs, playerAction);
    }
  }

  const outcome = checkOutcome(playerState, enemyState);

  return {
    playerState,
    enemyState,
    context,
    logs,
    outcome
  };
}

// --------------------------------------------------
// Turn handlers
// --------------------------------------------------
function playerTurn(player, enemy, context, logs, action) {
  if (!action) {
    action = { type: "basic" };
  }

  switch (action.type) {
    case "basic":
      basicAttack(player, enemy, context, logs, true);
      break;

    case "ability":
      useAbility(player, enemy, context, logs, action.key, true);
      break;

    case "ultimate":
      useUltimate(player, enemy, context, logs);
      break;

    case "item":
      useItem(player, enemy, context, logs, action.itemId);
      break;

    case "flee":
      attemptFlee(player, enemy, context, logs);
      break;

    default:
      basicAttack(player, enemy, context, logs, true);
      break;
  }

  player.lastAction = action;
  player.lastActionType = action.type;
}

function enemyTurn(enemy, player, context, logs) {
  if (isDead(enemy) || isDead(player)) return;

  let action = null;

  // Boss pattern hooks could go here if you want
  action = resolveEnemyAction(enemy, player, context);

  if (!action) {
    action = { type: "basic" };
  }

  switch (action.type) {
    case "ability":
      useAbility(enemy, player, context, logs, action.abilityKey || action.key, false);
      break;

    case "basic":
    default:
      basicAttack(enemy, player, context, logs, false);
      break;
  }

  enemy.lastAction = action;
  enemy.lastActionType = action.type;
}

// --------------------------------------------------
// Actions
// --------------------------------------------------
function basicAttack(attacker, defender, context, logs, isPlayer) {
  const hitData = resolveHitAndCrit(attacker, defender, context);

  if (!hitData.hit) {
    logs.push(`${attacker.name} misses ${defender.name}!`);
    return;
  }

  const base = Math.max(1, (attacker.atk || 1) - (defender.def || 0));
  let dmg = Math.floor(base * hitData.damageMult);

  if (dmg <= 0) {
    logs.push(`${defender.name}'s defenses negate the blow.`);
    return;
  }

  defender.hpCurrent = Math.max(0, defender.hpCurrent - dmg);

  let line = `${attacker.name} hits ${defender.name} for ${dmg} damage`;
  if (hitData.isCrit) line += " (CRITICAL!)";
  line += ".";
  logs.push(line);

  if (defender.hpCurrent <= 0) {
    logs.push(`${defender.name} is defeated!`);
  }

  // Simple ult charge on basic
  if (isPlayer) {
    attacker.ultimateCharge = (attacker.ultimateCharge || 0) + 10;
  }
}

function useAbility(attacker, defender, context, logs, key, isPlayer) {
  if (!key) {
    logs.push(`${attacker.name} fumbles and does nothing.`);
    return;
  }

  const ability = (attacker.abilities || []).find(a => a.key === key);
  if (!ability) {
    logs.push(`${attacker.name} tries to use an unknown ability.`);
    return;
  }

  logs.push(`${attacker.name} uses **${ability.name}**!`);
  executeAbility(attacker, defender, ability, context, logs, isPlayer);
}

function useUltimate(attacker, defender, context, logs) {
  const charge = attacker.ultimateCharge || 0;
  const required = attacker.ultimateChargeRequired || 100;

  if (charge < required) {
    logs.push("Ultimate not ready!");
    return;
  }

  const ult = attacker.ultimate;
  if (!ult) {
    logs.push("No ultimate ability set.");
    return;
  }

  logs.push(`${attacker.name} unleashes their ULTIMATE: **${ult.name}**!`);
  executeAbility(attacker, defender, ult, context, logs, attacker.isPlayer);

  attacker.ultimateCharge = 0;
}

function useItem(player, enemy, context, logs, itemId) {
  const inv = player.inventory || [];
  const item = inv.find(i => i.id === itemId);

  if (!item) {
    logs.push("Item not found.");
    return;
  }

  logs.push(`${player.name} uses **${item.name}**.`);

  // Simple example: healing potion
  if (item.type === "heal") {
    const amount = item.amount || 20;
    player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + amount);
    logs.push(`${player.name} recovers ${amount} HP.`);
  }

  item.qty = (item.qty || 1) - 1;
  if (item.qty <= 0) {
    const idx = inv.indexOf(item);
    if (idx >= 0) inv.splice(idx, 1);
  }
}

function attemptFlee(player, enemy, context, logs) {
  const chance = 0.35; // tune later
  if (Math.random() < chance) {
    logs.push(`${player.name} successfully flees from ${enemy.name}!`);
    enemy.hpCurrent = 0; // treat as end of combat
  } else {
    logs.push(`${player.name} fails to flee!`);
  }
}

// --------------------------------------------------
// Outcome helpers
// --------------------------------------------------
function isDead(entity) {
  return !entity || entity.hpCurrent <= 0;
}

function checkOutcome(player, enemy) {
  if (player.hpCurrent <= 0 && enemy.hpCurrent <= 0) return "draw";
  if (player.hpCurrent <= 0) return "defeat";
  if (enemy.hpCurrent <= 0) return "victory";
  return null;
}

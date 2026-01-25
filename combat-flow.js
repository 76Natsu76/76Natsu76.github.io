/****************************************************
 * CORE COMBAT FLOW
 ****************************************************/

var MAX_ROUNDS = 50;

// Simple event logger used by variant hooks, etc.
function logEvent(context, type, payload) {
  context.events = context.events || [];
  context.events.push({
    type: type,
    ts: new Date().toISOString(),
    payload: payload || {}
  });
}

// --------------------------------------------------
// ENTRY POINT: one-shot combat run
// --------------------------------------------------
function startCombat(username, regionKey) {
  // 1. Load + resolve player
  var rawPlayer = loadPlayerRecord(username); // your existing loader
  if (!rawPlayer) {
    throw new Error("Player not found: " + username);
  }

  var playerState = resolvePlayer(rawPlayer);

  // 2. Resolve encounter + enemy
  var encounter = resolveEncounter(regionKey, playerState);
  var enemyState = resolveEnemy(encounter.enemy, encounter); // from resolveEnemy.js

  // 3. Build environment context + apply modifiers
  var context = prepareCombatEnvironment(regionKey, playerState, enemyState);
  context.regionKey = regionKey;
  context.biomeKey = encounter.biome || null;
  context.weatherKey = encounter.weather || null;
  context.eventKey = encounter.event || null;

  var logs = [];
  context.logs = logs;

  logs.push("You encounter " + enemyState.name + " in the " + regionKey + "!");

  applyAllModifiers(context, playerState, enemyState);

  // 4. Environmental hazards at start
  if (encounter.hazard) {
    applyHazardEffect(encounter.hazard, playerState, enemyState, logs);
  }

  // 5. Run the combat loop
  var result = runCombatInternal(playerState, enemyState, context, logs);

  // 6. Persist combat snapshot (optional)
  saveCombatState(username, {
    player: playerState,
    enemy: enemyState,
    context: {
      regionKey: context.regionKey,
      biomeKey: context.biomeKey,
      weatherKey: context.weatherKey,
      eventKey: context.eventKey
    },
    outcome: result.outcome
  });

  return {
    success: true,
    outcome: result.outcome,
    logs: logs,
    playerState: playerState,
    enemyState: enemyState,
    encounter: encounter
  };
}

// --------------------------------------------------
// MAIN LOOP
// --------------------------------------------------
function runCombatInternal(playerState, enemyState, context, logs) {
  var round = 1;

  while (round <= MAX_ROUNDS &&
         playerState.hpCurrent > 0 &&
         enemyState.hpCurrent > 0) {

    logs.push("— Round " + round + " —");

    // 1. Tick status effects
    tickStatusEffects(playerState, context, logs);
    tickStatusEffects(enemyState, context, logs);

    if (playerState.hpCurrent <= 0 || enemyState.hpCurrent <= 0) break;

    // 2. Crowd control checks
    var playerCC = crowdControlCheck(playerState, logs);
    var enemyCC  = crowdControlCheck(enemyState, logs);

    // 3. Turn order by speed
    var first = playerState.speed >= enemyState.speed ? "player" : "enemy";

    if (first === "player") {
      if (!playerCC.stunned && !playerCC.feared && playerState.hpCurrent > 0) {
        executePlayerTurn(playerState, enemyState, context, logs);
      }
      if (enemyState.hpCurrent > 0 && !enemyCC.stunned && !enemyCC.feared) {
        executeEnemyTurn(enemyState, playerState, context, logs);
      }
    } else {
      if (!enemyCC.stunned && !enemyCC.feared && enemyState.hpCurrent > 0) {
        executeEnemyTurn(enemyState, playerState, context, logs);
      }
      if (playerState.hpCurrent > 0 && !playerCC.stunned && !playerCC.feared) {
        executePlayerTurn(playerState, enemyState, context, logs);
      }
    }

    if (playerState.hpCurrent <= 0 || enemyState.hpCurrent <= 0) break;

    // 4. Mid-combat flavor (variant, weather, biome, boss, etc.)
    var variantLine = maybeGetVariantMidCombatFlavor(context, enemyState);
    if (variantLine) logs.push(variantLine);

    round++;
  }

  var outcome = "draw";
  if (playerState.hpCurrent <= 0 && enemyState.hpCurrent > 0) outcome = "defeat";
  else if (enemyState.hpCurrent <= 0 && playerState.hpCurrent > 0) outcome = "victory";

  logs.push("Combat ends: " + outcome.toUpperCase() + ".");

  return { outcome: outcome, rounds: round };
}

// --------------------------------------------------
// PLAYER TURN (placeholder: basic attack or queued ability)
// --------------------------------------------------
function executePlayerTurn(player, enemy, context, logs) {
  // If you later add interactive turns, read player.pendingAction here.
  var action = { type: "basic" };

  context.lastPlayerActionType = action.type;

  switch (action.type) {
    case "ability":
      resolveAbilityUse(player, enemy, action.ability, context, logs, true);
      break;

    case "basic":
    default:
      basicAttack(player, enemy, context, logs, true);
      break;
  }

  player.lastAction = action;
  player.lastActionType = action.type;
}

// --------------------------------------------------
// ENEMY TURN (driven by enemy-ai.js / boss patterns)
// --------------------------------------------------
function executeEnemyTurn(enemy, player, context, logs) {
  var action = null;

  // 1. Boss combo / pattern hook
  if (enemy.tags && enemy.tags.indexOf("boss") !== -1) {
    var combo = resolveBossCombo(enemy, player, enemy.abilities);
    if (combo) action = combo;
    else {
      var patterns = getBossPatterns(enemy);
      // Simple example: always use phase1[0]
      var step = patterns.phase1[0];
      action = resolvePatternStep(step, enemy, player, enemy.abilities);
    }
  }

  // 2. Fallback to AI resolver
  if (!action) {
    action = resolveEnemyAction(enemy, player, context); // from enemy-ai.js
  }

  if (!action) {
    // Final fallback: basic attack
    action = { type: "basic" };
  }

  context.lastEnemyAction = action;

  switch (action.type) {
    case "ability":
      resolveAbilityUse(enemy, player, action.ability, context, logs, false);
      break;

    case "basic":
    default:
      basicAttack(enemy, player, context, logs, false);
      break;
  }
}

// --------------------------------------------------
// BASIC ATTACK
// --------------------------------------------------
function basicAttack(attacker, defender, context, logs, isPlayer) {
  var hitData = resolveHitAndCrit(attacker, defender, context);

  if (!hitData.hit) {
    logs.push((attacker.name || "Attacker") + " misses " + (defender.name || "the target") + "!");
    return;
  }

  var base = Math.max(1, (attacker.atk || 1) - (defender.def || 0));
  var dmg = Math.floor(base * hitData.damageMult);

  // Weather multiplier
  if (context.weatherKey) {
    var wMult = getWeatherDamageMultiplier(attacker, defender, context.weatherKey);
    dmg = Math.floor(dmg * wMult);
  }

  // Shields
  dmg = applyShieldReduction(defender, dmg, logs);

  if (dmg <= 0) {
    logs.push((defender.name || "Defender") + "'s defenses negate the blow.");
    return;
  }

  defender.hpCurrent = Math.max(0, defender.hpCurrent - dmg);

  var line = (attacker.name || "Attacker") + " hits " +
             (defender.name || "the target") + " for " + dmg + " damage";
  if (hitData.isCrit) line += " (CRITICAL!)";
  line += ".";
  logs.push(line);

  if (defender.hpCurrent <= 0) {
    logs.push((defender.name || "The foe") + " is defeated!");
  }
}

// --------------------------------------------------
// ABILITY USE (thin wrapper; your ability engine plugs here)
// --------------------------------------------------
function resolveAbilityUse(attacker, defender, ability, context, logs, isPlayer) {
  if (!ability) {
    basicAttack(attacker, defender, context, logs, isPlayer);
    return;
  }

  // You already have a modern ability resolver in the new engine;
  // call into it here, e.g.:
  //
  //   executeAbility(attacker, defender, ability, context, logs);
  //
  // For now, just log a stub:
  logs.push((attacker.name || "Attacker") + " uses " + ability.name + "!");
  // TODO: wire to real ability resolution.
}

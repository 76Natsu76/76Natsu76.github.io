// boss-combat.js
// Handles world boss combat logic: phases, enrage, and AI integration.

import { WORLD_BOSSES } from "./boss-definitions.js";
import { chooseBossActionV3 } from "./enemy-ai.js";
import { addRegionHistory, getWorldState } from "./world-state.js";
import { addGlobalAnnouncement, getWorldState } from "./world-state.js";
import { WORLD_DATA } from "./world-data.js";

// ------------------------------------------------------------
// MAIN ENTRY: Called each boss turn
// ------------------------------------------------------------
export function runBossTurn(encounter, boss, player, logs) {
  if (!encounter.isBossEncounter) {
    throw new Error("runBossTurn called on non-boss encounter.");
  }

  // Update phase based on HP
  updateBossPhase(encounter, boss, logs);

  // Check enrage
  updateBossEnrage(encounter, boss, logs);

  // Build AI context
  const context = {
    lastPlayerActionType: player.lastActionType || null,
    phase: encounter.phase,
    enrageActive: boss.enrageActive || false
  };

  // Let the AI choose the action
  const action = chooseBossActionV3(boss, player, context, logs);

  // Track last action for anti-repeat logic
  if (action?.ability?.key) {
    boss.lastBossAction = action.ability.key;
  }

  return action;
}

// ------------------------------------------------------------
// PHASE MANAGEMENT
// ------------------------------------------------------------
function updateBossPhase(encounter, boss, logs) {
  const hpPct = boss.hp / boss.hpMax;
  const phases = encounter.phases.length;

  // Phase index is 0-based
  let newPhase =
    hpPct > 0.70 ? 0 :
    hpPct > 0.40 ? 1 :
    hpPct > 0.20 ? 2 :
                   3;

  // Clamp to available phases
  if (newPhase >= phases) newPhase = phases - 1;

  if (newPhase !== encounter.phase) {
    encounter.phase = newPhase;

    logs.push({
      type: "boss_phase",
      text: `${boss.name} enters Phase ${newPhase + 1}: ${encounter.phases[newPhase].name}!`
    });
  }
}

// ------------------------------------------------------------
// ENRAGE MANAGEMENT
// ------------------------------------------------------------
function updateBossEnrage(encounter, boss, logs) {
  const def = WORLD_BOSSES[boss.key];
  if (!def?.enrage) return;

  const hpPct = boss.hp / boss.hpMax;

  if (!boss.enrageActive && hpPct <= def.enrage.threshold) {
    boss.enrageActive = true;

    logs.push({
      type: "boss_enrage",
      text: `${boss.name} becomes ENRAGED!`
    });

    // Optional: apply enrage buff
    boss.atk = Math.floor(boss.atk * 1.25);
    boss.def = Math.floor(boss.def * 1.15);
  }
}

// ------------------------------------------------------------
// BOSS DEFEAT HANDLER
// ------------------------------------------------------------

export function handleBossDeath(encounter, regionKey, logs) {
  const world = getWorldState();
  const region = world.regions[regionKey];

  if (!region) return;
  
  region.worldBossActive = false;
  region.worldBossAwakening = null;
  region.worldBossDefeated = true;

  logs.push({
    type: "boss_defeated",
    text: `${encounter.bossName} has been defeated!`
  });

  addGlobalAnnouncement("boss_defeated", `${encounter.bossName} has fallen in ${regionKey}!`);
  
  addRegionHistory(
    regionKey,
    "boss_defeated",
    `${encounter.bossName} has fallen!`
  );

  // REGION UNLOCK LOGIC
  const unlockRules = WORLD_DATA.regions[regionKey]?.unlock;
  if (unlockRules?.requiresBossClear) {
    region.unlocked = true;
    addGlobalAnnouncement("region_unlocked", `${regionKey} is now unlocked!`);
  }
}

// ------------------------------------------------------------
// BOSS INTRO FLAVOR
// ------------------------------------------------------------
export function getBossIntro(encounter) {
  const boss = WORLD_BOSSES[encounter.bossKey];
  if (!boss) return "";

  return `${boss.name} emerges! ${boss.flavor}`;
}

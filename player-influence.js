// player-influence.js
// 3F-7 Step 8: Player Influence & Region Recovery

import { getRegionState } from "./world-state.js";

export const PlayerInfluence = {
  applyCombatVictory,
  applyDungeonClear,
  applyCrisisIntervention,
  applyFactionShift
};

// ---------------------------------------------
// Player wins a normal encounter
// ---------------------------------------------
function applyCombatVictory(regionKey, difficultyScore = 1) {
  const r = getRegionState(regionKey);
  if (!r) return;

  // Reduce danger slightly
  r.dangerLevel -= 0.02 * difficultyScore;

  // Increase stability
  r.stability += 0.03 * difficultyScore;

  // Reduce elemental charge slightly
  for (const elem of Object.keys(r.elementalCharge)) {
    r.elementalCharge[elem] *= 0.98;
  }

  clampRegion(r);
}

// ---------------------------------------------
// Player clears a dungeon run
// ---------------------------------------------
function applyDungeonClear(regionKey, wavesCleared = 3) {
  const r = getRegionState(regionKey);
  if (!r) return;

  // Stronger impact than normal combat
  r.dangerLevel -= 0.05 * wavesCleared;
  r.stability += 0.08 * wavesCleared;

  // Reduce crisis pressure
  if (r.crisis) {
    r.crisisStageIndex = Math.max(0, r.crisisStageIndex - 1);
  }

  clampRegion(r);
}

// ---------------------------------------------
// Player completes a crisis-related event
// ---------------------------------------------
function applyCrisisIntervention(regionKey, strength = 1) {
  const r = getRegionState(regionKey);
  if (!r) return;

  if (r.crisis) {
    r.crisisStageIndex = Math.max(0, r.crisisStageIndex - strength);
    if (r.crisisStageIndex === 0) {
      // Crisis resolved
      r.crisis = null;
      r.crisisStartedAt = null;
    }
  }

  r.dangerLevel -= 0.1 * strength;
  r.stability += 0.15 * strength;

  clampRegion(r);
}

// ---------------------------------------------
// Player shifts faction influence
// ---------------------------------------------
function applyFactionShift(regionKey, factionId, delta) {
  const r = getRegionState(regionKey);
  if (!r) return;

  const current = r.factionControl[factionId] || 0;
  r.factionControl[factionId] = Math.max(0, current + delta);

  // Faction shifts affect danger/stability
  if (delta > 0) {
    r.stability += 0.02 * delta;
  } else {
    r.dangerLevel += 0.02 * Math.abs(delta);
  }

  clampRegion(r);
}

// ---------------------------------------------
// Helper: clamp values
// ---------------------------------------------
function clampRegion(r) {
  r.dangerLevel = Math.max(0.5, Math.min(5.0, r.dangerLevel));
  r.stability = Math.max(0.0, Math.min(2.0, r.stability));

  for (const key of Object.keys(r.elementalCharge)) {
    r.elementalCharge[key] = Math.max(0, Math.min(10, r.elementalCharge[key]));
  }
}

// world-state.js
// 3F-7: Environmental World States + Crisis Escalation

import { WORLD_DATA } from "./world-data.js";
import { CRISIS_DEFINITIONS } from "./crisis-definitions.js";
import { REGION_DRIFT } from "./region-drift-definitions.js"
import { SEASONS, SEASON_DEFINITIONS } from "./season-definitions.js";

// ------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------
const _worldState = {
  season: "spring",
  seasonStartedAt: Date.now(),
  day: 1,
  regions: {
    // [regionKey]: { ...see ensureRegion }
  }
};

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
export function initWorldState() {
  for (const regionKey of Object.keys(WORLD_DATA.regions || {})) {
    ensureRegion(regionKey);
  }
  return _worldState;
}

// ------------------------------------------------------------
// BASIC GETTERS
// ------------------------------------------------------------
export function getWorldState() {
  return _worldState;
}

export function getRegionState(regionKey) {
  return _worldState.regions[regionKey] || null;
}

export function getSeason() {
  return _worldState.season;
}

// ------------------------------------------------------------
// SEASON / GLOBAL CYCLE
// ------------------------------------------------------------

export function advanceDay() {
  _worldState.day += 1;
  return _worldState.day;
}

export function getCurrentSeason() {
  return _worldState.season;
}

export function setSeason(seasonKey) {
  if (!SEASONS.includes(seasonKey)) return;
  _worldState.season = seasonKey;
  _worldState.seasonStartedAt = Date.now();
}

export function advanceSeasonIfNeeded() {
  const current = _worldState.season;
  const def = SEASON_DEFINITIONS[current];
  if (!def) return current;

  const elapsed = Date.now() - _worldState.seasonStartedAt;
  if (elapsed >= def.durationMs) {
    const idx = SEASONS.indexOf(current);
    const next = SEASONS[(idx + 1) % SEASONS.length];
    setSeason(next);
  }

  return _worldState.season;
}

// ------------------------------------------------------------
// REGION CRISIS + ESCALATION
// ------------------------------------------------------------
export function setRegionCrisis(regionKey, crisisId, stageIndex = 0) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];

  r.crisis = crisisId;
  r.crisisStageIndex = stageIndex;
  r.crisisStartedAt = Date.now();
  r.lastUpdated = Date.now();
  
  addRegionHistory(regionKey, "crisis_start", `Crisis '${crisisId}' has begun.`, {
    crisisId,
    stage: stageIndex
  });

  applyCrisisStageEffects(regionKey);
}

export function clearRegionCrisis(regionKey) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.crisis = null;
  r.crisisStageIndex = 0;
  r.crisisStartedAt = null;
  r.dangerLevel = 1.0;
}

export function escalateRegionCrisis(regionKey, delta = 1) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  if (!r.crisis) return null;

  const def = CRISIS_DEFINITIONS[r.crisis];
  if (!def) return null;

  const maxIndex = def.stages.length - 1;
  r.crisisStageIndex = Math.max(0, Math.min(maxIndex, (r.crisisStageIndex || 0) + delta));
  r.crisisStartedAt = Date.now();
  r.lastUpdated = Date.now();

  addRegionHistory(regionKey, "crisis_escalate", `Crisis '${r.crisis}' escalated to stage ${r.crisisStageIndex + 1}.`);

  applyCrisisStageEffects(regionKey);
  return r.crisisStageIndex;
}

// ------------------------------------------------------------
// REGION DIFFICULTY
// ------------------------------------------------------------
export function setRegionDifficultyOffset(regionKey, offset) {
  ensureRegion(regionKey);
  _worldState.regions[regionKey].difficultyOffset = offset;
}

export function adjustRegionDifficultyOffset(regionKey, delta) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.difficultyOffset = (r.difficultyOffset || 0) + delta;
  return r.difficultyOffset;
}

// ------------------------------------------------------------
// FACTION INFLUENCE
// ------------------------------------------------------------
export function setFactionInfluence(regionKey, factionId, value) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.factionControl[factionId] = value;
}

export function adjustFactionInfluence(regionKey, factionId, delta) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  const current = r.factionControl[factionId] || 0;
  r.factionControl[factionId] = current + delta;
  return r.factionControl[factionId];
}

// ------------------------------------------------------------
// OVERLAYS
// ------------------------------------------------------------
export function addRegionOverlay(regionKey, overlayKey) {
  ensureRegion(regionKey);
  _worldState.regions[regionKey].overlays[overlayKey] = true;
}

export function removeRegionOverlay(regionKey, overlayKey) {
  ensureRegion(regionKey);
  delete _worldState.regions[regionKey].overlays[overlayKey];
}

export function hasRegionOverlay(regionKey, overlayKey) {
  const r = getRegionState(regionKey);
  return !!r?.overlays?.[overlayKey];
}

// ------------------------------------------------------------
// PERSISTENT MODIFIERS
// ------------------------------------------------------------
export function addRegionModifier(regionKey, modifier) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  if (!r.persistentModifiers.find(m => m.id === modifier.id)) {
    r.persistentModifiers.push(modifier);
  }
}

export function removeRegionModifier(regionKey, modifierId) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.persistentModifiers = r.persistentModifiers.filter(m => m.id !== modifierId);
}

export function getRegionModifiers(regionKey) {
  const r = getRegionState(regionKey);
  return r ? r.persistentModifiers || [] : [];
}

export function applyRegionDrift(regionKey) {
  const r = _worldState.regions[regionKey];
  if (!r) return;

  // Natural recovery if no crisis
  if (!r.crisis) {
    r.dangerLevel -= 0.01;     // slow recovery
    r.stability += 0.02;       // slow stabilization
  }

  const season = _worldState.season;
  const seasonBias = REGION_DRIFT.seasonBias[season] || {};

  // --- BASE DECAY ---
  r.dangerLevel += REGION_DRIFT.baseDecay.danger;
  r.stability += REGION_DRIFT.baseDecay.stability;

  // Elemental decay
  for (const key of Object.keys(r.elementalCharge)) {
    r.elementalCharge[key] += REGION_DRIFT.baseDecay.elemental;
  }

  // --- CRISIS PRESSURE ---
  if (r.crisis) {
    const stage = r.crisisStageIndex || 0;
    const crisisMult = stage + 1;

    r.dangerLevel += REGION_DRIFT.crisisPressure.danger * crisisMult;
    r.stability += REGION_DRIFT.crisisPressure.stability * crisisMult;
  }

  // --- SEASONAL BIAS ---
  if (seasonBias.danger) r.dangerLevel += seasonBias.danger;
  if (seasonBias.stability) r.stability += seasonBias.stability;

  if (seasonBias.elemental) {
    for (const [elem, amt] of Object.entries(seasonBias.elemental)) {
      r.elementalCharge[elem] = (r.elementalCharge[elem] || 0) + amt;
    }
  }

  // --- FACTION PRESSURE ---
  for (const [factionId, influence] of Object.entries(r.factionControl)) {
    const fp = REGION_DRIFT.factionPressure[factionId];
    if (!fp) continue;

    r.dangerLevel += fp.danger * influence;
    r.stability += fp.stability * influence;
  }

  // --- CLAMP VALUES ---
  r.dangerLevel = Math.max(0.5, Math.min(5.0, r.dangerLevel));
  r.stability = Math.max(0.0, Math.min(2.0, r.stability));

  for (const key of Object.keys(r.elementalCharge)) {
    r.elementalCharge[key] = Math.max(0, Math.min(10, r.elementalCharge[key]));
  }

  r.lastUpdated = Date.now();
}


// ------------------------------------------------------------
// WORLD TICK (Crisis progression hook)
// ------------------------------------------------------------
export function worldTick() {
  const now = Date.now();

  for (const [regionKey, r] of Object.entries(_worldState.regions)) {
    if (!r.crisis) continue;

    const def = CRISIS_DEFINITIONS[r.crisis];
    if (!def) continue;

    const stageIdx = r.crisisStageIndex || 0;
    const stageDuration = def.stageDurationMs || 0;
    const elapsed = now - (r.crisisStartedAt || now);

    if (stageDuration > 0 && elapsed >= stageDuration && stageIdx < def.stages.length - 1) {
      r.crisisStageIndex = stageIdx + 1;
      r.crisisStartedAt = now;
      applyCrisisStageEffects(regionKey);
    }
    
    // If stability is high enough, crisis may resolve
    if (r.crisis && r.stability > 1.5) {
      r.crisisStageIndex -= 1;
      if (r.crisisStageIndex <= 0) {
        r.crisis = null;
        r.crisisStartedAt = null;
      }
      addRegionHistory(regionKey, "crisis_resolved", `Crisis '${r.crisis}' has been resolved.`);
    }
  }

  // Apply region drift to all regions
  for (const regionKey of Object.keys(_worldState.regions)) {
    applyRegionDrift(regionKey);
  }

  advanceSeasonIfNeeded();
  _worldState.day += 1;
  return _worldState;
}

// ------------------------------------------------------------
// INTERNAL: APPLY CRISIS STAGE EFFECTS
// ------------------------------------------------------------
function applyCrisisStageEffects(regionKey) {
  const r = _worldState.regions[regionKey];
  if (!r || !r.crisis) return;

  const def = CRISIS_DEFINITIONS[r.crisis];
  if (!def) return;

  const stage = def.stages[r.crisisStageIndex || 0];
  if (!stage) return;

  r.dangerLevel = stage.dangerMult || 1.0;
  r.lastUpdated = Date.now();
}

// ------------------------------------------------------------
// HELPER
// ------------------------------------------------------------
function ensureRegion(regionKey) {
  if (!_worldState.regions[regionKey]) {
    _worldState.regions[regionKey] = {
      crisis: null,
      crisisStageIndex: 0,
      crisisStartedAt: null,

      difficultyOffset: 0,
      factionControl: {},
      overlays: {},
      persistentModifiers: [],

      weather: "clear",
      season: null,
      dangerLevel: 1.0,
      stability: 1.0,
      elementalCharge: { fire: 0, frost: 0, void: 0 },
      lastUpdated: Date.now(),
      history: [
          // { timestamp, type, message, data }
      ]
    };
  }
}

export function addRegionHistory(regionKey, type, message, data = {}) {
  const r = _worldState.regions[regionKey];
  if (!r) return;

  r.history.push({
    timestamp: Date.now(),
    type,
    message,
    data
  });

  // Optional: cap history length
  if (r.history.length > 200) {
    r.history.shift();
  }
}


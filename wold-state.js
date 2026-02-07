// world-state.js
// 3F-7: Environmental World States (Scaffold)
// Region-wide states, crises, seasons, persistent modifiers, overlays, difficulty, factions.

import { WORLD_DATA } from "./world-data.js";

// ------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------
const _worldState = {
  // Global season / cycle
  season: "neutral",          // e.g. "spring", "summer", "autumn", "winter", "eclipse", etc.
  day: 1,                     // optional: world day counter

  // Region-specific state
  regions: {
    // [regionKey]: {
    //   crisis: null | "beastUprising" | "voidRift" | ...
    //   crisisLevel: 0-3 (escalation)
    //   difficultyOffset: 0 (global tuning per region)
    //   factionControl: { [factionId]: influenceScore }
    //   overlays: { [overlayKey]: true }  // e.g. "blight", "blizzard", "siege"
    //   persistentModifiers: [ { id, type, data } ]
    // }
  }
};

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
export function initWorldState() {
  // Seed region entries from WORLD_DATA if not present
  for (const regionKey of Object.keys(WORLD_DATA.regions || {})) {
    if (!_worldState.regions[regionKey]) {
      _worldState.regions[regionKey] = {
        crisis: null,
        crisisLevel: 0,
        difficultyOffset: 0,
        factionControl: {},
        overlays: {},
        persistentModifiers: []
      };
    }
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
export function setSeason(seasonKey) {
  _worldState.season = seasonKey;
}

export function advanceDay() {
  _worldState.day += 1;
  return _worldState.day;
}

// ------------------------------------------------------------
// REGION CRISIS + ESCALATION
// ------------------------------------------------------------
export function setRegionCrisis(regionKey, crisisKey, level = 1) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.crisis = crisisKey;
  r.crisisLevel = level;
}

export function clearRegionCrisis(regionKey) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.crisis = null;
  r.crisisLevel = 0;
}

export function escalateRegionCrisis(regionKey, delta = 1) {
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  r.crisisLevel = Math.max(0, (r.crisisLevel || 0) + delta);
  return r.crisisLevel;
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
// OVERLAYS (WORLD-MAP FLAGS)
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
  // modifier: { id, type, data }
  ensureRegion(regionKey);
  const r = _worldState.regions[regionKey];
  // prevent duplicates by id
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

// ------------------------------------------------------------
// TICK / WORLD UPDATE HOOK
// ------------------------------------------------------------
export function worldTick() {
  // Placeholder for future: decay crises, rotate seasons, move faction lines, etc.
  // For now, just advance the day.
  advanceDay();
  return _worldState;
}

// ------------------------------------------------------------
// HELPER
// ------------------------------------------------------------
function ensureRegion(regionKey) {
  if (!_worldState.regions[regionKey]) {
    _worldState.regions[regionKey] = {
      crisis: null,
      crisisLevel: 0,
      difficultyOffset: 0,
      factionControl: {},
      overlays: {},
      persistentModifiers: [],
    
      // NEW 3F‑7 fields:
      weather: "clear",
      season: null, // will be inherited from global season unless overridden
      dangerLevel: 1.0,
      stability: 1.0,
      elementalCharge: { fire: 0, frost: 0, void: 0 },
      lastUpdated: Date.now()
    };
  }
}

/*
regionState = {
  weather: "storm",
  season: "spring",
  crisis: null,
  dangerLevel: 1.0,
  stability: 1.0,
  elementalCharge: { fire: 0, frost: 0, void: 0 },
  lastUpdated: timestamp
}

CRISIS_DEFINITIONS = {
  undead: {
    stages: [
      { id: "undeadRising", danger: 1.1, familyMult: { undead: 1.3 } },
      { id: "undeadSurge", danger: 1.3, familyMult: { undead: 1.6 } },
      { id: "necropolisBloom", danger: 1.6, familyMult: { undead: 2.0 } },
      { id: "collapse", danger: 1.2 },
      { id: "recovery", danger: 0.9 }
    ],
    duration: 3 * 60 * 60 * 1000 // 3 hours per stage
  }
}

SEASONS = ["spring", "summer", "autumn", "winter"];*/

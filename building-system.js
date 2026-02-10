// building-system.js
import { getWorldState } from "./world-state.js";
import { BUILDINGS_BY_SETTLEMENT } from "./building-definitions.js";

export function getBuildingsForSettlement(settlementKey) {
  return BUILDINGS_BY_SETTLEMENT[settlementKey] || [];
}

export function ensureBuildingState(settlementKey) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  if (!settlement) return null;

  settlement.buildingState = settlement.buildingState || {};
  return settlement.buildingState;
}

export function getBuildingState(settlementKey, buildingId) {
  const state = ensureBuildingState(settlementKey);
  state[buildingId] = state[buildingId] || {
    discovered: false,
    searched: false,
    customFlags: {}
  };
  return state[buildingId];
}

export function isBuildingLocked(settlementKey, buildingDef, player) {
  const state = getBuildingState(settlementKey, buildingDef.id);
  if (!buildingDef.locked) return false;
  // Future: keys, perks, etc.
  return !state.unlocked;
}

export function unlockBuilding(settlementKey, buildingId) {
  const state = getBuildingState(settlementKey, buildingId);
  state.unlocked = true;
}

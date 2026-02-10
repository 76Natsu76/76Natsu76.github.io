// building-interaction.js
import { getBuildingsForSettlement, isBuildingLocked, getBuildingState } from "./building-system.js";
import { renderInterior } from "./interior-renderer.js";
import { reportCrime, CRIME_TYPES } from "./crime-system.js";

export function listEnterableBuildings(settlementKey, player) {
  const defs = getBuildingsForSettlement(settlementKey);
  return defs.map(def => {
    const locked = isBuildingLocked(settlementKey, def, player);
    return { ...def, locked };
  });
}

export function enterBuilding(settlementKey, buildingId, player) {
  const defs = getBuildingsForSettlement(settlementKey);
  const def = defs.find(b => b.id === buildingId);
  if (!def) return { ok: false, reason: "Unknown building" };

  const locked = isBuildingLocked(settlementKey, def, player);
  if (locked) {
    if (def.trespassCrime) {
      reportCrime(player, settlementKey, CRIME_TYPES.TRESPASS, 1);
    }
    return { ok: false, reason: "Locked" };
  }

  const state = getBuildingState(settlementKey, buildingId);
  state.discovered = true;

  renderInterior(settlementKey, def, state, player);
  return { ok: true };
}

export function searchBuilding(settlementKey, buildingId, player) {
  const state = getBuildingState(settlementKey, buildingId);
  if (state.searched) {
    return { ok: false, reason: "Already searched" };
  }

  state.searched = true;

  // Placeholder: later hook into loot tables
  return {
    ok: true,
    loot: []
  };
}

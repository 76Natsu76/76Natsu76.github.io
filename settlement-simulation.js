// settlement-simulation.js

import { getWorldState, addRegionHistory } from "./world-state.js";
import { SETTLEMENTS } from "./settlement-definitions.js";

export function tickSettlements() {
  const world = getWorldState();

  for (const key in SETTLEMENTS) {
    const def = SETTLEMENTS[key];
    const state = world.settlements[key];
    const region = world.regions[def.region];

    if (!state || !region) continue;

    // Morale reacts to crises
    if (region.crisis) {
      state.morale -= 0.01;
    } else {
      state.morale += 0.005;
    }

    // Morale reacts to boss activity
    if (region.worldBossActive) {
      state.morale -= 0.02;
    }

    if (region.worldBossDefeated) {
      state.morale += 0.03;
    }

    // Prosperity reacts to stability
    state.prosperity += (region.stability - 1.0) * 0.01;

    // Clamp values
    state.morale = Math.max(0.2, Math.min(2.0, state.morale));
    state.prosperity = Math.max(0.2, Math.min(2.0, state.prosperity));

    state.lastUpdated = Date.now();
  }
}

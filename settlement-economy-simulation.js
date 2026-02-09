// settlement-economy-simulation.js

import { getWorldState } from "./world-state.js";
import { NPC_JOBS } from "./npc-jobs.js";

export function tickSettlementEconomy() {
  const world = getWorldState();

  for (const key in world.settlements) {
    const settlement = world.settlements[key];
    const region = world.regions[SETTLEMENTS[key].region];

    // Initialize if missing
    settlement.economy.resources ||= {};
    settlement.economy.gold ||= 0;

    // NPC production & consumption
    for (const npc of settlement.npcs) {
      const job = NPC_JOBS[npc.template];
      if (!job) continue;

      // Production
      for (const res in job.produces) {
        settlement.economy.resources[res] =
          (settlement.economy.resources[res] || 0) + job.produces[res];
      }

      // Consumption
      for (const res in job.consumes) {
        settlement.economy.resources[res] =
          (settlement.economy.resources[res] || 0) - job.consumes[res];
      }
    }

    // Prosperity affects production
    for (const res in settlement.economy.resources) {
      settlement.economy.resources[res] *= settlement.prosperity;
    }

    // Crisis reduces production
    if (region.crisis) {
      for (const res in settlement.economy.resources) {
        settlement.economy.resources[res] *= 0.8;
      }
    }

    // Boss active reduces production
    if (region.worldBossActive) {
      for (const res in settlement.economy.resources) {
        settlement.economy.resources[res] *= 0.9;
      }
    }

    settlement.lastUpdated = Date.now();
  }
}

// global-simulation.js
// 3G: Global Simulation Layer

import { getWorldState, addRegionHistory } from "./world-state.js";

export const GlobalSim = {
  tick,
  spawnWeatherFront,
  spawnMigration,
  spawnAnomaly
};

function tick() {
  const world = getWorldState();
  const now = Date.now();

  // Only update every X minutes
  if (now - world.global.lastGlobalUpdate < 10 * 60 * 1000) return;
  world.global.lastGlobalUpdate = now;

  updateWeatherFronts(world);
  updateMigrations(world);
  updateAnomalies(world);
  updateGlobalModifiers(world);
}

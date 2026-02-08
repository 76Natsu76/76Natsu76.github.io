// global-simulation.js
// 3G: Global Simulation Layer

import { getWorldState, addRegionHistory } from "./world-state.js";

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

function updateWeatherFronts(world) {
  for (const front of world.global.weatherFronts) {
    front.position += front.speed;

    if (front.position >= front.path.length) {
      front.finished = true;
      continue;
    }

    const regionKey = front.path[front.position];
    const region = world.regions[regionKey];
    if (!region) continue;

    region.weather = front.weatherKey;

    addRegionHistory(regionKey, "weather_front", 
      `A ${front.weatherKey.replace("_", " ")} front has moved into the region.`);
  }

  world.global.weatherFronts = world.global.weatherFronts.filter(f => !f.finished);
}

function updateMigrations(world) {
  for (const mig of world.global.migrations) {
    mig.position += 1;

    if (mig.position >= mig.path.length) {
      mig.finished = true;
      continue;
    }

    const regionKey = mig.path[mig.position];
    const region = world.regions[regionKey];
    if (!region) continue;

    region.factionControl[mig.faction] =
      (region.factionControl[mig.faction] || 0) + mig.strength;

    addRegionHistory(regionKey, "migration", 
      `${mig.faction} migration has entered the region.`);
  }

  world.global.migrations = world.global.migrations.filter(m => !m.finished);
}

function updateAnomalies(world) {
  for (const anomaly of world.global.anomalies) {
    const regionKey = anomaly.region;
    const region = world.regions[regionKey];
    if (!region) continue;

    region.elementalCharge[anomaly.element] += anomaly.intensity;

    addRegionHistory(regionKey, "anomaly", 
      `A ${anomaly.element} anomaly intensifies in the region.`);
  }
}

function updateGlobalModifiers(world) {
  for (const mod of world.global.globalModifiers) {
    if (Date.now() > mod.endsAt) {
      mod.expired = true;
      continue;
    }

    for (const regionKey in world.regions) {
      const r = world.regions[regionKey];
      r.dangerLevel *= mod.dangerMult || 1;
      r.stability *= mod.stabilityMult || 1;
    }
  }

  world.global.globalModifiers =
    world.global.globalModifiers.filter(m => !m.expired);
}

export const GlobalSim = {
  tick,
  spawnWeatherFront,
  spawnMigration,
  spawnAnomaly
};

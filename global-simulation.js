// global-simulation.js
// 3G: Global Simulation Layer

import { getWorldState, addRegionHistory } from "./world-state.js";

// ------------------------------------------------------------
// GLOBAL TICK ENTRY POINT
// ------------------------------------------------------------
function tick() {
  const world = getWorldState();
  const now = Date.now();

  // Ensure global container exists
  ensureGlobalState(world);

  // Only update every X minutes (10 min default)
  if (now - world.global.lastGlobalUpdate < 10 * 60 * 1000) return;
  world.global.lastGlobalUpdate = now;

  updateWeatherFronts(world);
  updateMigrations(world);
  updateAnomalies(world);
  updateGlobalModifiers(world);
}

// ------------------------------------------------------------
// WEATHER FRONTS
// ------------------------------------------------------------
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

    addRegionHistory(
      regionKey,
      "weather_front",
      `A ${front.weatherKey.replace("_", " ")} front has moved into the region.`
    );
  }

  world.global.weatherFronts = world.global.weatherFronts.filter(f => !f.finished);
}

function spawnWeatherFront(path, weatherKey, speed = 1) {
  const world = getWorldState();
  ensureGlobalState(world);

  world.global.weatherFronts.push({
    path,
    weatherKey,
    speed,
    position: 0,
    finished: false
  });
}

// ------------------------------------------------------------
// MIGRATIONS
// ------------------------------------------------------------
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

    addRegionHistory(
      regionKey,
      "migration",
      `${mig.faction} migration has entered the region.`
    );
  }

  world.global.migrations = world.global.migrations.filter(m => !m.finished);
}

function spawnMigration(path, faction, strength = 1) {
  const world = getWorldState();
  ensureGlobalState(world);

  world.global.migrations.push({
    path,
    faction,
    strength,
    position: 0,
    finished: false
  });
}

// ------------------------------------------------------------
// ANOMALIES
// ------------------------------------------------------------
function updateAnomalies(world) {
  for (const anomaly of world.global.anomalies) {
    const regionKey = anomaly.region;
    const region = world.regions[regionKey];
    if (!region) continue;

    region.elementalCharge[anomaly.element] =
      (region.elementalCharge[anomaly.element] || 0) + anomaly.intensity;

    addRegionHistory(
      regionKey,
      "anomaly",
      `A ${anomaly.element} anomaly intensifies in the region.`
    );
  }
}

function spawnAnomaly(regionKey, element, intensity = 1) {
  const world = getWorldState();
  ensureGlobalState(world);

  world.global.anomalies.push({
    region: regionKey,
    element,
    intensity
  });
}

// ------------------------------------------------------------
// GLOBAL MODIFIERS
// ------------------------------------------------------------
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

function spawnGlobalModifier({ dangerMult = 1, stabilityMult = 1, durationMs = 3600000 }) {
  const world = getWorldState();
  ensureGlobalState(world);

  world.global.globalModifiers.push({
    dangerMult,
    stabilityMult,
    endsAt: Date.now() + durationMs,
    expired: false
  });
}

// ------------------------------------------------------------
// INTERNAL: ENSURE GLOBAL STATE EXISTS
// ------------------------------------------------------------
function ensureGlobalState(world) {
  if (!world.global) {
    world.global = {
      weatherFronts: [],
      migrations: [],
      anomalies: [],
      globalModifiers: [],
      lastGlobalUpdate: Date.now()
    };
  }
}

// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------
export const GlobalSim = {
  tick,
  spawnWeatherFront,
  spawnMigration,
  spawnAnomaly,
  spawnGlobalModifier
};

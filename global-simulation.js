// global-simulation.js
// 3G: Global Simulation Layer

import { WORLD_DATA } from "./world-data.js";
import { getWorldState, addRegionHistory } from "./world-state.js";

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function pickNeighborRegion(world, regionKey) {
  const region = WORLD_DATA.regions[regionKey];
  if (!region?.neighbors?.length) return null;
  return region.neighbors[Math.floor(Math.random() * region.neighbors.length)];
}

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
// GLOBAL TICK ENTRY POINT
// ------------------------------------------------------------
function tick() {
  const world = getWorldState();
  const now = Date.now();

  ensureGlobalState(world);

  // Only update every X minutes (10 min default)
  if (now - world.global.lastGlobalUpdate < 10 * 60 * 1000) return;
  world.global.lastGlobalUpdate = now;

  updateWeatherFronts(world);
  mergeWeatherFronts(world);

  updateMigrations(world);
  updateAnomalies(world);
  updateGlobalModifiers(world);
  updateWorldBossAwakenings(world);
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

    // Chance to intensify
    if (Math.random() < 0.1) {
      front.intensity = Math.min(3, (front.intensity || 1) + 1);
    }

    // Chance to weaken
    if (Math.random() < 0.1) {
      front.intensity = Math.max(1, (front.intensity || 1) - 1);
    }

    // Apply intensity to region
    region.weatherIntensity = front.intensity;

    // Chance to dissipate
    if (front.intensity <= 1 && Math.random() < 0.05) {
      front.finished = true;
    }

    addRegionHistory(
      regionKey,
      "weather_front",
      `A ${front.weatherKey.replace("_", " ")} front has moved into the region.`
    );
  }

  world.global.weatherFronts = world.global.weatherFronts.filter(f => !f.finished);
}

function mergeWeatherFronts(world) {
  const fronts = world.global.weatherFronts;

  for (let i = 0; i < fronts.length; i++) {
    for (let j = i + 1; j < fronts.length; j++) {
      const A = fronts[i];
      const B = fronts[j];

      if (A.path[A.position] === B.path[B.position]) {
        A.intensity = Math.min(3, (A.intensity || 1) + (B.intensity || 1));
        B.finished = true;

        addRegionHistory(
          A.path[A.position],
          "weather_merge",
          "Two weather fronts collided, intensifying the storm."
        );
      }
    }
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
    intensity: 1,
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

    // Chance to grow
    if (Math.random() < 0.15) {
      anomaly.intensity += 1;
      addRegionHistory(regionKey, "anomaly_growth",
        `The ${anomaly.element} anomaly grows stronger.`);
    }

    // Chance to spread
    if (Math.random() < 0.1) {
      const neighbor = pickNeighborRegion(world, regionKey);
      if (neighbor) {
        world.global.anomalies.push({
          region: neighbor,
          element: anomaly.element,
          intensity: Math.max(1, anomaly.intensity - 1)
        });

        addRegionHistory(neighbor, "anomaly_spread",
          `A ${anomaly.element} anomaly spreads into the region.`);
      }
    }

    // Chance to collapse
    if (Math.random() < 0.05) {
      anomaly.collapsed = true;
      addRegionHistory(regionKey, "anomaly_collapse",
        `The ${anomaly.element} anomaly collapses and fades.`);
    }
  }

  // Cleanup collapsed anomalies
  world.global.anomalies = world.global.anomalies.filter(a => !a.collapsed);
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
// WORLD BOSS AWAKENINGS
// ------------------------------------------------------------
function updateWorldBossAwakenings(world) {
  for (const [regionKey, region] of Object.entries(world.regions)) {
    if (!region.worldBossAwakening) continue;

    if (Date.now() >= region.worldBossAwakening) {
      region.worldBossActive = true;
      region.worldBossAwakening = null;

      addRegionHistory(
        regionKey,
        "world_boss_awakened",
        "A World Boss has awakened in this region!"
      );
    }
  }
}

function spawnWorldBoss(regionKey, delayMs = 30 * 60 * 1000) {
  const world = getWorldState();
  ensureGlobalState(world);

  const region = world.regions[regionKey];
  if (!region) return;

  region.worldBossAwakening = Date.now() + delayMs;
  region.worldBossActive = false;

  addRegionHistory(
    regionKey,
    "world_boss_stirs",
    "A powerful presence stirs beneath the earth..."
  );
}

// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------
export const GlobalSim = {
  tick,
  spawnWeatherFront,
  spawnMigration,
  spawnAnomaly,
  spawnGlobalModifier,
  spawnWorldBoss
};

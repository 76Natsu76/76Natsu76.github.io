// world-simulation.js
// GitHub-native world simulation engine.
// Handles weather, events, hazards, world boss states, and region pressure.

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { WORLD_BOSSES } from "./world-boss-templates.json";

export const WorldSim = {
  tick,
  getState,
  forceUpdate
};

const STORAGE_KEY = "world_state";

// ------------------------------------------------------------
// LOAD / SAVE
// ------------------------------------------------------------
function getState() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

  // Initialize world state
  const state = {};

  for (const regionKey in WORLD_DATA.regions) {
    const region = WORLD_DATA.regions[regionKey];
    const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
    const biome = BIOMES[biomeKey];

    state[regionKey] = {
      weather: pickFromArray(region.weatherPool || biome.weatherPool || []),
      event: null,
      hazard: null,
      worldBoss: null,
      pressure: 1.0
    };
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function saveState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ------------------------------------------------------------
// MAIN TICK
// ------------------------------------------------------------
function tick() {
  const state = getState();

  for (const regionKey in WORLD_DATA.regions) {
    const region = WORLD_DATA.regions[regionKey];
    const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
    const biome = BIOMES[biomeKey];

    const r = state[regionKey];

    // WEATHER
    const weatherPool = region.weatherPool?.length
      ? region.weatherPool
      : biome.weatherPool || [];

    if (Math.random() < 0.25) {
      r.weather = pickFromArray(weatherPool);
    }

    // EVENTS
    if (region.eventPool?.length && Math.random() < 0.15) {
      r.event = pickFromArray(region.eventPool);
    } else {
      r.event = null;
    }

    // HAZARDS
    if (biome.hazards?.length && Math.random() < 0.10) {
      r.hazard = pickHazard(biome.hazards);
    } else {
      r.hazard = null;
    }

    // WORLD BOSS SYSTEM
    if (!r.worldBoss) {
      // No boss currently active in this region
      const bossKey = trySpawnWorldBoss(regionKey, region, r);
      if (bossKey) {
        r.worldBoss = {
          key: bossKey,
          hp: WORLD_BOSSES[bossKey].maxHP,
          maxHP: WORLD_BOSSES[bossKey].maxHP,
          phase: 0,
          active: true,
          despawnTimer: 60 // ticks until despawn if ignored
        };
      }
    } else {
      // Boss is active
      const boss = r.worldBoss;
    
      // Despawn if timer runs out
      boss.despawnTimer--;
      if (boss.despawnTimer <= 0) {
        r.worldBoss = null;
      }
    
      // If boss was killed externally (via world-boss-engine)
      if (boss.hp <= 0) {
        r.worldBoss = null;
      }
    }


    // REGION PRESSURE (encounter intensity)
    r.pressure = Math.min(3.0, Math.max(0.5, r.pressure + (Math.random() - 0.5) * 0.1));
  }

  saveState(state);
  return state;
}

function trySpawnWorldBoss(regionKey, region, regionState) {
  // Check all bosses for spawn eligibility
  for (const bossKey in WORLD_BOSSES) {
    const boss = WORLD_BOSSES[bossKey];

    // Region match
    if (boss.spawnRules.region !== regionKey) continue;

    // Seasonal match
    if (boss.spawnRules.season !== "any") {
      // You can integrate seasons later
      continue;
    }

    // Spawn chance
    if (Math.random() < (boss.spawnRules.chance || 0)) {
      return bossKey;
    }
  }

  return null;
}

// ------------------------------------------------------------
// FORCE UPDATE (manual refresh)
// ------------------------------------------------------------
function forceUpdate() {
  const state = tick();
  saveState(state);
  return state;
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function pickFromArray(arr) {
  if (!arr || !arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickHazard(hazards) {
  if (!hazards || !hazards.length) return null;

  const roll = Math.random();
  let cumulative = 0;

  for (const h of hazards) {
    cumulative += h.chance;
    if (roll <= cumulative) return h.key;
  }

  return null;
}

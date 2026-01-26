// world-simulation.js
// GitHub-native world simulation engine.
// Handles weather, events, hazards, world boss states, and region pressure.

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";

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
      worldBossAlive: true,
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

    // WORLD BOSS
    if (!r.worldBossAlive && Math.random() < 0.05) {
      r.worldBossAlive = true;
    }

    // REGION PRESSURE (encounter intensity)
    r.pressure = Math.min(3.0, Math.max(0.5, r.pressure + (Math.random() - 0.5) * 0.1));
  }

  saveState(state);
  return state;
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

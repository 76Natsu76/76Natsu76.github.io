// world-simulation.js
// GitHub-native world simulation engine.
// Handles weather, events, hazards, world boss states, region unlocks,
// and region pressure.

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { WorldBossAnnouncements } from "./world-boss-announcements.js";

export const WorldSim = {
  init,
  tick,
  getState,
  forceUpdate
};

const STORAGE_KEY = "world_state";

// These will be filled by init()
let WORLD_BOSSES = {};
let REGION_UNLOCKS = { unlocks: {} };

export function _getBossData() {
  return WORLD_BOSSES;
}

WorldSim._getBossData = _getBossData;


/* ============================================================
   INITIALIZATION — MUST BE CALLED BEFORE USING WORLD SIM
============================================================ */
async function init() {
  WORLD_BOSSES = await loadJSON("./world-boss-templates.json");
  REGION_UNLOCKS = await loadJSON("./region-unlocks.json");
}

/* ============================================================
   LOAD JSON SAFELY
============================================================ */
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load " + path);
  return res.json();
}

/* ============================================================
   LOAD / SAVE WORLD STATE
============================================================ */
function getState() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

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
      pressure: 1.0,
      unlocked: REGION_UNLOCKS.unlocks[regionKey] || false
    };
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function saveState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ============================================================
   MAIN TICK
============================================================ */
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
      const bossKey = trySpawnWorldBoss(regionKey);
      if (bossKey) {
        const boss = WORLD_BOSSES[bossKey];
        r.worldBoss = {
          key: bossKey,
          hp: boss.maxHP,
          maxHP: boss.maxHP,
          phase: 0,
          active: true,
          despawnTimer: 60
        };
      }
    } else {
      const boss = r.worldBoss;

      boss.despawnTimer--;
      if (boss.despawnTimer <= 0 || boss.hp <= 0) {
        r.worldBoss = null;
      }
    }

    // REGION PRESSURE
    r.pressure = Math.min(
      3.0,
      Math.max(0.5, r.pressure + (Math.random() - 0.5) * 0.1)
    );
  }

  saveState(state);
  WorldBossAnnouncements.checkForAnnouncements(state);
  return state;
}

/* ============================================================
   WORLD BOSS SPAWN LOGIC
============================================================ */
function trySpawnWorldBoss(regionKey) {
  for (const bossKey in WORLD_BOSSES) {
    const boss = WORLD_BOSSES[bossKey];

    if (boss.spawnRules.region !== regionKey) continue;
    if (boss.spawnRules.season !== "any") continue;

    if (Math.random() < (boss.spawnRules.chance || 0)) {
      return bossKey;
    }
  }

  return null;
}

/* ============================================================
   FORCE UPDATE
============================================================ */
function forceUpdate() {
  const state = tick();
  saveState(state);
  return state;
}

/* ============================================================
   HELPERS
============================================================ */
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

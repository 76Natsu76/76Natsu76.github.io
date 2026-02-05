// world-tick.js
// Dynamic world heartbeat: weather, hazards, events, influence, seasons, merchants, bosses.

import { BIOMES } from "./biomes.js";
import { REGION_BIOMES } from "./region-biomes.js";
import { weatherTable } from "./weatherTable.js";
import { rotateMerchants } from "./merchant-rotation.js";
import { updateWorldBosses } from "./world-boss-progression.js";

/****************************************************
 * CONFIG — edit these to change pacing
 ****************************************************/

export const WORLD_TICK_CONFIG = {
  WEATHER_TICK_MIN: 30,          // how often weather can change per region
  HAZARD_TICK_MIN: 10,           // how often hazards escalate/relax
  EVENT_TICK_MIN: 60,            // how often region events can spawn/update
  REGION_INFLUENCE_TICK_MIN: 120,// how often region influence drifts
  SEASON_TICK_MIN: 10080,        // 7 days (in minutes) = 1 in‑game season
  MERCHANT_TICK_MIN: 1440,       // 24 hours
  BOSS_TICK_MIN: 60              // world boss progression
};

const MS_PER_MIN = 60000;

const WEATHER_TICK_MS          = WORLD_TICK_CONFIG.WEATHER_TICK_MIN * MS_PER_MIN;
const HAZARD_TICK_MS           = WORLD_TICK_CONFIG.HAZARD_TICK_MIN * MS_PER_MIN;
const EVENT_TICK_MS            = WORLD_TICK_CONFIG.EVENT_TICK_MIN * MS_PER_MIN;
const REGION_INFLUENCE_TICK_MS = WORLD_TICK_CONFIG.REGION_INFLUENCE_TICK_MIN * MS_PER_MIN;
const SEASON_TICK_MS           = WORLD_TICK_CONFIG.SEASON_TICK_MIN * MS_PER_MIN;
const MERCHANT_TICK_MS         = WORLD_TICK_CONFIG.MERCHANT_TICK_MIN * MS_PER_MIN;
const BOSS_TICK_MS             = WORLD_TICK_CONFIG.BOSS_TICK_MIN * MS_PER_MIN;

/****************************************************
 * WEATHER LOOKUP (canonical)
 ****************************************************/

function getWeatherDefinition(key) {
  return weatherTable[key] || weatherTable["clear"];
}

/****************************************************
 * HELPERS
 ****************************************************/

function chooseWeatherForBiome(biomeKey) {
  const biome = BIOMES[biomeKey];
  const pool = biome?.weatherPool || ["clear"];
  const key = pool[Math.floor(Math.random() * pool.length)];
  return getWeatherDefinition(key);
}

function nextSeason(current) {
  const order = ["spring", "summer", "autumn", "fall", "winter"];
  const idx = order.indexOf(current);
  if (idx === -1 || idx === order.length - 1) return "spring";
  if (order[idx] === "autumn") return "winter"; // alias handling
  return order[idx + 1];
}

/****************************************************
 * INIT
 ****************************************************/

export function initWorldState(regionKeys) {
  const now = Date.now();
  const regions = {};

  for (const key of regionKeys) {
    const biomeKey = REGION_BIOMES[key] || null;
    const weatherDef = biomeKey
      ? chooseWeatherForBiome(biomeKey)
      : weatherTable["clear"];

    regions[key] = {
      key,
      biome: biomeKey,
      currentWeatherKey: weatherDef.key,
      lastWeatherChange: now,
      crisisState: null,
      hazardLevel: 0, // 0–100 abstract pressure
      influence: {
        corruption: 0,
        wildlife: 0,
        humanoid: 0,
        elemental: 0
      },
      activeEvents: []
    };
  }

  return {
    day: 0,
    tickCount: 0,
    season: "spring",
    lastSeasonChange: now,
    lastTick: now,

    lastWeatherTick: now,
    lastHazardTick: now,
    lastEventTick: now,
    lastRegionInfluenceTick: now,
    lastMerchantTick: now,
    lastBossTick: now,

    regions,

    globalMerchant: null,
    bosses: {},
    regionUnlocks: {}
  };
}

/****************************************************
 * SUBSYSTEM TICKS
 ****************************************************/

function weatherTick(worldState, now) {
  if (now - worldState.lastWeatherTick < WEATHER_TICK_MS) return;
  worldState.lastWeatherTick = now;

  for (const regionKey in worldState.regions) {
    const region = worldState.regions[regionKey];
    if (!region.biome) continue;

    const weatherDef = chooseWeatherForBiome(region.biome);
    region.currentWeatherKey = weatherDef.key;
    region.lastWeatherChange = now;
  }
}

function hazardTick(worldState, now) {
  if (now - worldState.lastHazardTick < HAZARD_TICK_MS) return;
  worldState.lastHazardTick = now;

  for (const regionKey in worldState.regions) {
    const region = worldState.regions[regionKey];
    const biome = BIOMES[region.biome];

    let delta = (Math.random() - 0.4) * 5; // small drift

    const weather = region.currentWeatherKey;
    if (weather === "storm" || weather === "void_storm") {
      delta += 3;
    }
    if (biome?.hazards?.length) {
      delta += 1;
    }

    region.hazardLevel = Math.max(0, Math.min(100, region.hazardLevel + delta));
  }
}

function eventTick(worldState, now) {
  if (now - worldState.lastEventTick < EVENT_TICK_MS) return;
  worldState.lastEventTick = now;

  for (const regionKey in worldState.regions) {
    const region = worldState.regions[regionKey];

    const events = region.activeEvents || [];
    const hazard = region.hazardLevel || 0;

    region.activeEvents = events.filter(e => !e.expiresAt || e.expiresAt > now);

    const crisisChance = hazard / 200; // 0–0.5
    const ambientChance = 0.05;

    if (Math.random() < crisisChance) {
      region.activeEvents.push({
        key: "regional_crisis",
        type: "crisis",
        createdAt: now,
        expiresAt: now + EVENT_TICK_MS * 2
      });
    } else if (Math.random() < ambientChance) {
      region.activeEvents.push({
        key: "ambient_disturbance",
        type: "ambient",
        createdAt: now,
        expiresAt: now + EVENT_TICK_MS
      });
    }
  }
}

function regionInfluenceTick(worldState, now) {
  if (now - worldState.lastRegionInfluenceTick < REGION_INFLUENCE_TICK_MS) return;
  worldState.lastRegionInfluenceTick = now;

  for (const regionKey in worldState.regions) {
    const region = worldState.regions[regionKey];
    const infl = region.influence;

    const season = worldState.season || "spring";

    infl.corruption += (Math.random() - 0.5) * 2;
    infl.wildlife += (Math.random() - 0.5) * 2;
    infl.humanoid += (Math.random() - 0.5) * 2;
    infl.elemental += (Math.random() - 0.5) * 2;

    if (season === "spring") infl.wildlife += 1;
    if (season === "summer") infl.elemental += 1;
    if (season === "autumn" || season === "fall") infl.corruption += 1;
    if (season === "winter") infl.corruption += 0.5;

    for (const k of ["corruption", "wildlife", "humanoid", "elemental"]) {
      infl[k] = Math.max(0, Math.min(100, infl[k]));
    }
  }
}

function seasonTick(worldState, now) {
  if (now - worldState.lastSeasonChange < SEASON_TICK_MS) return;

  worldState.lastSeasonChange = now;
  worldState.season = nextSeason(worldState.season);
  worldState.day += 7;
}

function merchantTick(worldState, now) {
  if (now - worldState.lastMerchantTick < MERCHANT_TICK_MS) return;
  worldState.lastMerchantTick = now;

  const updated = rotateMerchants(worldState);
  Object.assign(worldState, updated || {});
}

function bossTick(worldState, now) {
  if (now - worldState.lastBossTick < BOSS_TICK_MS) return;
  worldState.lastBossTick = now;

  const updated = updateWorldBosses(worldState);
  Object.assign(worldState, updated || {});
}

/****************************************************
 * MASTER TICK
 ****************************************************/

export function tickWorld(worldState) {
  const now = Date.now();
  worldState.tickCount = (worldState.tickCount || 0) + 1;

  weatherTick(worldState, now);
  hazardTick(worldState, now);
  eventTick(worldState, now);
  regionInfluenceTick(worldState, now);
  seasonTick(worldState, now);
  merchantTick(worldState, now);
  bossTick(worldState, now);

  worldState.lastTick = now;
  return worldState;
}

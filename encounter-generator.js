// encounter-generator.js

import {
  REGION_BIOMES,
  getBiomeForRegion,
  getRegionModifiers,
  getWeatherDefinition,
  weatherTable
} from "./world-simulation.js";

import { resolveEnemy } from "./resolveEnemy.js";
import { ENEMY_FAMILIES } from "./enemy-families.js";
import { loadEnemies } from "./enemy-database.js"; // your canonical enemy list
import { pickWeighted } from "./weighted.js";      // generic weighted picker

// ------------------------------------------------------------
// BIOME WEATHER POOLS (canonical, matches world-tick.js)
// ------------------------------------------------------------
const BIOME_WEATHER_POOLS = {
  forest: ["clear", "rain", "fog"],
  plains: ["clear", "rain", "storm"],
  swamp: ["fog", "rain", "clear"],
  desert: ["clear", "heatwave", "storm"],
  tundra: ["clear", "storm", "fog"],
  mountains: ["clear", "storm", "fog"],
  cavern: ["clear", "fog"],
  ruins: ["clear", "fog", "rain"],
  coastal: ["clear", "rain", "storm"],
  volcanic: ["clear", "heatwave", "storm"],
  arcane: ["clear", "arcane_winds", "storm"],
  celestial: ["clear", "arcane_winds"],
  void: ["clear", "void_storm", "fog"],
  primeval: ["clear", "rain", "storm"],
  storm: ["storm", "rain", "clear"],
  abyssal: ["void_storm", "storm", "fog"],
  astral: ["clear", "arcane_winds"]
};

// ------------------------------------------------------------
// BIOME VARIANT POOLS
// ------------------------------------------------------------
const BIOME_VARIANTS = {
  tundra: ["frost_touched"],
  volcanic: ["ash_marked"],
  void: ["void_scarred"],
  cavern: ["crystal_infused"],
  swamp: ["rot_swollen"]
};

// ------------------------------------------------------------
// BIOME HAZARD POOLS
// ------------------------------------------------------------
const BIOME_HAZARDS = {
  forest: [
    { key: "thorn_trap", chance: 0.10 }
  ],
  swamp: [
    { key: "poison_spores", chance: 0.12 }
  ],
  volcanic: [
    { key: "lava_splash", chance: 0.10 }
  ],
  void: [
    { key: "void_pressure", chance: 0.08 }
  ]
};

// ------------------------------------------------------------
// REGION RARITY WEIGHTS (canonical)
// ------------------------------------------------------------
import { REGION_RARITY_WEIGHTS } from "./region-rarity.js";

// ------------------------------------------------------------
// REGION EVENT TABLES
// ------------------------------------------------------------
import { REGION_EVENTS } from "./region-events.js";

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function rollWeather(biome) {
  const pool = BIOME_WEATHER_POOLS[biome] || ["clear"];
  const key = pool[Math.floor(Math.random() * pool.length)];
  return getWeatherDefinition(key);
}

function rollHazard(biome) {
  const list = BIOME_HAZARDS[biome];
  if (!list) return null;
  for (const h of list) {
    if (Math.random() < h.chance) return h.key;
  }
  return null;
}

function rollVariant(biome) {
  const list = BIOME_VARIANTS[biome];
  if (!list) return null;
  if (Math.random() < 0.10) {
    return list[Math.floor(Math.random() * list.length)];
  }
  return null;
}

function rollRarity(regionKey) {
  const weights = REGION_RARITY_WEIGHTS[regionKey];
  if (!weights) return "common";
  return pickWeighted(weights);
}

function rollRegionEvent(regionKey) {
  const table = REGION_EVENTS[regionKey];
  if (!table) return null;
  return pickWeighted(table);
}

function pickEnemyFamily(biomeKey) {
  const biome = ENEMY_FAMILIES.biomes[biomeKey];
  if (!biome || !biome.encounterWeights) return "beast";
  const entries = Object.entries(biome.encounterWeights).map(([id, weight]) => ({ id, weight }));
  return pickWeighted(entries);
}

function pickEnemyForFamily(familyId, playerLevel) {
  const all = Object.values(loadEnemies());
  const candidates = all.filter(e => e.family === familyId);

  if (!candidates.length) throw new Error("No enemies for family: " + familyId);

  const min = Math.floor(playerLevel * 0.8);
  const max = Math.ceil(playerLevel * 1.2);

  const banded = candidates.filter(e => e.level >= min && e.level <= max);
  const pool = banded.length ? banded : candidates;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ------------------------------------------------------------
// MAIN ENCOUNTER GENERATOR
// ------------------------------------------------------------
export function generateEncounter(regionKey, playerState) {
  const biomeKey = REGION_BIOMES[regionKey];
  const weather = rollWeather(biomeKey);
  const hazard = rollHazard(biomeKey);
  const variant = rollVariant(biomeKey);
  const rarity = rollRarity(regionKey);
  const event = rollRegionEvent(regionKey);

  const familyId = pickEnemyFamily(biomeKey);
  const enemyRow = pickEnemyForFamily(familyId, playerState.level);

  const resolvedEnemy = resolveEnemy(
    {
      key: enemyRow.key,
      name: enemyRow.name,
      family: enemyRow.family,
      profession: enemyRow.profession,
      element: enemyRow.element,
      level: enemyRow.level,
      baseHP: enemyRow.baseHP,
      baseATK: enemyRow.baseATK,
      baseDEF: enemyRow.baseDEF,
      rarity,
      tags: variant ? [variant] : []
    },
    regionKey,
    enemyRow.tier || 1
  );

  return {
    region: regionKey,
    biome: biomeKey,
    weather: weather ? weather.key : "clear",
    hazard,
    rarity,
    event,
    variant,
    enemy: resolvedEnemy
  };
}

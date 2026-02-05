// encounter-engine.js

import {
  REGION_BIOMES,
  getBiomeForRegion,
  getRegionModifiers,
  getWeatherDefinition,
  weatherTable
} from "./world-simulation.js";

import { resolveEnemy } from "./resolveEnemy.js";
import { ENEMY_FAMILIES } from "./enemy-families.js";
import { loadEnemies } from "./enemy-database.js";
import { pickWeighted } from "./weighted.js";

import { ENEMY_GROUP_SIZES } from "./enemy-group-sizes.js";
import { ENEMY_GROUP_RULES } from "./enemy-group-rules.js";
import { ENEMY_VARIANT_WEIGHTS } from "./enemy-variant-weights.js"; // hybrid: families + enemies
import { REGION_RARITY_WEIGHTS } from "./region-rarity.js";
import { REGION_EVENTS } from "./region-events.js";

// ------------------------------------------------------------
// BIOME WEATHER POOLS (canonical, matches world-simulation/world-tick)
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
// BIOME VARIANT TAG POOLS (tags like frost_touched, ash_marked, etc.)
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
  forest: [{ key: "thorn_trap", chance: 0.10 }],
  swamp: [{ key: "poison_spores", chance: 0.12 }],
  volcanic: [{ key: "lava_splash", chance: 0.10 }],
  void: [{ key: "void_pressure", chance: 0.08 }]
};

// ------------------------------------------------------------
// INTERNAL HELPERS
// ------------------------------------------------------------
const ALL_ENEMIES_CACHE = loadEnemies(); // assume { key: enemyDef }

function getEnemyByKey(key) {
  return ALL_ENEMIES_CACHE[key];
}

function rollWeather(biomeKey) {
  const pool = BIOME_WEATHER_POOLS[biomeKey] || ["clear"];
  const key = pool[Math.floor(Math.random() * pool.length)];
  return getWeatherDefinition(key);
}

function rollHazard(biomeKey) {
  const list = BIOME_HAZARDS[biomeKey];
  if (!list) return null;
  for (const h of list) {
    if (Math.random() < h.chance) return h.key;
  }
  return null;
}

function rollBiomeVariantTag(biomeKey) {
  const list = BIOME_VARIANTS[biomeKey];
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

// ------------------------------------------------------------
// FAMILY SELECTION
// ------------------------------------------------------------
function pickEnemyFamily(biomeKey, tier) {
  // Prefer ENEMY_GROUP_RULES if present for this biome/tier band
  const groupRule = ENEMY_GROUP_RULES[biomeKey];
  if (groupRule && groupRule.basic) {
    const entries = groupRule.basic.map(id => ({ id, weight: 1 }));
    return pickWeighted(entries);
  }

  // Fallback to ENEMY_FAMILIES biome encounterWeights
  const biome = ENEMY_FAMILIES.biomes[biomeKey];
  if (!biome || !biome.encounterWeights) return "beast";

  const entries = Object.entries(biome.encounterWeights).map(
    ([id, weight]) => ({ id, weight })
  );
  return pickWeighted(entries);
}

// ------------------------------------------------------------
// ENEMY SELECTION WITH LEVEL BANDING
// ------------------------------------------------------------
function pickEnemyForFamily(familyId, playerLevel) {
  const all = Object.values(ALL_ENEMIES_CACHE);
  const candidates = all.filter(e => e.family === familyId);

  if (!candidates.length) {
    throw new Error("No enemies for family: " + familyId);
  }

  const min = Math.floor(playerLevel * 0.8);
  const max = Math.ceil(playerLevel * 1.2);

  const banded = candidates.filter(e => e.level >= min && e.level <= max);
  const pool = banded.length ? banded : candidates;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ------------------------------------------------------------
// GROUP SIZE (per enemy key, with default)
// ------------------------------------------------------------
function rollGroupSize(enemyKey) {
  const rule = ENEMY_GROUP_SIZES[enemyKey] || ENEMY_GROUP_SIZES.default;
  const min = rule.min ?? 1;
  const max = rule.max ?? 1;
  return (
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

// ------------------------------------------------------------
// VARIANT MIXING (hybrid: family defaults + enemy overrides + biome + tier)
// ENEMY_VARIANT_WEIGHTS is expected to look like:
// {
//   families: {
//     goblin: {
//       base: { goblin: 70, goblin_archer: 15, goblin_brute: 10, goblin_shaman: 5 },
//       forest: { goblin_scout: +10 },
//       tier4: { goblin_shaman: +10 }
//     },
//     ...
//   },
//   enemies: {
//     goblin_shaman: {
//       base: { goblin_shaman: 100 },
//       swamp: { goblin_shaman: +20 }
//     },
//     ...
//   }
// }
// ------------------------------------------------------------
function buildVariantWeightTable(primaryEnemyKey, familyId, biomeKey, tier) {
  const famTable = ENEMY_VARIANT_WEIGHTS.families?.[familyId] || {};
  const enemyTable = ENEMY_VARIANT_WEIGHTS.enemies?.[primaryEnemyKey] || {};

  const result = {};

  function applyLayer(layer) {
    if (!layer) return;
    for (const [key, delta] of Object.entries(layer)) {
      if (!(key in result)) result[key] = 0;
      result[key] += delta;
    }
  }

  // Start with family base
  applyLayer(famTable.base);

  // Biome modifiers (family)
  if (biomeKey && famTable[biomeKey]) {
    applyLayer(famTable[biomeKey]);
  }

  // Tier modifiers (family)
  const tierKey = tier != null ? `tier${tier}` : null;
  if (tierKey && famTable[tierKey]) {
    applyLayer(famTable[tierKey]);
  }

  // Enemy-specific base
  applyLayer(enemyTable.base);

  // Enemy-specific biome
  if (biomeKey && enemyTable[biomeKey]) {
    applyLayer(enemyTable[biomeKey]);
  }

  // Enemy-specific tier
  if (tierKey && enemyTable[tierKey]) {
    applyLayer(enemyTable[tierKey]);
  }

  // If nothing was applied, default to primary enemy only
  if (!Object.keys(result).length) {
    result[primaryEnemyKey] = 100;
  }

  // Ensure all weights are positive
  for (const key of Object.keys(result)) {
    if (result[key] <= 0) delete result[key];
  }
  if (!Object.keys(result).length) {
    result[primaryEnemyKey] = 100;
  }

  // Convert to pickWeighted format
  return Object.entries(result).map(([id, weight]) => ({ id, weight }));
}

function rollVariantEnemyKey(primaryEnemyKey, familyId, biomeKey, tier) {
  const table = buildVariantWeightTable(primaryEnemyKey, familyId, biomeKey, tier);
  return pickWeighted(table);
}

// ------------------------------------------------------------
// CORE GENERATION PIPELINE
// ------------------------------------------------------------
function generateEncounter(regionKey, playerState) {
  // Region → Biome
  const biomeKey =
    REGION_BIOMES[regionKey] || getBiomeForRegion(regionKey) || "forest";

  // World context
  const weatherDef = rollWeather(biomeKey);
  const hazard = rollHazard(biomeKey);
  const biomeVariantTag = rollBiomeVariantTag(biomeKey);
  const rarity = rollRarity(regionKey);
  const event = rollRegionEvent(regionKey);

  // Family + primary enemy
  const familyId = pickEnemyFamily(biomeKey, playerState.level);
  const primaryEnemyRow = pickEnemyForFamily(familyId, playerState.level);

  // Group size
  const groupCount = rollGroupSize(primaryEnemyRow.key);

  // Tier: if your enemies have tier, use it; otherwise default 1
  const tier = primaryEnemyRow.tier || 1;

  // Build group with automatic variant mixing
  const enemies = [];
  for (let i = 0; i < groupCount; i++) {
    const variantKey = rollVariantEnemyKey(
      primaryEnemyRow.key,
      familyId,
      biomeKey,
      tier
    );

    const base = getEnemyByKey(variantKey) || primaryEnemyRow;

    const tags = [];
    if (biomeVariantTag) tags.push(biomeVariantTag);

    const resolved = resolveEnemy(
      {
        key: base.key,
        name: base.name,
        family: base.family,
        profession: base.profession,
        element: base.element,
        level: base.level,
        baseHP: base.baseHP,
        baseATK: base.baseATK,
        baseDEF: base.baseDEF,
        rarity,
        tags
      },
      regionKey,
      base.tier || tier || 1
    );

    enemies.push(resolved);
  }

  return {
    region: regionKey,
    biome: biomeKey,
    weather: weatherDef ? weatherDef.key : "clear",
    hazard,
    rarity,
    event,
    biomeVariantTag,
    family: familyId,
    tier,
    enemies
  };
}

// ------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------
export const EncounterEngine = {
  rollWeather,
  rollHazard,
  rollBiomeVariantTag,
  rollRarity,
  rollRegionEvent,
  pickEnemyFamily,
  pickEnemyForFamily,
  rollGroupSize,
  buildVariantWeightTable,
  rollVariantEnemyKey,
  generate: generateEncounter
};

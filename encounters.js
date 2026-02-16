// encounters.js
// Subregion-aware, tier-drift encounter engine

import { applyDynamicScaling } from "./dynamic-scaling.js";
import { BIOMES } from "./biomes.js";
import { BIOME_PRESETS } from "./biome-presets.js";
import { CRISIS_DEFINITIONS } from "./crisis-definitions.js";
import { ENEMY_GROUP_SIZES } from "./enemy-group-sizes.js";
import { EnemyRegistry } from "./enemy-registry.js";
import { getRegionState, getCurrentSeason } from "./world-state.js";
import { maybeInjectRareSpawn } from "./rare-spawn.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { REGION_ENEMIES } from "./region-enemies.js";
import { REGION_HIERARCHY } from "./region-hierarchy.js";
import { resolveEncounterWeights } from "./encounter-resolver.js";
import { rollEncounterAffixes, applyAffixesToEncounter } from "./encounter-affixes.js";
import { SEASON_DEFINITIONS } from "./season-definitions.js";
import { WORLD_DATA } from "./world-data.js";

import { BIOME_IDENTITY } from "./biome-identity.js";
import { REGION_IDENTITY } from "./region-identity.js";
import { SUBREGION_IDENTITY } from "./subregion-identity.js"; // if you export it


// Phase D taxonomy (environmental categories)
import {
  WEATHER_TYPES,
  ANOMALIES,
  MIGRATIONS,
  GLOBAL_MODIFIERS as GLOBAL_PHASED_MODIFIERS
} from "./environment-taxonomy.js";

export function initEncounters() {
  return true;
}

export const EncounterEngine = {
  generate,
  loadFromSession,
  clear
};

// NEW HELPERS

function getRegionIdentity(regionId) {
  return REGION_IDENTITY[regionId] || null;
}

function getBiomeIdentity(biomeId) {
  return BIOME_IDENTITY[biomeId] || null;
}

function getSubregionIdentity(regionId, subregionId) {
  const regionBlock = SUBREGION_IDENTITY[regionId];
  if (!regionBlock) return null;
  return regionBlock[subregionId] || null;
}

// ------------------------------------------------------------
// MAIN ENTRY POINT
// ------------------------------------------------------------
function generate(regionKey, subregionKey, username, enemyOverride = null) {
  const region = WORLD_DATA.regions[regionKey];
  if (!region) throw new Error(`Unknown region: ${regionKey}`);

  const subregionDefs = REGION_HIERARCHY[regionKey]?.subregions || {};
  const subregion = subregionDefs[subregionKey];
  if (!subregion) throw new Error(`Unknown subregion: ${subregionKey} in ${regionKey}`);

  const biomeKey = subregion.biome || REGION_TO_BIOME[regionKey] || region.biome;
  const biome = BIOMES[biomeKey];
  if (!biome) throw new Error(`Biome not found: ${biomeKey}`);

  const baseTier = subregion.tier ?? region.tier ?? 1;

  // WORLD STATE INTEGRATION
  const regionState = getRegionState(regionKey);
  const season = getCurrentSeason();
  const seasonData = SEASON_DEFINITIONS[season] || null;

  // Weather: world-state overrides random weather
  let weather = regionState.weather || pickFromArray(
    region.weatherPool?.length ? region.weatherPool : biome.weatherPool || []
  );

  // Seasonal weather bias (only if region doesn't override)
  if (!regionState.weather && seasonData?.weatherBias) {
    const biased = Object.entries(seasonData.weatherBias)
      .flatMap(([key, mult]) => Array(Math.floor(mult * 10)).fill(key));

    if (biased.length && Math.random() < 0.25) {
      weather = pickFromArray(biased);
    }
  }

  // Crisis
  let crisis = null;
  let crisisStage = null;
  let crisisData = null;

  if (regionState.crisis) {
    crisis = regionState.crisis;
    const def = CRISIS_DEFINITIONS[crisis];
    crisisStage = regionState.crisisStageIndex || 0;
    crisisData = def?.stages?.[crisisStage] || null;
  }

  // Event
  const eventPool = region.eventPool || [];
  const event = pickFromArray(eventPool);

  // Hazard
  const hazardPool = biome.hazards || [];
  const hazard = pickHazard(hazardPool);

  // Variant
  const variantPool = region.variantPool || [];
  const variant = pickFromArray(variantPool);

  // Phase D: anomaly / migration / global modifier
  const anomaly = rollAnomalyForEncounter(biome, regionState, seasonData);
  const migration = rollMigrationForEncounter(regionKey, biome, regionState, crisisData);
  const globalModifier = rollGlobalModifierForEncounter(seasonData);

  // Build unified encounter context
  const encounterContext = {
    region: regionKey,
    subregion: subregionKey,
    biome: biomeKey,

    weather,
    event,
    hazard,
    variant,

    crisis,
    crisisStage,
    crisisData,

    anomaly,
    migration,
    globalModifier,

    season,
    seasonData,

    flavorTags: biome.flavor || [],

    dangerLevel: regionState.dangerLevel || 1.0,
    stability: regionState.stability || 1.0,
    elementalCharge: regionState.elementalCharge || {}
  };

  // Get rarity + base family weights
  const { rarityWeights, familyWeights: baseFamilyWeights } = resolveEncounterWeights(encounterContext);
  
  // Apply identity biases (region / biome / subregion)
  const familyWeights = applyIdentityBiases(baseFamilyWeights, {
    regionId: regionKey,
    biomeId: biomeKey,
    subregionId: subregionKey
  });

  // Crisis family multipliers
  if (crisisData?.familyMult) {
    for (const [fam, mult] of Object.entries(crisisData.familyMult)) {
      if (familyWeights[fam]) {
        familyWeights[fam] = Math.floor(familyWeights[fam] * mult);
      }
    }
  }

  // Seasonal family multipliers
  if (seasonData?.encounterMult) {
    for (const [fam, mult] of Object.entries(seasonData.encounterMult)) {
      if (familyWeights[fam]) {
        familyWeights[fam] = Math.floor(familyWeights[fam] * mult);
      }
    }
  }

  // Roll rarity
  const rarity = pickWeightedObject(
    Object.fromEntries(
      Object.entries(rarityWeights).map(([k, v]) => [k, v.weight])
    )
  );

  // Roll family
  const family = pickWeightedObject(familyWeights);

  // Roll tier from rarity tiers
  const tiers = rarityWeights[rarity]?.tiers || [baseTier];
  const finalTier = pickFromArray(tiers) || baseTier;

  // Group size
  const groupRule = ENEMY_GROUP_SIZES[family] || ENEMY_GROUP_SIZES.default;
  const count =
    Math.floor(Math.random() * (groupRule.max - groupRule.min + 1)) +
    groupRule.min;

  // Build enemies
  const enemies = [];
  for (let i = 0; i < count; i++) {
    const template = enemyOverride
      ? EnemyRegistry.buildEnemyTemplate(enemyOverride)
      : pickEnemyTemplate(regionKey, subregionKey, biomeKey, family, rarity, finalTier);

    if (!template) continue;

    const instance = buildEnemyInstance(
      template,
      region,
      biome,
      rarity,
      weather,
      event,
      hazard,
      variant,
      finalTier
    );

    enemies.push(instance);
  }

  const encounter = {
    region: regionKey,
    subregion: subregionKey,
    biome: biomeKey,

    weather,
    event,
    hazard,
    variant,

    // Phase D fields
    anomaly,
    migration,
    globalModifier,

    rarity,
    tier: finalTier,
    flavor: pickFromArray(biome.flavor) || region.flavor || "",
    enemies,
    debug: {
      family,
      rarity,
      weather,
      event,
      hazard,
      variant,
      biome: biomeKey,
      tier: finalTier,
      regionKey,
      subregionKey,
      crisis,
      crisisStage,
      crisisData,
      season,
      dangerLevel: regionState.dangerLevel,
      stability: regionState.stability,
      elementalCharge: regionState.elementalCharge,
      anomaly,
      migration,
      globalModifier
    }
  };

  // Affixes
  const affixKeys = rollEncounterAffixes(Math.random() < 0.25 ? 1 : 0);
  applyAffixesToEncounter(encounter, affixKeys);

  // Dynamic scaling
  const playerLevel = WORLD_DATA.players[username]?.level || 1;
  applyDynamicScaling(encounter, playerLevel, {
    regionDanger: regionState.dangerLevel || 1.0,
    crisisIntensity: crisisData?.dangerMult || 1.0
  });

  // Rare spawns
  maybeInjectRareSpawn(encounter, EnemyRegistry.templatesByKey);
  
  // Save
  sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));
  return encounter;
}

function applyIdentityBiases(baseWeights, { regionId, biomeId, subregionId }) {
  const region = getRegionIdentity(regionId);
  const biome = getBiomeIdentity(biomeId);
  const subregion = getSubregionIdentity(regionId, subregionId);

  const weights = { ...baseWeights };

  if (biome?.encounterBias) {
    for (const [tag, delta] of Object.entries(biome.encounterBias)) {
      weights[tag] = (weights[tag] || 0) + delta;
    }
  }

  if (region?.traits) {
    for (const trait of region.traits) {
      weights[trait] = (weights[trait] || 0) + 2;
    }
  }

  if (subregion?.encounterBias) {
    for (const [tag, delta] of Object.entries(subregion.encounterBias)) {
      weights[tag] = (weights[tag] || 0) + delta;
    }
  }

  return weights;
}

// ------------------------------------------------------------
// LOAD / CLEAR
// ------------------------------------------------------------
function loadFromSession() {
  const raw = sessionStorage.getItem("currentEncounter");
  return raw ? JSON.parse(raw) : null;
}

function clear() {
  sessionStorage.removeItem("currentEncounter");
}

// ------------------------------------------------------------
// ENEMY TEMPLATE PICKER (Tier Drift Model C)
// ------------------------------------------------------------
function pickEnemyTemplate(regionKey, subregionKey, biomeKey, family, rarity, tier) {
  const allowedKeys = REGION_ENEMIES[subregionKey] || [];
  const allEnemies = Object.values(EnemyRegistry.enemies).filter(e =>
    allowedKeys.includes(e.key)
  );

  if (!allEnemies.length) {
    console.warn("No enemies for subregion", subregionKey, "— using region fallback.");
    return null;
  }

  // Build tier bands
  const exactTier = allEnemies.filter(e => (e.tier ?? 1) === tier);
  const nearTier = allEnemies.filter(e => {
    const t = e.tier ?? 1;
    return t !== tier && Math.abs(t - tier) === 1;
  });
  const farTier = allEnemies.filter(e => {
    const t = e.tier ?? 1;
    return Math.abs(t - tier) === 2;
  });

  // Decide which band to pull from (C: weighted drift)
  const bandRoll = Math.random();
  let pool;
  if (bandRoll < 0.7 && exactTier.length) {
    pool = exactTier;
  } else if (bandRoll < 0.95 && nearTier.length) {
    pool = nearTier;
  } else if (farTier.length) {
    pool = farTier;
  } else if (exactTier.length) {
    pool = exactTier;
  } else if (nearTier.length) {
    pool = nearTier;
  } else {
    pool = allEnemies;
  }

  // Filter by family if possible
  const familyPool = pool.filter(e => e.family === family);
  if (familyPool.length) pool = familyPool;

  // Filter by rarity if possible
  const rarityPool = pool.filter(e => (e.rarity || "common") === rarity);
  if (rarityPool.length) pool = rarityPool;

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return EnemyRegistry.buildEnemyTemplate(chosen.key);
}

// ------------------------------------------------------------
// ENEMY INSTANCE BUILDER
// ------------------------------------------------------------
function buildEnemyInstance(
  template,
  region,
  biome,
  rarity,
  weather,
  event,
  hazard,
  variant,
  tier
) {
  const levelRange = region.levelRange || [1, 1];
  const level = rollLevel(levelRange);
  const rarityMult = rarityScaling(rarity);
  const levelMult = 1 + (level - 1) * 0.15;

  const baseHPStat = template.baseHP ?? template.hp ?? 1;
  const baseATKStat = template.baseATK ?? template.atk ?? template.attack ?? 1;
  const baseDEFStat = template.baseDEF ?? template.def ?? template.defense ?? 0;

  const baseHP = Math.round(baseHPStat * rarityMult * levelMult);
  let finalATK = Math.round(baseATKStat * rarityMult * levelMult);
  let finalDEF = Math.round(baseDEFStat * rarityMult * levelMult);

  if (region.combatModifiers) {
    const cm = region.combatModifiers;
    if (cm.enemyATKMult) finalATK = Math.round(finalATK * cm.enemyATKMult);
    if (cm.enemyDEFMult) finalDEF = Math.round(finalDEF * cm.enemyDEFMult);
  }

  if (biome.combatModifiers) {
    const bm = biome.combatModifiers;
    if (bm.enemyATKMult) finalATK = Math.round(finalATK * bm.enemyATKMult);
    if (bm.enemyDEFMult) finalDEF = Math.round(finalDEF * bm.enemyDEFMult);
  }

  const modifiers = [];

  if (weather && WEATHER_MODIFIERS[weather]) modifiers.push(WEATHER_MODIFIERS[weather]);
  if (event && EVENT_MODIFIERS[event]) modifiers.push(EVENT_MODIFIERS[event]);
  if (hazard && HAZARD_MODIFIERS[hazard]) modifiers.push(HAZARD_MODIFIERS[hazard]);
  if (variant && VARIANT_MODIFIERS[variant]) modifiers.push(VARIANT_MODIFIERS[variant]);

  return {
    key: template.key,
    name: template.name,
    family: template.family,
    element: template.element || "neutral",
    rarity,
    tier: template.tier ?? tier,
    level,

    hp: baseHP,
    hpMax: baseHP,
    atk: finalATK,
    def: finalDEF,

    portrait: template.portrait || `/assets/enemies/${template.key}.png`,
    flavor: template.flavor || "",
    modifiers
  };
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

function pickWeightedObject(obj) {
  const entries = Object.entries(obj);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;

  for (const [key, weight] of entries) {
    if (roll < weight) return key;
    roll -= weight;
  }

  return entries[entries.length - 1][0];
}

function rollLevel([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rarityScaling(rarity) {
  switch ((rarity || "common").toLowerCase()) {
    case "common": return 1.0;
    case "uncommon": return 1.1;
    case "rare": return 1.25;
    case "epic": return 1.45;
    case "elite": return 1.65;
    case "mythical": return 1.9;
    case "legendary": return 2.2;
    case "ancient": return 2.6;
    default: return 1.0;
  }
}

// ------------------------------------------------------------
// PHASE D ROLL HELPERS
// ------------------------------------------------------------

function rollAnomalyForEncounter(biome, regionState, seasonData) {
  // Low baseline chance; anomalies should feel special
  if (Math.random() > 0.20) return null;

  const biomeTags = biome?.tags || [];
  const candidates = [];

  for (const anomaly of Object.values(ANOMALIES)) {
    const tags = anomaly.tags || [];
    let weight = 1;

    // Simple biome-tag synergy (e.g., volcanic -> fire, swamp -> fungus)
    if (biomeTags.includes("volcanic") && tags.includes("fire")) weight += 3;
    if (biomeTags.includes("swamp") && tags.includes("fungus")) weight += 3;
    if (biomeTags.includes("frost") && tags.includes("frost")) weight += 3;
    if (biomeTags.includes("arcane") && tags.includes("arcane")) weight += 3;

    // Region instability increases anomaly chance/weight
    const instability = 1 - (regionState?.stability ?? 1);
    weight += Math.max(0, Math.floor(instability * 5));

    if (weight > 0) {
      candidates.push({ key: anomaly.key, weight });
    }
  }

  if (!candidates.length) return null;
  return pickWeightedObject(Object.fromEntries(candidates.map(c => [c.key, c.weight])));
}

function rollMigrationForEncounter(regionKey, biome, regionState, crisisData) {
  // Migrations are more likely during beast/monster crises
  const hasCrisis = !!crisisData;
  const baseChance = hasCrisis ? 0.35 : 0.15;
  if (Math.random() > baseChance) return null;

  const biomeTags = biome?.tags || [];
  const candidates = [];

  for (const mig of Object.values(MIGRATIONS)) {
    const tags = mig.tags || [];
    let weight = 1;

    if (mig.movementType === "air" && biomeTags.includes("mountain")) weight += 2;
    if (mig.movementType === "air" && biomeTags.includes("coastal")) weight += 2;
    if (mig.movementType === "ground" && biomeTags.includes("forest")) weight += 2;
    if (mig.movementType === "ground" && biomeTags.includes("plains")) weight += 2;

    // Beast/void crises amplify related migrations
    if (crisisData?.tags?.includes("beast") && tags.includes("beast")) weight += 3;
    if (crisisData?.tags?.includes("void") && tags.includes("void")) weight += 3;

    if (weight > 0) {
      candidates.push({ key: mig.key, weight });
    }
  }

  if (!candidates.length) return null;
  return pickWeightedObject(Object.fromEntries(candidates.map(c => [c.key, c.weight])));
}

function rollGlobalModifierForEncounter(seasonData) {
  // Global modifiers are rare, world-feeling events
  if (Math.random() > 0.05) return null;

  const candidates = [];

  for (const gm of Object.values(GLOBAL_PHASED_MODIFIERS)) {
    let weight = 1;

    // Simple seasonal synergy
    if (seasonData?.key === "winter" && gm.tags?.includes("winter")) weight += 3;
    if (seasonData?.key === "spring" && gm.tags?.includes("nature")) weight += 3;
    if (seasonData?.key === "summer" && gm.tags?.includes("solar")) weight += 3;
    if (seasonData?.key === "autumn" && gm.tags?.includes("rift")) weight += 2;

    candidates.push({ key: gm.key, weight });
  }

  if (!candidates.length) return null;
  return pickWeightedObject(Object.fromEntries(candidates.map(c => [c.key, c.weight])));
}

// ------------------------------------------------------------
// MODIFIER TABLES
// ------------------------------------------------------------
const WEATHER_MODIFIERS = {
  rain: { icon: "rain.png", text: "Rain: +10% lightning damage" },
  clear: { icon: "sun.png", text: "Clear Skies: No special effects" },
  storm: { icon: "storm.png", text: "Storm: +15% lightning damage" },
  heatwave: { icon: "heat.png", text: "Heatwave: +10% fire damage" },
  arcane_winds: { icon: "arcane.png", text: "Arcane Winds: +10% arcane damage" }
};

const EVENT_MODIFIERS = {
  beast_migration: { icon: "paw.png", text: "Beast Migration: Beast enemies gain +10% HP" },
  cosmic_flux: { icon: "cosmic.png", text: "Cosmic Flux: +10% arcane damage" },
  timeline_echo: { icon: "time.png", text: "Timeline Echo: Random stat fluctuations" },
  scorched_earth: { icon: "fire.png", text: "Scorched Earth: +10% fire damage" },
  titanic_footfall: { icon: "titan.png", text: "Titanic Footfall: +10% earth damage" }
};

const HAZARD_MODIFIERS = {
  hidden_root_snare: { icon: "snare.png", text: "Hazard: Root Snare reduces mobility" },
  root_pitfall: { icon: "pitfall.png", text: "Hazard: Pitfall reduces defense" },
  bewitching_spores: { icon: "spores.png", text: "Hazard: Spores increase confusion chance" }
};

const VARIANT_MODIFIERS = {
  enraged: { icon: "rage.png", text: "Variant: Enraged enemy deals +20% damage" },
  colossal: { icon: "colossal.png", text: "Variant: Colossal enemy has +40% HP" }
};

// encounters.js
// Subregion-aware, tier-drift encounter engine

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { EnemyRegistry } from "./enemy-registry.js";
import { ENEMY_GROUP_SIZES } from "./enemy-group-sizes.js";
import { REGION_ENEMIES } from "./region-enemies.js";
import { REGION_HIERARCHY } from "./region-hierarchy.js";

export function initEncounters() {
  return true;
}

export const EncounterEngine = {
  generate,
  loadFromSession,
  clear
};

// ------------------------------------------------------------
// MAIN ENTRY POINT
// ------------------------------------------------------------
function generate(regionKey, subregionKey, username, enemyOverride = null) {
  const region = WORLD_DATA.regions[regionKey];
  if (!region) throw new Error(`Unknown region: ${regionKey}`);

  const subregionList = REGION_HIERARCHY[regionKey].subregions || [];
  const subregion = subregionList.find(sr => sr.key === subregionKey);
  if (!subregion) throw new Error(`Unknown subregion: ${subregionKey} in ${regionKey}`);

  const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
  const biome = BIOMES[biomeKey];
  if (!biome) throw new Error(`Biome not found: ${biomeKey}`);

  const tier = subregion.tier ?? region.tier ?? 1;

  // WEATHER / EVENT / HAZARD / VARIANT (still simple for now)
  const weatherPool = region.weatherPool?.length
    ? region.weatherPool
    : biome.weatherPool || [];
  const weather = pickFromArray(weatherPool);

  const eventPool = region.eventPool || [];
  const event = pickFromArray(eventPool);

  const hazardPool = biome.hazards || [];
  const hazard = pickHazard(hazardPool);

  const variantPool = region.variantPool || [];
  const variant = pickFromArray(variantPool);

  const rarity = pickWeighted(region.rarityWeights);
  const family = pickWeightedObject(biome.encounterWeights);

  const groupRule = ENEMY_GROUP_SIZES[family] || ENEMY_GROUP_SIZES.default;
  const count =
    Math.floor(Math.random() * (groupRule.max - groupRule.min + 1)) +
    groupRule.min;

  const enemies = [];
  for (let i = 0; i < count; i++) {
    const template = enemyOverride
      ? EnemyRegistry.buildEnemyTemplate(enemyOverride)
      : pickEnemyTemplate(regionKey, subregionKey, biomeKey, family, rarity, tier);

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
      tier
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
    rarity,
    tier,
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
      tier,
      regionKey,
      subregionKey
    }
  };

  sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));
  return encounter;
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

function pickWeighted(pool) {
  if (!pool || !pool.length) return "common";

  const total = pool.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;

  for (const entry of pool) {
    if (roll < entry.weight) return entry.id;
    roll -= entry.weight;
  }

  return pool[pool.length - 1].id;
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
// MODIFIER TABLES (placeholder icons/text)
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

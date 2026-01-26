// encounters.js
// GitHub‑native Encounter Engine
// Uses WORLD_DATA (region metadata), BIOMES (biome metadata),
// and REGION_TO_BIOME (region → biome mapping).

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { EnemyRegistry } from "./enemy-registry.js";


// Expose public API
export const EncounterEngine = {
  generate,
  loadFromSession,
  clear
};

// ------------------------------------------------------------
// MAIN ENTRY POINT
// ------------------------------------------------------------
function generate(regionKey, username, enemyOverride = null) {
  const region = WORLD_DATA.regions[regionKey];
  if (!region) throw new Error(`Unknown region: ${regionKey}`);

  // Resolve biome
  const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
  const biome = BIOMES[biomeKey];
  if (!biome) throw new Error(`Biome not found: ${biomeKey}`);

  // ------------------------------------------------------------
  // WEATHER
  // Region weather overrides biome weather if present
  const weatherPool = region.weatherPool?.length
    ? region.weatherPool
    : biome.weatherPool || [];

  const weather = pickFromArray(weatherPool);

  // ------------------------------------------------------------
  // EVENTS
  const eventPool = region.eventPool || [];
  const event = pickFromArray(eventPool);

  // ------------------------------------------------------------
  // HAZARDS (biome-level)
  const hazardPool = biome.hazards || [];
  const hazard = pickHazard(hazardPool);

  // ------------------------------------------------------------
  // VARIANTS (region-level)
  const variantPool = region.variantPool || [];
  const variant = pickFromArray(variantPool);

  // ------------------------------------------------------------
  // RARITY (region-level)
  const rarity = pickWeighted(region.rarityWeights);

  // ------------------------------------------------------------
  // ENEMY FAMILY (biome-level)
  const family = pickWeightedObject(biome.encounterWeights);

  // ------------------------------------------------------------
  // PICK ENEMY TEMPLATE
  const template = enemyOverride
    ? ENEMY_TEMPLATES[enemyOverride]
    : pickEnemyTemplate(family, rarity);

  if (!template) {
    throw new Error(
      `No enemy template found for family=${family}, rarity=${rarity}`
    );
  }

  // ------------------------------------------------------------
  // BUILD ENEMY INSTANCE
  const enemy = buildEnemyInstance(
    template,
    region,
    biome,
    rarity,
    weather,
    event,
    hazard,
    variant
  );

  // ------------------------------------------------------------
  // FINAL ENCOUNTER OBJECT
  const encounter = {
    region: regionKey,
    biome: biomeKey,
    weather,
    event,
    hazard,
    variant,
    rarity,
    flavor: pickFromArray(biome.flavor) || region.flavor || "",
    enemy,
    debug: {
      family,
      rarity,
      weather,
      event,
      hazard,
      variant,
      biome: biomeKey
    }
  };

  // Save to sessionStorage
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
  variant
) {
  const level = rollLevel(region.levelRange);
  const rarityMult = rarityScaling(rarity);

  const baseHP = Math.round(template.baseHP * rarityMult * region.lootModifier);
  const baseATK = Math.round(template.attack * rarityMult);
  const baseDEF = Math.round(template.defense * rarityMult);

  const modifiers = [];

  // Weather modifiers
  if (weather && WEATHER_MODIFIERS[weather]) {
    modifiers.push(WEATHER_MODIFIERS[weather]);
  }

  // Event modifiers
  if (event && EVENT_MODIFIERS[event]) {
    modifiers.push(EVENT_MODIFIERS[event]);
  }

  // Hazard modifiers
  if (hazard && HAZARD_MODIFIERS[hazard]) {
    modifiers.push(HAZARD_MODIFIERS[hazard]);
  }

  // Variant modifiers
  if (variant && VARIANT_MODIFIERS[variant]) {
    modifiers.push(VARIANT_MODIFIERS[variant]);
  }

  // Region combat modifiers
  if (region.combatModifiers) {
    const cm = region.combatModifiers;

    if (cm.enemyATKMult && cm.enemyATKMult > 1) {
      modifiers.push({
        icon: "atk_up.png",
        text: "Region: Enemy attack increased"
      });
    }

    if (cm.enemyDEFMult && cm.enemyDEFMult > 1) {
      modifiers.push({
        icon: "def_up.png",
        text: "Region: Enemy defense increased"
      });
    }
  }

  // Biome combat modifiers
  if (biome.combatModifiers) {
    const bm = biome.combatModifiers;

    if (bm.enemyATKMult && bm.enemyATKMult > 1) {
      modifiers.push({
        icon: "atk_up.png",
        text: "Biome: Enemy attack empowered"
      });
    }

    if (bm.enemyDEFMult && bm.enemyDEFMult > 1) {
      modifiers.push({
        icon: "def_up.png",
        text: "Biome: Enemy defense empowered"
      });
    }
  }

  return {
    key: template.key,
    name: template.name,
    family: template.family,
    element: template.element || "neutral",
    rarity,
    level,

    hp: baseHP,
    hpMax: baseHP,
    attack: baseATK,
    defense: baseDEF,

    portrait: template.portrait || `/assets/enemies/${template.key}.png`,
    flavor: template.flavor || "",
    modifiers
  };
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function pickFromArray(arr) {
  if (!arr || arr.length === 0) return null;
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
  if (!pool || !pool.length) return null;

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

function pickEnemyTemplate(family, rarity) {
  const all = EnemyRegistry.enemies || [];

  const candidates = all.filter(e =>
    e.family === family &&
    e.rarity.toLowerCase() === rarity.toLowerCase()
  );

  if (!candidates.length) return null;

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return EnemyRegistry.buildEnemyTemplate(chosen.key);
}

function rollLevel([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rarityScaling(rarity) {
  switch (rarity.toLowerCase()) {
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
// WEATHER / EVENT / HAZARD / VARIANT MODIFIERS
// (You can expand these as needed)
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

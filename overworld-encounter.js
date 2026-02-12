// overworld-encounter.js — Phase 4 Overworld Encounter Engine (World-Event Mutations)

import { WORLD_DATA } from "./world-data.js";
import { getWorldState } from "./world-state.js";
import { getRegionAtPixel } from "./world-map-data.js";
import { seededRNG } from "./rng.js";
import { generateRegionEncounter } from "./region-encounters.js";
import { WeatherEngine } from "./weather-engine.js";

// EncounterEngine.generate() is used for region-info → fight
import { EncounterEngine } from "./encounters.js";

// --- Encounter chance tuning ---
const BASE_ENCOUNTER_CHANCE = 0.02; // 2% per tile step

// --- Seed & Relic Modifiers ---
function getSeedAndRelicEncounterMods(player) {
  const mods = {
    encounterRateMult: 1.0,
    rareSpawnMult: 1.0,
    chaosChance: 0.0,
    blessedBonus: false,
    cursedBonus: false,
    lootBonus: false,
    chaosBonus: false,
    bossrushBonus: false
  };

  const meta = player.seedMeta || {};
  const relics = player.relics || [];

  if (meta.blessedClears > 0) {
    mods.encounterRateMult *= 0.9;
    mods.blessedBonus = true;
  }
  if (meta.cursedClears > 0) {
    mods.encounterRateMult *= 1.2;
    mods.rareSpawnMult *= 1.2;
    mods.cursedBonus = true;
  }
  if (meta.lootClears > 0) {
    mods.rareSpawnMult *= 1.3;
    mods.lootBonus = true;
  }
  if (meta.chaosClears > 0) {
    mods.chaosChance += 0.15;
    mods.chaosBonus = true;
  }
  if (meta.bossrushClears > 0) {
    mods.rareSpawnMult *= 1.15;
    mods.bossrushBonus = true;
  }

  // Relics
  if (relics.includes("chaos_orb")) mods.chaosChance += 0.10;
  if (relics.includes("golden_idol")) mods.rareSpawnMult *= 1.25;
  if (relics.includes("cursed_crown")) mods.encounterRateMult *= 1.15;

  return mods;
}

/************************************************************
 * WORLD EVENT → ENCOUNTER MUTATIONS
 ************************************************************/
function applyWorldEventMutations(regionKey, encounter, worldState, regionState) {
  const global = worldState.global || {};
  const mods = encounter.modifiers;

  /***********************
   * CRISIS + DANGER
   ***********************/
  if (encounter.crisis) {
    mods.push(`crisis_${encounter.crisis}`);
    // Crisis tends to push encounters up a notch
    if (encounter.rarity === "common") encounter.rarity = "uncommon";
    else if (encounter.rarity === "uncommon") encounter.rarity = "rare";
  }

  const danger = Number(regionState.dangerLevel ?? 1.0);
  if (danger >= 3.5) mods.push("danger_extreme");
  else if (danger >= 2.5) mods.push("danger_high");
  else if (danger >= 1.5) mods.push("danger_medium");
  else mods.push("danger_low");

  /***********************
   * WEATHER FRONTS
   ***********************/
  for (const front of global.weatherFronts || []) {
    const currentRegion = front.path[front.position];
    if (currentRegion !== regionKey) continue;

    mods.push("weather_front");

    if (front.weatherKey === "storm") {
      mods.push("storm_front");
      // Storm → lightning / chaos flavor
      encounter.weather = "storm";
      if (!encounter.chaosMutated && Math.random() < 0.15) {
        encounter.chaosMutated = true;
        mods.push("storm_chaos");
      }
    } else if (front.weatherKey === "heatwave") {
      mods.push("heatwave_front");
      mods.push("fire_charged");
    } else if (front.weatherKey === "void_storm") {
      mods.push("void_front");
      encounter.weather = "void_storm";
      if (!encounter.chaosMutated) {
        encounter.chaosMutated = true;
        mods.push("void_corruption");
      }
    } else {
      mods.push(`front_${front.weatherKey}`);
    }

    // Intensity nudges rarity
    if ((front.intensity || 1) >= 2) {
      if (encounter.rarity === "common") encounter.rarity = "uncommon";
      else if (encounter.rarity === "uncommon") encounter.rarity = "rare";
    }
  }

  /***********************
   * MIGRATIONS
   ***********************/
  for (const mig of global.migrations || []) {
    const currentRegion = mig.path[mig.position];
    if (currentRegion !== regionKey) continue;

    mods.push("migration_active");
    mods.push(`migration_${mig.faction}`);

    // Migration tends to increase density / threat
    if (encounter.rarity === "common") encounter.rarity = "uncommon";

    // Tag family contextually without hard remap
    encounter.migrationFaction = mig.faction;
  }

  /***********************
   * ANOMALIES
   ***********************/
  for (const anomaly of global.anomalies || []) {
    if (anomaly.region !== regionKey) continue;

    const elem = anomaly.element || "unknown";
    mods.push("anomaly_active");
    mods.push(`anomaly_${elem}`);

    // Elemental anomalies bias encounter flavor
    encounter.anomalyElement = elem;

    // Strong anomalies can force chaos
    if ((anomaly.intensity || 1) >= 2 && !encounter.chaosMutated) {
      encounter.chaosMutated = true;
      mods.push("anomaly_chaos");
    }
  }

  /***********************
   * GLOBAL MODIFIERS
   ***********************/
  for (const mod of global.globalModifiers || []) {
    if (mod.expired) continue;

    mods.push(`global_${mod.key || "modifier"}`);

    switch (mod.key) {
      case "increased_monsters":
        mods.push("horde_pressure");
        break;
      case "rare_creatures":
        mods.push("rare_bias");
        if (encounter.rarity === "common") encounter.rarity = "uncommon";
        else if (encounter.rarity === "uncommon") encounter.rarity = "rare";
        break;
      case "elemental_surge":
        mods.push("elemental_surge_world");
        break;
      case "void_incursion":
        mods.push("void_incursion_world");
        if (!encounter.chaosMutated) {
          encounter.chaosMutated = true;
          mods.push("void_incursion_chaos");
        }
        break;
      default:
        break;
    }
  }

  return encounter;
}

/************************************************************
 * MAIN OVERWORLD ENCOUNTER CHECK
 ************************************************************/
export function checkForOverworldEncounter(player) {
  const pos = player.position;
  const regionKey = getRegionAtPixel(pos.x, pos.y);
  if (!regionKey) return;

  const region = WORLD_DATA.regions[regionKey];
  if (!region) return;

  const worldState = getWorldState();
  const regionState = worldState.regions[regionKey] || {};

  // Safe zones (towns, capitals)
  if (region.safeZone) return;

  // Seed & relic modifiers
  const metaMods = getSeedAndRelicEncounterMods(player);

  // World event multipliers (from overworld.js)
  const eventEncounterMult = player._eventEncounterMult || 1.0;
  const eventRareMult = player._eventRareMult || 1.0;

  // Region encounter rate
  const encounterRate =
    BASE_ENCOUNTER_CHANCE *
    region.encounterRateMult *
    metaMods.encounterRateMult *
    eventEncounterMult;

  if (Math.random() > encounterRate) return;

  // Weather
  const weatherKey =
    regionState.weather ||
    WeatherEngine.rollWeather(regionKey);

  // Crisis modifier
  const crisis = regionState.crisis || null;
  const crisisMult = crisis ? 1.25 : 1.0;

  // Rare spawn chance
  const rareMult =
    region.rareSpawnMult *
    metaMods.rareSpawnMult *
    crisisMult *
    eventRareMult;

  // RNG
  const rng = seededRNG(regionKey + Date.now());

  // Generate base encounter (family + rarity)
  const base = generateRegionEncounter(regionKey, rng());

  // Chaos mutation?
  let chaosMutated = false;
  if (rng() < metaMods.chaosChance) {
    chaosMutated = true;
  }

  // Rare spawn upgrade?
  let rarity = base.rarity;
  if (rng() < rareMult * 0.01) {
    rarity = "rare";
  }

  // Build encounter object
  const encounter = {
    type: "overworld",
    region: regionKey,
    biome: region.biome,
    weather: weatherKey,
    crisis,
    danger: regionState.dangerLevel ?? 1.0,
    rarity,
    family: base.family,
    chaosMutated,
    modifiers: []
  };

  // Seed & relic modifiers → encounter.modifiers
  if (metaMods.blessedBonus) encounter.modifiers.push("blessed_world");
  if (metaMods.cursedBonus) encounter.modifiers.push("cursed_world");
  if (metaMods.lootBonus) encounter.modifiers.push("loot_world");
  if (metaMods.chaosBonus) encounter.modifiers.push("chaos_world");
  if (metaMods.bossrushBonus) encounter.modifiers.push("bossrush_world");

  // Relics
  if (player.relics?.includes("chaos_orb")) encounter.modifiers.push("chaos_flux");
  if (player.relics?.includes("golden_idol")) encounter.modifiers.push("treasure_magnet");
  if (player.relics?.includes("cursed_crown")) encounter.modifiers.push("cursed_pressure");
  if (player.relics?.includes("blessed_feather")) encounter.modifiers.push("healing_winds");

  // World events → mutate encounter
  applyWorldEventMutations(regionKey, encounter, worldState, regionState);

  // Save encounter → region-encounter.html
  sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));

  // Redirect to encounter preview
  window.location.href = "region-encounter.html";
}

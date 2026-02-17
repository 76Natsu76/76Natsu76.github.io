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
import { PROFESSION_IDENTITY } from "./profession-identity.js";
import { ELEMENT_IDENTITY } from "./element-identity.js";
import { SUBRACE_IDENTITY } from "./subrace-identity.js";
import { VARIANT_IDENTITY } from "./variant-identity.js";
// Phase D taxonomy (environmental categories)
import {
  WEATHER_TYPES,
  ANOMALIES,
  MIGRATIONS,
  GLOBAL_MODIFIERS as GLOBAL_PHASED_MODIFIERS
} from "./environment-taxonomy.js";
import { selectAbilitiesForEnemy } from "./ability-selector.js";


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

function applyStatMods(base, mods) {
  return {
    hp: Math.round(base.hp * (mods.hp ?? 1)),
    atk: Math.round(base.atk * (mods.atk ?? 1)),
    def: Math.round(base.def * (mods.def ?? 1)),
    spd: Math.round(base.spd * (mods.spd ?? 1))
  };
}

function applyAdditiveStats(base, add) {
  return {
    hp: base.hp + (add.hp ?? 0),
    atk: base.atk + (add.atk ?? 0),
    def: base.def + (add.def ?? 0),
    spd: base.spd + (add.spd ?? 0)
  };
}

function mergeArrays(a = [], b = []) {
  return Array.from(new Set([...a, ...b]));
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

  // WORLD STATE
  const regionState = getRegionState(regionKey);
  const season = getCurrentSeason();
  const seasonData = SEASON_DEFINITIONS[season] || null;

  // WEATHER
  let weather = regionState.weather || pickFromArray(
    region.weatherPool?.length ? region.weatherPool : biome.weatherPool || []
  );

  if (!regionState.weather && seasonData?.weatherBias) {
    const biased = Object.entries(seasonData.weatherBias)
      .flatMap(([key, mult]) => Array(Math.floor(mult * 10)).fill(key));
    if (biased.length && Math.random() < 0.25) {
      weather = pickFromArray(biased);
    }
  }

  // CRISIS
  let crisis = null;
  let crisisStage = null;
  let crisisData = null;

  if (regionState.crisis) {
    crisis = regionState.crisis;
    const def = CRISIS_DEFINITIONS[crisis];
    crisisStage = regionState.crisisStageIndex || 0;
    crisisData = def?.stages?.[crisisStage] || null;
  }

  // EVENT / HAZARD / VARIANT
  const event = pickFromArray(region.eventPool || []);
  const hazard = pickHazard(biome.hazards || []);
  const variant = pickFromArray(region.variantPool || []);

  // PHASE D: anomaly / migration / global
  const anomaly = rollAnomalyForEncounter(biome, regionState, seasonData);
  const migration = rollMigrationForEncounter(regionKey, biome, regionState, crisisData);
  const globalModifier = rollGlobalModifierForEncounter(seasonData);

  // ENCOUNTER CONTEXT
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

  // ============================================================
  // 1. BASE WEIGHTS
  // ============================================================
  let { rarityWeights, familyWeights } = resolveEncounterWeights(encounterContext);

  // ============================================================
  // 2. PHASE E IDENTITY BIAS (region / biome / subregion)
  // ============================================================
  familyWeights = applyIdentityBiases(familyWeights, {
    regionId: regionKey,
    biomeId: biomeKey,
    subregionId: subregionKey
  });

  // ============================================================
  // 3. PHASE F IDENTITY BIAS (profession / element / subrace)
  // ============================================================
  familyWeights = applyIdentityFamilyBiases(familyWeights, {
    regionId: regionKey,
    biomeId: biomeKey,
    subregionId: subregionKey
  });

  // ============================================================
  // 4. CRISIS + SEASON MULTIPLIERS
  // ============================================================
  if (crisisData?.familyMult) {
    for (const [fam, mult] of Object.entries(crisisData.familyMult)) {
      if (familyWeights[fam]) {
        familyWeights[fam] = Math.floor(familyWeights[fam] * mult);
      }
    }
  }

  if (seasonData?.encounterMult) {
    for (const [fam, mult] of Object.entries(seasonData.encounterMult)) {
      if (familyWeights[fam]) {
        familyWeights[fam] = Math.floor(familyWeights[fam] * mult);
      }
    }
  }

  // ============================================================
  // 5. ROLL RARITY + FAMILY + TIER
  // ============================================================
  const rarity = pickWeightedObject(
    Object.fromEntries(
      Object.entries(rarityWeights).map(([k, v]) => [k, v.weight])
    )
  );

  const family = pickWeightedObject(familyWeights);

  const tiers = rarityWeights[rarity]?.tiers || [baseTier];
  const finalTier = pickFromArray(tiers) || baseTier;

  // ============================================================
  // 6. GROUP SIZE
  // ============================================================
  const groupRule = ENEMY_GROUP_SIZES[family] || ENEMY_GROUP_SIZES.default;
  const count =
    Math.floor(Math.random() * (groupRule.max - groupRule.min + 1)) +
    groupRule.min;

  // ============================================================
  // 7. BUILD ENEMIES
  // ============================================================
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

  // ============================================================
  // 8. FINAL ENCOUNTER OBJECT
  // ============================================================
  const encounter = {
    region: regionKey,
    subregion: subregionKey,
    biome: biomeKey,
    weather,
    event,
    hazard,
    variant,
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

  // ============================================================
  // 9. AFFIXES + SCALING + RARE SPAWNS
  // ============================================================
  const affixKeys = rollEncounterAffixes(Math.random() < 0.25 ? 1 : 0);
  applyAffixesToEncounter(encounter, affixKeys);

  const playerLevel = WORLD_DATA.players[username]?.level || 1;
  applyDynamicScaling(encounter, playerLevel, {
    regionDanger: regionState.dangerLevel || 1.0,
    crisisIntensity: crisisData?.dangerMult || 1.0
  });

  maybeInjectRareSpawn(encounter, EnemyRegistry.templatesByKey);

  // SAVE
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

function applyIdentityFamilyBiases(familyWeights, ctx) {
  const { regionId, biomeId, subregionId } = ctx;

  const region = REGION_IDENTITY[regionId] || {};
  const biome = BIOME_IDENTITY[biomeId] || {};
  const subregion = SUBREGION_IDENTITY[regionId]?.[subregionId] || {};

  const result = { ...familyWeights };

  const layers = [region, biome, subregion];

  for (const layer of layers) {
    if (layer.professionBias) {
      for (const [prof, delta] of Object.entries(layer.professionBias)) {
        if (result[prof] != null) result[prof] += delta;
      }
    }
    if (layer.elementBias) {
      for (const [elem, delta] of Object.entries(layer.elementBias)) {
        if (result[elem] != null) result[elem] += delta;
      }
    }
    if (layer.subraceBias) {
      for (const [race, delta] of Object.entries(layer.subraceBias)) {
        if (result[race] != null) result[race] += delta;
      }
    }
  }

  return result;
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
  variantKey,
  tier
) {
  // ------------------------------------------------------------
  // 1. Base stats from template
  // ------------------------------------------------------------
  const levelRange = region.levelRange || [1, 1];
  const level = rollLevel(levelRange);
  const rarityMult = rarityScaling(rarity);
  const levelMult = 1 + (level - 1) * 0.15;

  let stats = {
    hp: (template.baseHP ?? template.hp ?? 1) * rarityMult * levelMult,
    atk: (template.baseATK ?? template.atk ?? template.attack ?? 1) * rarityMult * levelMult,
    def: (template.baseDEF ?? template.def ?? template.defense ?? 0) * rarityMult * levelMult,
    spd: template.baseSPD ?? template.spd ?? template.speed ?? 10
  };

  // ------------------------------------------------------------
  // 2. Profession Identity
  // ------------------------------------------------------------
  const prof = PROFESSION_IDENTITY[template.profession] || null;
  if (prof?.statProfile) {
    stats = applyAdditiveStats(stats, prof.statProfile);
  }

  // ------------------------------------------------------------
  // 3. Element Identity
  // ------------------------------------------------------------
  const elem = ELEMENT_IDENTITY[template.element] || null;
  let resistances = [];
  let weaknesses = [];

  if (elem) {
    // Element doesn't modify stats directly, but affects combat later
    // Resistances/weaknesses come from subrace, not element
  }

  // ------------------------------------------------------------
  // 4. Subrace Identity
  // ------------------------------------------------------------
  const sub = SUBRACE_IDENTITY[template.subrace] || null;
  if (sub?.statMods) {
    stats = applyAdditiveStats(stats, sub.statMods);
  }
  if (sub?.resistances) resistances = mergeArrays(resistances, sub.resistances);
  if (sub?.weaknesses) weaknesses = mergeArrays(weaknesses, sub.weaknesses);

  // ------------------------------------------------------------
  // 5. Variant Identity
  // ------------------------------------------------------------
  const variant = VARIANT_IDENTITY[variantKey] || VARIANT_IDENTITY["normal"];
  if (variant?.statMults) {
    stats = applyStatMods(stats, variant.statMults);
  }

  // ------------------------------------------------------------
  // 6. Region & Biome Combat Modifiers
  // ------------------------------------------------------------
  if (region.combatModifiers) {
    const cm = region.combatModifiers;
    if (cm.enemyATKMult) stats.atk *= cm.enemyATKMult;
    if (cm.enemyDEFMult) stats.def *= cm.enemyDEFMult;
  }

  if (biome.combatModifiers) {
    const bm = biome.combatModifiers;
    if (bm.enemyATKMult) stats.atk *= bm.enemyATKMult;
    if (bm.enemyDEFMult) stats.def *= bm.enemyDEFMult;
    if (bm.enemyEvasionMult) stats.spd *= bm.enemyEvasionMult;
  }

  // ------------------------------------------------------------
  // 7. Build modifiers array (weather, event, hazard, variant effects)
  // ------------------------------------------------------------
  const modifiers = [];

  if (weather && WEATHER_MODIFIERS[weather]) modifiers.push(WEATHER_MODIFIERS[weather]);
  if (event && EVENT_MODIFIERS[event]) modifiers.push(EVENT_MODIFIERS[event]);
  if (hazard && HAZARD_MODIFIERS[hazard]) modifiers.push(HAZARD_MODIFIERS[hazard]);

  if (variant?.effects?.length) {
    for (const eff of variant.effects) modifiers.push(`variant_${eff}`);
  }

  // ------------------------------------------------------------
  // 8. Final enemy object
  // ------------------------------------------------------------
  const final = {
    key: template.key,
    name: template.name,
    family: template.family,
    profession: template.profession,
    element: template.element || "neutral",
    subrace: template.subrace || "unknown",
    variant: variantKey,

    rarity,
    tier: template.tier ?? tier,
    level,

    hp: Math.round(stats.hp),
    hpMax: Math.round(stats.hp),
    atk: Math.round(stats.atk),
    def: Math.round(stats.def),
    spd: Math.round(stats.spd),

    resistances,
    weaknesses,

    portrait: template.portrait || `/assets/enemies/${template.key}.png`,
    flavor: template.flavor || "",
    flavorTags: [
      ...(prof?.behavior || []),
      ...(variant?.tags || []),
      ...(sub?.behavior || [])
    ],

    modifiers
  };
  
  const abilityPool = EnemyRegistry.abilitiesByFamily[template.family] 
                 || EnemyRegistry.abilitiesByProfession[template.profession]
                 || EnemyRegistry.defaultAbilities;
  
  const abilities = selectAbilitiesForEnemy(final, abilityPool);
  final.abilities = abilities;

  
  if (variant === "enraged") final.abilities.push(EnemyRegistry.specialAbilities["frenzy-strike"]);
  if (variant === "void-touched") final.abilities.push(EnemyRegistry.specialAbilities["entropy-pulse"]);
  if (variant === "frostbitten") final.abilities.push(EnemyRegistry.specialAbilities["frost-nova"]);

  return final;
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

// encounter-resolver.js

import { ENCOUNTER_RULES } from "./encounter-rules.js";

export function resolveEncounterWeights(context) {
  const {
    regionKey,
    subregionKey,
    biomeKey,
    weatherKey,
    crisisKey,
    eventKey,
    flavorTags
  } = context;

  // -----------------------------
  // 1. Region rarity weights
  // -----------------------------
  const baseRegion = ENCOUNTER_RULES.region[regionKey]?.weights || {};

  // -----------------------------
  // 2. Biome family weights
  // -----------------------------
  const biomeFam = ENCOUNTER_RULES.biome[biomeKey]?.families || {};

  // -----------------------------
  // 3. Weather modifiers
  // -----------------------------
  const weather = ENCOUNTER_RULES.weather[weatherKey] || {};

  // -----------------------------
  // 4. Crisis modifiers
  // -----------------------------
  const crisis = crisisKey ? ENCOUNTER_RULES.crisis[crisisKey] || {} : {};

  // -----------------------------
  // 5. Event modifiers
  // -----------------------------
  const event = eventKey ? ENCOUNTER_RULES.event[eventKey] || {} : {};

  // -----------------------------
  // 6. Subregion modifiers
  // -----------------------------
  const subregion = subregionKey ? ENCOUNTER_RULES.subregion[subregionKey] || {} : {};

  // -----------------------------
  // 7. FlavorTag modifiers
  // -----------------------------
  const flavor = {};
  for (const tag of flavorTags || []) {
    const f = ENCOUNTER_RULES.flavor[tag];
    if (f) {
      flavor[f.family] = (flavor[f.family] || 0) + f.weight;
    }
  }

  // -----------------------------
  // MERGE RARITY WEIGHTS
  // -----------------------------
  const rarityWeights = { ...baseRegion };

  const rarityMults = {
    ...(weather.rarityMult || {}),
    ...(event.rarityMult || {})
  };

  for (const r in rarityMults) {
    if (rarityWeights[r]) {
      rarityWeights[r] = {
        ...rarityWeights[r],
        weight: Math.floor(rarityWeights[r].weight * rarityMults[r])
      };
    }
  }

  // -----------------------------
  // MERGE FAMILY WEIGHTS
  // -----------------------------
  const familyWeights = { ...biomeFam };

  const famMults = {
    ...(weather.familyMult || {}),
    ...(crisis.familyMult || {}),
    ...(event.familyMult || {}),
    ...(subregion.familyMult || {})
  };

  for (const fam in famMults) {
    if (familyWeights[fam]) {
      familyWeights[fam] = Math.floor(familyWeights[fam] * famMults[fam]);
    }
  }

  // Add flavorTag weights
  for (const fam in flavor) {
    familyWeights[fam] = (familyWeights[fam] || 0) + flavor[fam];
  }

  return { rarityWeights, familyWeights };
}

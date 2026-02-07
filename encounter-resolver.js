// encounter-resolver.js

import { ENCOUNTER_RULES } from "./encounter-rules.js";

export function resolveEncounterWeights(context) {
  const { regionKey, biomeKey, weatherKey, crisisKey, eventKey } = context;

  const baseRegion = ENCOUNTER_RULES.region[regionKey]?.weights || {};
  const biomeFam   = ENCOUNTER_RULES.biome[biomeKey]?.families || {};
  const weather    = ENCOUNTER_RULES.weather[weatherKey] || {};
  const crisis     = crisisKey ? ENCOUNTER_RULES.crisis[crisisKey] || {} : {};
  const event      = eventKey ? ENCOUNTER_RULES.event[eventKey] || {} : {};

  // rarity weights
  const rarityWeights = { ...baseRegion };
  if (weather.rarityMult) {
    for (const r in weather.rarityMult) {
      if (rarityWeights[r]) {
        rarityWeights[r] = {
          ...rarityWeights[r],
          weight: Math.floor(rarityWeights[r].weight * weather.rarityMult[r])
        };
      }
    }
  }
  if (event.rarityMult) {
    for (const r in event.rarityMult) {
      if (rarityWeights[r]) {
        rarityWeights[r] = {
          ...rarityWeights[r],
          weight: Math.floor(rarityWeights[r].weight * event.rarityMult[r])
        };
      }
    }
  }

  // family weights
  const familyWeights = { ...biomeFam };
  const famMults = {
    ...(weather.familyMult || {}),
    ...(crisis.familyMult || {})
  };
  for (const fam in famMults) {
    if (familyWeights[fam]) {
      familyWeights[fam] = Math.floor(familyWeights[fam] * famMults[fam]);
    }
  }

  return { rarityWeights, familyWeights };
}

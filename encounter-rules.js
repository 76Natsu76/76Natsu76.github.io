// encounter-rules.js

import { REGION_ENCOUNTER_TABLES } from "./region-encounter-tables.js";

export const ENCOUNTER_RULES = buildEncounterRules(REGION_ENCOUNTER_TABLES);

function buildEncounterRules(regionEncounterTables) {
  const region = {};

  for (const [regionKey, entry] of Object.entries(regionEncounterTables)) {
    const weights = {};
    for (const [rarity, data] of Object.entries(entry)) {
      // old: { tiers: [1,2] }
      // new: { tiers: [...], weight: default }
      weights[rarity] = {
        tiers: data.tiers || [],
        weight: defaultRarityWeight(rarity)
      };
    }
    region[regionKey] = { weights };
  }

  return {
    region,
    biome: {},
    weather: {},
    crisis: {},
    event: {}
  };
}

function defaultRarityWeight(rarity) {
  switch (rarity) {
    case "common":   return 60;
    case "uncommon": return 25;
    case "rare":     return 10;
    case "boss":     return 5;
    default:         return 10;
  }
}

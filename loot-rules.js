// loot-rules.js
// Build LOOT_RULES from existing REGION_LOOT_TABLES

import { REGION_LOOT_TABLES } from "./region-loot-tables.js";

export const LOOT_RULES = buildLootRulesFromRegionTables(REGION_LOOT_TABLES);

function buildLootRulesFromRegionTables(regionTables) {
  const region = {};
  const weather = {};
  const crisis = {};
  const event = {};
  const profession = {};

  for (const [regionKey, entry] of Object.entries(regionTables)) {
    // 1) Base rarity pools
    region[regionKey] = {
      common:   entry.common   || [],
      uncommon: entry.uncommon || [],
      rare:     entry.rare     || [],
      epic:     entry.epic     || [],
      mythic:   entry.mythic   || []
    };

    // 2) Weather modifiers
    if (entry.weatherModifiers) {
      for (const [weatherKey, items] of Object.entries(entry.weatherModifiers)) {
        if (!weather[weatherKey]) weather[weatherKey] = {};
        if (!weather[weatherKey][regionKey]) weather[weatherKey][regionKey] = [];
        weather[weatherKey][regionKey].push(...items);
      }
    }

    // 3) Crisis modifiers
    if (entry.crisisModifiers) {
      for (const [crisisKey, items] of Object.entries(entry.crisisModifiers)) {
        if (!crisis[crisisKey]) crisis[crisisKey] = {};
        if (!crisis[crisisKey][regionKey]) crisis[crisisKey][regionKey] = [];
        crisis[crisisKey][regionKey].push(...items);
      }
    }

    // 4) Event modifiers
    if (entry.eventModifiers) {
      for (const [eventKey, items] of Object.entries(entry.eventModifiers)) {
        if (!event[eventKey]) event[eventKey] = {};
        if (!event[eventKey][regionKey]) event[eventKey][regionKey] = [];
        event[eventKey][regionKey].push(...items);
      }
    }

    // 5) Profession modifiers
    if (entry.professionModifiers) {
      if (!profession[regionKey]) profession[regionKey] = {};
      for (const [profKey, items] of Object.entries(entry.professionModifiers)) {
        if (!profession[regionKey][profKey]) profession[regionKey][profKey] = [];
        profession[regionKey][profKey].push(...items);
      }
    }
  }

  return { region, weather, crisis, event, profession };
}

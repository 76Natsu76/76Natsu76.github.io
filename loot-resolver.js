// loot-resolver.js

import { LOOT_RULES } from "./loot-rules.js";
import { LOOT_TABLES } from "./loot-table.js"; // global item registry

export function resolveLoot(enemy, context, player) {
  const { regionKey, weatherKey, crisisKey, eventKey } = context;
  const profession = player?.profession || null;

  const regionLoot = LOOT_RULES.region[regionKey] || {};

  const weatherLoot =
    (weatherKey && LOOT_RULES.weather[weatherKey]?.[regionKey]) || [];

  const crisisLoot =
    (crisisKey && LOOT_RULES.crisis[crisisKey]?.[regionKey]) || [];

  const eventLoot =
    (eventKey && LOOT_RULES.event[eventKey]?.[regionKey]) || [];

  const profLoot =
    (profession && LOOT_RULES.profession[regionKey]?.[profession]) || [];

  // base rarity pool from enemy rarity
  const rarity = enemy.rarity || "common";
  const basePool = regionLoot[rarity] || [];

  // merge all sources
  const merged = [
    ...basePool,
    ...weatherLoot,
    ...crisisLoot,
    ...eventLoot,
    ...profLoot
  ];

  // simple roll: pick 1–3 items from merged pool
  const results = [];
  const rolls = Math.max(1, Math.min(3, Math.floor(Math.random() * 3) + 1));

  for (let i = 0; i < rolls; i++) {
    if (!merged.length) break;
    const itemId = merged[Math.floor(Math.random() * merged.length)];
    const def = LOOT_TABLES.find(x => x.id === itemId) || { id: itemId, name: itemId };
    results.push(def);
  }

  return results;
}

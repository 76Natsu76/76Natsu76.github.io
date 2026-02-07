// loot-resolver.js

import { LOOT_RULES } from "./loot-rules.js";
import { LOOT_TABLES } from "./loot-table.js";
import { FAMILY_LOOT_RULES } from "./family-loot-rules.js";
import { biomeLoot } from "./biome-loot.js";
import { FLAVOR_LOOT_RULES } from "./flavor-loot-rules.js";

const LOOT_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  mythic: 1
};

export function resolveLoot(enemy, context, player) {
  const { regionKey, weatherKey, crisisKey, eventKey, biomeKey } = context;
  const profession = player?.profession || null;
  const rarity = enemy.rarity || "common";
  const enemyTier = enemy.tier || 1;
  const tierGrace = 1;

  // -----------------------------
  // 1. Collect loot from all layers
  // -----------------------------
  const regionLoot = LOOT_RULES.region[regionKey] || {};

  const weatherLoot =
    (weatherKey && LOOT_RULES.weather[weatherKey]?.[regionKey]) || [];

  const crisisLoot =
    (crisisKey && LOOT_RULES.crisis[crisisKey]?.[regionKey]) || [];

  const eventLoot =
    (eventKey && LOOT_RULES.event[eventKey]?.[regionKey]) || [];

  const profLoot =
    (profession && LOOT_RULES.profession[regionKey]?.[profession]) || [];

  // Family loot
  const family = enemy.family || null;
  const familyLoot = [];
  if (family && FAMILY_LOOT_RULES[family]) {
    const famRules = FAMILY_LOOT_RULES[family];
    const famPool = famRules[rarity] || famRules.common || [];
    familyLoot.push(...famPool);
  }

  // Biome loot
  const biomeLootPool = [];
  if (biomeKey && biomeLoot[biomeKey]) {
    const b = biomeLoot[biomeKey];
    biomeLootPool.push(...(b.materials || []));
  }

  // FlavorTag loot
  const flavorLoot = [];
  for (const tag of enemy.flavorTags || []) {
    if (FLAVOR_LOOT_RULES[tag]) {
      flavorLoot.push(...FLAVOR_LOOT_RULES[tag]);
    }
  }

  // Base rarity pool
  const basePool = regionLoot[rarity] || [];

  // -----------------------------
  // 2. Build weighted pool
  // -----------------------------
  const weightedPool = [];

  function addWeighted(items, rarity) {
    const w = LOOT_WEIGHTS[rarity] || 1;
    for (const id of items) {
      weightedPool.push({ id, weight: w });
    }
  }

  addWeighted(basePool, rarity);
  addWeighted(familyLoot, rarity);
  addWeighted(biomeLootPool, rarity);
  addWeighted(weatherLoot, rarity);
  addWeighted(crisisLoot, rarity);
  addWeighted(eventLoot, rarity);
  addWeighted(profLoot, rarity);
  addWeighted(flavorLoot, rarity);

  if (!weightedPool.length) return [];

  // -----------------------------
  // 3. Tier filtering
  // -----------------------------
  const filteredPool = weightedPool.filter(entry => {
    const def = LOOT_TABLES.find(x => x.id === entry.id);
    if (!def || !def.tier) return true;
    return def.tier <= enemyTier + tierGrace;
  });

  if (!filteredPool.length) return [];

  // -----------------------------
  // 4. Weighted random selection
  // -----------------------------
  function weightedRandom(pool) {
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (const p of pool) {
      if ((r -= p.weight) <= 0) return p.id;
    }
  }

  const results = [];
  const rolls = Math.max(1, Math.min(3, Math.floor(Math.random() * 3) + 1));

  for (let i = 0; i < rolls; i++) {
    const itemId = weightedRandom(filteredPool);
    const def = LOOT_TABLES.find(x => x.id === itemId) || { id: itemId, name: itemId };
    results.push(def);
  }

  // -----------------------------
  // 5. Ultra-rare family drops
  // -----------------------------
  if (family && FAMILY_LOOT_RULES[family]?.ultraRare) {
    for (const entry of FAMILY_LOOT_RULES[family].ultraRare) {
      if (Math.random() < entry.chance) {
        const def = LOOT_TABLES.find(x => x.id === entry.item) || { id: entry.item, name: entry.item };
        results.push(def);
      }
    }
  }

  // -----------------------------
  // 6. Ultra-rare biome drops
  // -----------------------------
  if (biomeKey && biomeLoot[biomeKey]?.rareDrops) {
    for (const entry of biomeLoot[biomeKey].rareDrops) {
      if (Math.random() < entry.chance) {
        const def = LOOT_TABLES.find(x => x.id === entry.id) || { id: entry.id, name: entry.id };
        results.push(def);
      }
    }
  }

  return results;
}

// item-registry.js
// Canonical loot + item access layer

import items from "./items.json" assert { type: "json" };
import lootTables from "./loot-tables.json" assert { type: "json" };
import professionLoot from "./profession-loot.json" assert { type: "json" };
import biomeLoot from "./biome-loot.json" assert { type: "json" };
import regionLoot from "./region-loot.json" assert { type: "json" };
import enemyLootConfig from "./enemy-loot-config.json" assert { type: "json" };

// -----------------------------
// Basic item access
// -----------------------------
export function getItem(id) {
  return items[id] || null;
}

export function ensureItem(id, fallback) {
  const existing = getItem(id);
  if (existing) return existing;
  return {
    id,
    name: fallback?.name || id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    rarity: fallback?.rarity || "common",
    type: fallback?.type || "misc",
    description: fallback?.description || ""
  };
}

// -----------------------------
// Rarity helpers
// -----------------------------
const DEFAULT_RARITY_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
  mythic: 0.5,
  transcendent: 0.1
};

function weightedPick(weightMap) {
  let total = 0;
  for (const k in weightMap) total += weightMap[k];
  const roll = Math.random() * total;
  let acc = 0;
  for (const k in weightMap) {
    acc += weightMap[k];
    if (roll <= acc) return k;
  }
  return null;
}

export function rollRarity(overrides = {}) {
  const weights = { ...DEFAULT_RARITY_WEIGHTS, ...overrides };
  return weightedPick(weights) || "common";
}

// -----------------------------
// Core loot pool helpers
// -----------------------------
function filterLootByContext(options = {}) {
  const { region, biome, event } = options;
  const pool = lootTables.items || [];

  return pool.filter(entry => {
    if (region && entry.regions && entry.regions.length && !entry.regions.includes(region)) {
      return false;
    }
    if (biome && entry.biomes && entry.biomes.length && !entry.biomes.includes(biome)) {
      return false;
    }
    if (event && entry.events && entry.events.length && !entry.events.includes(event)) {
      return false;
    }
    return true;
  });
}

function pickFromPool(pool, rarityBias = {}) {
  if (!pool.length) return null;

  const rarityWeights = {};
  pool.forEach(entry => {
    const r = entry.rarity || "common";
    const base = DEFAULT_RARITY_WEIGHTS[r] || 0;
    const mult = rarityBias[r] || 1;
    if (!rarityWeights[r]) rarityWeights[r] = 0;
    rarityWeights[r] += base * mult;
  });

  const chosenRarity = weightedPick(rarityWeights);
  const candidates = pool.filter(e => e.rarity === chosenRarity);
  const finalPool = candidates.length ? candidates : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

// -----------------------------
// Public loot API
// -----------------------------
export function getRandomLoot(options = {}) {
  const { region, biome, event, countMin = 1, countMax = 3 } = options;

  const regionCfg = region ? regionLoot[region] || {} : {};
  const rarityBias = regionCfg.rarityBias || {};

  const pool = filterLootByContext({ region, biome, event });
  const effectivePool = pool.length ? pool : (lootTables.items || []);

  const count =
    Math.floor(Math.random() * (countMax - countMin + 1)) + countMin;

  const results = [];
  for (let i = 0; i < count; i++) {
    const roll = pickFromPool(effectivePool, rarityBias);
    if (!roll) continue;
    results.push({
      id: roll.id,
      rarity: roll.rarity,
      topCategory: roll.topCategory || null,
      subCategory: roll.subCategory || null
    });
  }

  return results;
}

export function getProfessionLoot(profession) {
  if (!profession) return null;
  const key = String(profession).toLowerCase();
  return professionLoot[key] || null;
}

export function getBiomeLoot(biomeKey) {
  if (!biomeKey) return null;
  return biomeLoot[biomeKey] || null;
}

export function getRegionLoot(regionKey) {
  if (!regionKey) return null;
  return regionLoot[regionKey] || null;
}

// -----------------------------
// Enemy loot resolver (modern)
// -----------------------------
export function resolveEnemyLoot(enemy, context = {}) {
  const loot = {
    gold: 0,
    items: []
  };

  // 1) Base encounter loot
  const baseItems = getRandomLoot({
    region: context.region || null,
    biome: enemy.biome || context.biome || null,
    event: context.event || null,
    countMin: 1,
    countMax: 3
  });

  baseItems.forEach(it => {
    loot.items.push({ id: it.id, source: "base", rarity: it.rarity });
  });

  // 2) Profession loot
  const profKey = (enemy.profession || "").toLowerCase();
  const profLoot = getProfessionLoot(profKey);
  if (profLoot) {
    const buckets = ["weapons", "armor", "consumables"];
    buckets.forEach(bucket => {
      const ids = profLoot[bucket] || [];
      if (!ids.length) return;
      const chosenId = ids[Math.floor(Math.random() * ids.length)];
      loot.items.push({ id: chosenId, source: "profession" });
    });
  }

  // 3) Variant + tag config
  const variantKey = (enemy.variant || "").toLowerCase();
  const variantCfg = enemyLootConfig.variants?.[variantKey] || null;

  if (variantCfg?.goldMultiplier) {
    loot.gold = Math.floor(loot.gold * variantCfg.goldMultiplier);
  }

  if (variantCfg?.extraItems) {
    variantCfg.extraItems.forEach(entry => {
      if (Math.random() < (entry.chance ?? 1)) {
        loot.items.push({ id: entry.id, source: "variant" });
      }
    });
  }

  const tags = (enemy.tags || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  tags.forEach(tagKey => {
    const tagCfg = enemyLootConfig.tags?.[tagKey];
    if (!tagCfg?.extraItems) return;
    tagCfg.extraItems.forEach(entry => {
      if (Math.random() < (entry.chance ?? 1)) {
        loot.items.push({ id: entry.id, source: "tag" });
      }
    });
  });

  // 4) Biome rare drops + materials
  const biomeKey = enemy.biome || context.biome || null;
  if (biomeKey) {
    const bCfg = getBiomeLoot(biomeKey);
    if (bCfg?.rareDrops) {
      bCfg.rareDrops.forEach(drop => {
        if (Math.random() < (drop.chance ?? 0)) {
          loot.items.push({ id: drop.id, source: "biome_rare" });
        }
      });
    }
    if (bCfg?.materials && Math.random() < 0.1) {
      const matId =
        bCfg.materials[Math.floor(Math.random() * bCfg.materials.length)];
      loot.items.push({ id: matId, source: "biome_material" });
    }
  }

  return loot;
}

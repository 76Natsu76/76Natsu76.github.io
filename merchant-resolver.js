// merchant-resolver.js

// Adjust these paths to match your repo structure
import LOOT_TABLES from './loot-tables.json' assert { type: 'json' };
import BOSS_LOOT_TABLES from './boss-loot-tables.json' assert { type: 'json' };
import MERCHANT_TYPES from './merchant-types.json' assert { type: 'json' };
import MERCHANT_PERSONALITIES from './merchant-personalities.json' assert { type: 'json' };
import MERCHANT_INSTANCES from './merchant-instances.json' assert { type: 'json' };

/**
 * Utility: get a flat list of items from a top-level category name
 * Example: "cooking", "fishing", "craftingMaterials", "gems", "runes", etc.
 */
function getItemsByTopCategory(topCategory) {
  const result = [];

  const categoryBlock = LOOT_TABLES[topCategory];
  if (!categoryBlock) return result;

  // categoryBlock is usually an object of subcategories → arrays
  for (const subKey of Object.keys(categoryBlock)) {
    const arr = categoryBlock[subKey];
    if (Array.isArray(arr)) {
      for (const item of arr) {
        result.push(item);
      }
    }
  }

  return result;
}

/**
 * Utility: build a rarity → [items] map from a list of items
 */
function groupItemsByRarity(items) {
  const map = {};
  for (const item of items) {
    const rarity = item.rarity || 'common';
    if (!map[rarity]) map[rarity] = [];
    map[rarity].push(item);
  }
  return map;
}

/**
 * Utility: weighted random rarity selection
 * rarityWeights: { common: 0.6, uncommon: 0.3, rare: 0.1, ... }
 * rarityBias: optional multiplier map from personality (e.g. { rare: 1.2 })
 */
function pickRarity(rarityWeights, rarityBias = {}) {
  const adjusted = {};
  let total = 0;

  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    const bias = rarityBias[rarity] ?? 1;
    const w = weight * bias;
    if (w <= 0) continue;
    adjusted[rarity] = w;
    total += w;
  }

  if (total <= 0) return null;

  let roll = Math.random() * total;
  for (const [rarity, weight] of Object.entries(adjusted)) {
    if (roll < weight) return rarity;
    roll -= weight;
  }

  return null;
}

/**
 * Utility: random element from array
 */
function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

/**
 * Utility: apply seasonal / world-event modifiers (stubbed for now)
 * You can expand this later to inject seasonal items, world-event items, etc.
 */
function applyWorldAndSeasonalModifiers(inventory, context = {}) {
  // context could include: { season, activeEvents, region, playerLevel, ... }
  // For now, we just return inventory unchanged.
  return inventory;
}

/**
 * Core: generate inventory for a given merchantId
 * options can include:
 *  - context: { season, activeEvents, region, playerLevel, ... }
 *  - rng: custom RNG if you want deterministic seeds later
 */
export function generateMerchantInventory(merchantId, options = {}) {
  const { context = {} } = options;

  const instance = MERCHANT_INSTANCES[merchantId];
  if (!instance) {
    throw new Error(`Unknown merchant instance: ${merchantId}`);
  }

  const type = MERCHANT_TYPES[instance.type];
  if (!type) {
    throw new Error(`Unknown merchant type: ${instance.type}`);
  }

  const personality = instance.personality
    ? MERCHANT_PERSONALITIES[instance.personality]
    : null;

  // 1. Determine allowed categories
  let allowedCategories = [...(type.allowedCategories || [])];

  if (personality?.preferredCategories?.length) {
    // Personality can bias categories by adding them again (soft weight)
    // or you can treat this as a filter; here we treat it as a soft bias.
    allowedCategories = [
      ...allowedCategories,
      ...personality.preferredCategories
    ];
  }

  // Remove banned categories from personality
  if (personality?.bannedCategories?.length) {
    const bannedSet = new Set(personality.bannedCategories);
    allowedCategories = allowedCategories.filter(
      (cat) => !bannedSet.has(cat)
    );
  }

  // 2. Collect candidate items from allowed categories
  const candidateItems = [];
  for (const cat of allowedCategories) {
    const items = getItemsByTopCategory(cat);
    candidateItems.push(...items);
  }

  // 3. Apply instance-level bans (by id)
  const bannedIds = new Set([
    ...(type.banned || []),
    ...(instance.banned || [])
  ]);

  const filteredCandidates = candidateItems.filter(
    (item) => !bannedIds.has(item.id)
  );

  // 4. Group by rarity
  const rarityMap = groupItemsByRarity(filteredCandidates);

  // 5. Determine inventory size
  const minItems = instance.minItems ?? type.minItems ?? 3;
  const maxItems = instance.maxItems ?? type.maxItems ?? 6;
  const targetCount =
    minItems + Math.floor(Math.random() * Math.max(1, maxItems - minItems + 1));

  const rarityWeights = { ...(type.rarityWeights || {}) };
  const rarityBias = personality?.rarityBias || {};

  const inventory = [];
  const usedIds = new Set();

  // Helper to add an item if not already present
  function addItemById(id) {
    if (!id || usedIds.has(id)) return;
    // Search in all candidates
    const found = filteredCandidates.find((it) => it.id === id);
    if (found) {
      inventory.push(found);
      usedIds.add(found.id);
    }
  }

  // 6. Add guaranteed items (type + personality + instance)
  const guaranteedIds = [
    ...(type.guaranteed || []),
    ...(personality?.guaranteed || []),
    ...(instance.guaranteed || [])
  ];

  for (const gid of guaranteedIds) {
    addItemById(gid);
  }

  // 7. Add overrides (personality + instance)
  const overrideIds = [
    ...(personality?.overrides || []),
    ...(instance.overrides || [])
  ];

  for (const oid of overrideIds) {
    addItemById(oid);
  }

  // 8. Fill remaining slots via rarity weights
  let safety = 500; // prevent infinite loops
  while (inventory.length < targetCount && safety-- > 0) {
    const rarity = pickRarity(rarityWeights, rarityBias);
    if (!rarity) break;

    const pool = rarityMap[rarity];
    if (!pool || pool.length === 0) continue;

    const candidate = pickRandom(pool);
    if (!candidate) continue;
    if (usedIds.has(candidate.id)) continue;

    inventory.push(candidate);
    usedIds.add(candidate.id);
  }

  // 9. Apply world/seasonal modifiers (hook)
  const finalInventory = applyWorldAndSeasonalModifiers(inventory, context);

  // 10. Return a clean payload
  return {
    merchantId,
    type: instance.type,
    personality: instance.personality || null,
    items: finalInventory
  };
}

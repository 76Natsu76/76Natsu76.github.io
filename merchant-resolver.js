// /js/merchant-resolver.js
// Modern JS‑module version (no JSON, no fetch)

import { LOOT_TABLES } from "./loot-table.js";
import { MERCHANT_TYPES } from "./merchant-types.js";
import { MERCHANT_PERSONALITIES } from "./merchant-personalities.js";
import { MERCHANT_INSTANCES } from "./merchant-instances.js";

// --------------------------------------------------
// Initialization (no async needed anymore)
// --------------------------------------------------
export function initMerchantData() {
  // All data is already imported as JS modules.
  // This function remains for compatibility.
  return true;
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function getItemsByTopCategory(topCategory) {
  const result = [];
  const categoryBlock = LOOT_TABLES[topCategory];
  if (!categoryBlock) return result;

  for (const subKey of Object.keys(categoryBlock)) {
    const arr = categoryBlock[subKey];
    if (Array.isArray(arr)) {
      result.push(...arr);
    }
  }
  return result;
}

function groupItemsByRarity(items) {
  const map = {};
  for (const item of items) {
    const rarity = item.rarity || "common";
    if (!map[rarity]) map[rarity] = [];
    map[rarity].push(item);
  }
  return map;
}

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

function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function applyWorldAndSeasonalModifiers(inventory, context = {}) {
  return inventory; // hook for future expansion
}

// --------------------------------------------------
// MAIN INVENTORY GENERATOR
// --------------------------------------------------
export function generateMerchantInventorySync(merchantId, options = {}) {
  const { context = {} } = options;

  const instance = MERCHANT_INSTANCES[merchantId];
  if (!instance) throw new Error(`Unknown merchant instance: ${merchantId}`);

  const type = MERCHANT_TYPES[instance.type];
  if (!type) throw new Error(`Unknown merchant type: ${instance.type}`);

  const personality = instance.personality
    ? MERCHANT_PERSONALITIES[instance.personality]
    : null;

  // Allowed categories
  let allowedCategories = [...(type.allowedCategories || [])];

  if (personality?.preferredCategories?.length) {
    allowedCategories.push(...personality.preferredCategories);
  }

  if (personality?.bannedCategories?.length) {
    const bannedSet = new Set(personality.bannedCategories);
    allowedCategories = allowedCategories.filter(cat => !bannedSet.has(cat));
  }

  // Candidate items
  const candidateItems = [];
  for (const cat of allowedCategories) {
    candidateItems.push(...getItemsByTopCategory(cat));
  }

  // Banned IDs
  const bannedIds = new Set([
    ...(type.banned || []),
    ...(instance.banned || [])
  ]);

  const filteredCandidates = candidateItems.filter(
    item => !bannedIds.has(item.id)
  );

  const rarityMap = groupItemsByRarity(filteredCandidates);

  // Item count
  const minItems = instance.minItems ?? type.minItems ?? 3;
  const maxItems = instance.maxItems ?? type.maxItems ?? 6;
  const targetCount =
    minItems + Math.floor(Math.random() * Math.max(1, maxItems - minItems + 1));

  const rarityWeights = { ...(type.rarityWeights || {}) };
  const rarityBias = personality?.rarityBias || {};

  const inventory = [];
  const usedIds = new Set();

  function addItemById(id) {
    if (!id || usedIds.has(id)) return;
    const found = filteredCandidates.find(it => it.id === id);
    if (found) {
      inventory.push(found);
      usedIds.add(found.id);
    }
  }

  // Guaranteed items
  const guaranteedIds = [
    ...(type.guaranteed || []),
    ...(personality?.guaranteed || []),
    ...(instance.guaranteed || [])
  ];
  for (const gid of guaranteedIds) addItemById(gid);

  // Overrides
  const overrideIds = [
    ...(personality?.overrides || []),
    ...(instance.overrides || [])
  ];
  for (const oid of overrideIds) addItemById(oid);

  // Fill remaining slots
  let safety = 500;
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

  const finalInventory = applyWorldAndSeasonalModifiers(inventory, context);

  return {
    merchantId,
    type: instance.type,
    personality: instance.personality || null,
    items: finalInventory
  };
}

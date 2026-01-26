// /js/merchant-resolver.js

let LOOT_TABLES = null;
let MERCHANT_TYPES = null;
let MERCHANT_PERSONALITIES = null;
let MERCHANT_INSTANCES = null;

async function loadJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

export async function initMerchantData() {
  if (LOOT_TABLES) return; // already loaded

  const base = '/data'; // adjust if needed

  const [
    lootTables,
    merchantTypes,
    merchantPersonalities,
    merchantInstances
  ] = await Promise.all([
    loadJson(`${base}/loot-tables.json`),
    loadJson(`${base}/merchant-types.json`),
    loadJson(`${base}/merchant-personalities.json`),
    loadJson(`${base}/merchant-instances.json`)
  ]);

  LOOT_TABLES = lootTables;
  MERCHANT_TYPES = merchantTypes;
  MERCHANT_PERSONALITIES = merchantPersonalities;
  MERCHANT_INSTANCES = merchantInstances;
}

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
    const rarity = item.rarity || 'common';
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
  // hook for later; no-op for now
  return inventory;
}

export function generateMerchantInventorySync(merchantId, options = {}) {
  if (!LOOT_TABLES || !MERCHANT_TYPES || !MERCHANT_PERSONALITIES || !MERCHANT_INSTANCES) {
    throw new Error('Merchant data not initialized. Call initMerchantData() first.');
  }

  const { context = {} } = options;

  const instance = MERCHANT_INSTANCES[merchantId];
  if (!instance) throw new Error(`Unknown merchant instance: ${merchantId}`);

  const type = MERCHANT_TYPES[instance.type];
  if (!type) throw new Error(`Unknown merchant type: ${instance.type}`);

  const personality = instance.personality
    ? MERCHANT_PERSONALITIES[instance.personality]
    : null;

  let allowedCategories = [...(type.allowedCategories || [])];

  if (personality?.preferredCategories?.length) {
    allowedCategories = [
      ...allowedCategories,
      ...personality.preferredCategories
    ];
  }

  if (personality?.bannedCategories?.length) {
    const bannedSet = new Set(personality.bannedCategories);
    allowedCategories = allowedCategories.filter(cat => !bannedSet.has(cat));
  }

  const candidateItems = [];
  for (const cat of allowedCategories) {
    candidateItems.push(...getItemsByTopCategory(cat));
  }

  const bannedIds = new Set([
    ...(type.banned || []),
    ...(instance.banned || [])
  ]);

  const filteredCandidates = candidateItems.filter(
    item => !bannedIds.has(item.id)
  );

  const rarityMap = groupItemsByRarity(filteredCandidates);

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

  const guaranteedIds = [
    ...(type.guaranteed || []),
    ...(personality?.guaranteed || []),
    ...(instance.guaranteed || [])
  ];
  for (const gid of guaranteedIds) addItemById(gid);

  const overrideIds = [
    ...(personality?.overrides || []),
    ...(instance.overrides || [])
  ];
  for (const oid of overrideIds) addItemById(oid);

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

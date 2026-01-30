// shop-engine.js

import { SHOP_POOL } from "./shop-pool.js";
import { RARITY_WEIGHTS } from "./rarity-weights.js";

/* --------------------------------------------------
   Weighted random item selection
-------------------------------------------------- */
function weightedRandomItem() {
  const entries = SHOP_POOL;

  const totalWeight = entries.reduce(
    (sum, item) => sum + (RARITY_WEIGHTS[item.rarity] || 1),
    0
  );

  let roll = Math.random() * totalWeight;

  for (const item of entries) {
    roll -= RARITY_WEIGHTS[item.rarity] || 1;
    if (roll <= 0) return item;
  }

  return entries[entries.length - 1];
}

/* --------------------------------------------------
   Generate a single shop item entry
-------------------------------------------------- */
function generateShopItem(poolEntry) {
  const qty =
    Math.floor(Math.random() * (poolEntry.maxQty - poolEntry.minQty + 1)) +
    poolEntry.minQty;

  const price =
    Math.floor(Math.random() * (poolEntry.maxPrice - poolEntry.minPrice + 1)) +
    poolEntry.minPrice;

  return {
    id: poolEntry.id,
    qty,
    price,
    rarity: poolEntry.rarity
  };
}

/* --------------------------------------------------
   GLOBAL SHOP
   (playerCount must now be passed in)
-------------------------------------------------- */
export function generateGlobalShop(playerCount = 1) {
  const itemCount = 25 + 10 * playerCount;
  const items = [];

  for (let i = 0; i < itemCount; i++) {
    const poolEntry = weightedRandomItem();
    items.push(generateShopItem(poolEntry));
  }

  return {
    generatedAt: Date.now(),
    items
  };
}

/* --------------------------------------------------
   DAILY USER SHOP
-------------------------------------------------- */
export function generateUserShop(username) {
  const itemCount = Math.floor(Math.random() * 8) + 3; // 3–10 items
  const items = [];

  for (let i = 0; i < itemCount; i++) {
    const poolEntry = weightedRandomItem();
    items.push(generateShopItem(poolEntry));
  }

  return {
    username,
    generatedAt: Date.now(),
    items
  };
}

/* --------------------------------------------------
   DAILY RESET CHECK
-------------------------------------------------- */
export function shouldResetShop(lastGeneratedTimestamp) {
  const now = new Date();
  const last = new Date(lastGeneratedTimestamp);

  // Reset at 3 AM EST
  const resetHour = 3;

  const lastReset = new Date(
    last.getFullYear(),
    last.getMonth(),
    last.getDate(),
    resetHour,
    0,
    0
  );

  const nextReset = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);

  return now >= nextReset;
}

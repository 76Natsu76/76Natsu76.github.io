// merchant-inventory.js

import { ITEMS } from "./items.js";
import { weightedRandom } from "./weighted.js";

/* ============================================================
   RARITY WEIGHTS (canonical)
============================================================ */
const RARITY_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
  mythic: 0.2,
  artifact: 0.05
};

/* ============================================================
   PERSONALITY PRICE MODIFIERS
============================================================ */
const PERSONALITY_PRICE_MOD = {
  neutral: 1.0,
  greedy: 1.25,
  generous: 0.85,
  mysterious: 1.10,
  regional: 0.95,
  eccentric: 1.15
};

/* ============================================================
   MERCHANT TYPE POOLS
============================================================ */
const MERCHANT_POOLS = {
  general: (item) => true, // sells everything

  // Future expansion:
  biome_specialist: (item) => item.tags?.includes("biome"),
  regional: (item) => item.tags?.includes("regional"),
  rare: (item) => ["epic", "legendary", "mythic"].includes(item.rarity)
};

/* ============================================================
   INVENTORY GENERATOR
============================================================ */
export function generateMerchantInventory(merchant) {
  const poolFilter = MERCHANT_POOLS[merchant.type] || MERCHANT_POOLS.general;

  const pool = Object.values(ITEMS).filter(poolFilter);

  const items = [];
  const count = 6 + Math.floor(Math.random() * 3); // 6–8 items

  for (let i = 0; i < count; i++) {
    const item = weightedRandom(pool, (it) => RARITY_WEIGHTS[it.rarity || "common"]);
    if (!item) continue;

    const qty = Math.floor(Math.random() * 3) + 1; // 1–3 copies
    const basePrice = item.value || 10;

    const priceMult = PERSONALITY_PRICE_MOD[merchant.personality] || 1.0;
    const price = Math.floor(basePrice * priceMult);

    items.push({
      id: item.id,
      name: item.name,
      rarity: item.rarity,
      qty,
      price,
      description: item.description || "",
      stats: item.stats || {}
    });
  }

  return items;
}

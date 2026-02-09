// settlement-shops.js

import { RESOURCES } from "./economy-resources.js";

export function generateShopInventory(settlement) {
  const inv = [];

  for (const res in settlement.economy.resources) {
    const amount = settlement.economy.resources[res];
    if (amount > 5) {
      inv.push({
        item: res,
        price: Math.ceil(RESOURCES[res].baseValue * settlement.prosperity),
        stock: Math.floor(amount / 2)
      });
    }
  }

  return inv;
}

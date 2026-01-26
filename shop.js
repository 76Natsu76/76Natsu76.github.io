// /js/shop.js
import { getMerchantInventory } from './merchant-inventory-store.js';

const MERCHANT_ID = 'draugr_the_dwarf'; // or from URL/query

async function loadMerchant() {
  const data = await getMerchantInventory(MERCHANT_ID);

  const container = document.getElementById('shop-items');
  container.innerHTML = '';

  for (const item of data.inventory) {
    const el = document.createElement('div');
    el.className = `shop-item rarity-${item.rarity}`;

    el.innerHTML = `
      <div class="item-name">${item.name}</div>
      <div class="item-rarity">${item.rarity}</div>
      <button class="buy-button" data-id="${item.id}">Buy</button>
    `;

    container.appendChild(el);
  }
}

loadMerchant();

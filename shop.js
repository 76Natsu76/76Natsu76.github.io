// /js/shop.js
import { getMerchantInventory } from "./merchant-inventory-store.js";

export async function loadMerchant(merchantId) {
  const container = document.getElementById("shop-items");
  container.innerHTML = "Loading...";

  const data = await getMerchantInventory(merchantId);

  container.innerHTML = "";

  for (const item of data.inventory) {
    const card = document.createElement("div");
    card.className = `item-card rarity-${item.rarity} glow-${item.rarity}`;

    card.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price ?? "??"} gold</div>
        <div class="tooltip">
          <strong>${item.name}</strong><br>
          Rarity: ${item.rarity}<br>
          Tier: ${item.tier}<br>
          Type: ${item.type}
        </div>
      </div>
      <div class="item-actions">
        <button data-id="${item.id}">Buy</button>
      </div>
    `;

    container.appendChild(card);
  }
}

export async function loadMerchantFromDOM() {
  const container = document.getElementById("shop-items");
  const merchantId = container.dataset.merchant;
  await loadMerchant(merchantId);
}

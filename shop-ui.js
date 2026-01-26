// /js/shop-ui.js
// Handles: gold display, inventory panel, token prompt, countdown timers,
// and wiring for daily/global shop UI.

import { loadMerchantFromDOM } from "./shop.js";

/* ---------------------------------------------------------
   GITHUB TOKEN HANDLING
--------------------------------------------------------- */
export function promptForToken() {
  const token = prompt("Enter your GitHub token:");
  if (token) {
    localStorage.setItem("github_token", token);
    alert("Token saved!");
  }
}

/* ---------------------------------------------------------
   PLAYER DATA LOADING (GOLD + INVENTORY)
   These functions assume you already have a GitHub-based
   save system for player data.
--------------------------------------------------------- */

async function loadPlayerGold() {
  try {
    const raw = localStorage.getItem("player_gold");
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function loadPlayerInventory() {
  try {
    const raw = localStorage.getItem("player_inventory");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ---------------------------------------------------------
   INVENTORY PANEL RENDERING
--------------------------------------------------------- */
async function renderInventoryPanel() {
  const list = document.getElementById("inventoryList");
  if (!list) return;

  const inventory = await loadPlayerInventory();

  if (!inventory.length) {
    list.innerHTML = "<div>No items in inventory.</div>";
    return;
  }

  list.innerHTML = "";

  for (const item of inventory) {
    const el = document.createElement("div");
    el.className = "inventory-item";

    el.innerHTML = `
      <div class="inventory-item-name">${item.name}</div>
      <div class="inventory-item-qty">Qty: ${item.quantity ?? 1}</div>
    `;

    list.appendChild(el);
  }
}

/* ---------------------------------------------------------
   GOLD DISPLAY
--------------------------------------------------------- */
async function renderGoldDisplay(elementId) {
  const gold = await loadPlayerGold();
  const el = document.getElementById(elementId);
  if (el) el.textContent = gold;
}

/* ---------------------------------------------------------
   SHOP COUNTDOWN (Daily Reset at 3 AM EST)
--------------------------------------------------------- */
export function startShopCountdown(elementId) {
  function update() {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setHours(3, 0, 0, 0);

    if (now > nextReset) {
      nextReset.setDate(nextReset.getDate() + 1);
    }

    const diff = nextReset - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const el = document.getElementById(elementId);
    if (el) el.textContent = `Resets in ${h}h ${m}m ${s}s`;
  }

  update();
  setInterval(update, 1000);
}

/* ---------------------------------------------------------
   GLOBAL SHOP UI INITIALIZATION
--------------------------------------------------------- */
export async function initGlobalShopUI() {
  await renderGoldDisplay("globalShopGold");
  await renderInventoryPanel();
}

/* ---------------------------------------------------------
   DAILY SHOP UI INITIALIZATION
--------------------------------------------------------- */
export async function initUserShopUI() {
  await renderGoldDisplay("userShopGold");
  await renderInventoryPanel();
}

/* ---------------------------------------------------------
   FULL SHOP PAGE INITIALIZATION (optional helper)
--------------------------------------------------------- */
export async function initShopPage() {
  await loadMerchantFromDOM();
  await renderInventoryPanel();
}

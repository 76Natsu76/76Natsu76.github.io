// shop-ui.js
// GitHub-native shop UI + persistence

import { generateGlobalShop, generateUserShop, shouldResetShop } from "./shop-engine.js";
import playersData from "./players.json" assert { type: "json" };
import shopPool from "./shop-pool.json" assert { type: "json" };
import itemsData from "./items.json" assert { type: "json" };

// --------------------------------------------------
// CONFIG
// --------------------------------------------------
const GITHUB_OWNER = "76Natsu76";
const GITHUB_REPO = "76Natsu76.github.io";
const GITHUB_BRANCH = "main";

// Files in repo
const FILE_PLAYERS = "players.json";
const FILE_GLOBAL_SHOP = "global-shop.json";
const FILE_USER_SHOPS = "user-shops.json";
const FILE_PURCHASES = "purchases.json";

// --------------------------------------------------
// TOKEN HANDLING
// --------------------------------------------------
export function getGithubToken() {
  return localStorage.getItem("githubToken") || "";
}

export function setGithubToken(token) {
  localStorage.setItem("githubToken", token);
}

export function clearGithubToken() {
  localStorage.removeItem("githubToken");
}

export function promptForToken() {
  const existing = getGithubToken();
  const token = window.prompt("Enter your GitHub Personal Access Token:", existing || "");
  if (token) setGithubToken(token);
}

// --------------------------------------------------
// GITHUB API HELPERS
// --------------------------------------------------
async function githubGetFile(path) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const json = await res.json();
  const content = atob(json.content);
  return { sha: json.sha, text: content };
}

async function githubPutFile(path, contentText, message, sha) {
  const token = getGithubToken();
  if (!token) throw new Error("No GitHub token set.");

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const body = {
    message,
    content: btoa(contentText),
    branch: GITHUB_BRANCH
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("GitHub PUT error:", errText);
    throw new Error(`GitHub PUT failed: ${res.status}`);
  }

  return res.json();
}

// --------------------------------------------------
// JSON LOAD/SAVE HELPERS
// --------------------------------------------------
async function loadJsonFile(path, fallback = {}) {
  try {
    const { text, sha } = await githubGetFile(path);
    return { data: JSON.parse(text), sha };
  } catch (e) {
    console.warn(`Failed to load ${path}, using fallback`, e);
    return { data: fallback, sha: null };
  }
}

async function saveJsonFile(path, data, message, sha) {
  const text = JSON.stringify(data, null, 2);
  return githubPutFile(path, text, message, sha);
}

// --------------------------------------------------
// PLAYER HELPERS
// --------------------------------------------------
function getPlayerFromLocalSession() {
  const username = sessionStorage.getItem("twitch_username");
  if (!username) return null;
  return username.toLowerCase();
}

async function loadPlayers() {
  const { data, sha } = await loadJsonFile(FILE_PLAYERS, playersData);
  return { players: data, sha };
}

function addItemToInventory(player, itemId, qty) {
  if (!player.inventory) player.inventory = [];
  const existing = player.inventory.find(i => i.id === itemId);
  if (existing) existing.qty += qty;
  else player.inventory.push({ id: itemId, qty });
}

function calculateMaxAffordable(player, entry) {
  const gold = player.gold ?? 0;
  return Math.floor(gold / entry.price);
}

// --------------------------------------------------
// PURCHASE LOGGING
// --------------------------------------------------
async function logPurchase(entry) {
  const { data: logs, sha } = await loadJsonFile(FILE_PURCHASES, []);
  logs.push(entry);
  await saveJsonFile(
    FILE_PURCHASES,
    logs,
    `Log purchase: ${entry.username} bought ${entry.qty}x ${entry.itemId}`,
    sha
  );
}

// --------------------------------------------------
// INVENTORY PANEL RENDERING
// --------------------------------------------------
function renderInventoryPanel(player) {
  const panel = document.getElementById("inventoryList");
  if (!panel) return;

  if (!player.inventory || player.inventory.length === 0) {
    panel.innerHTML = "<div>No items in inventory.</div>";
    return;
  }

  panel.innerHTML = player.inventory
    .map(item => {
      const info = itemsData[item.id] || {};
      const rarity = info.rarity || "common";

      return `
        <div class="inventory-item rarity-${rarity}" data-itemid="${item.id}">
          <div class="inventory-item-name">${info.name || item.id}</div>
          <div class="inventory-item-qty">Qty: ${item.qty}</div>
        </div>
      `;
    })
    .join("");
}

// --------------------------------------------------
// COUNTDOWN TO NEXT 3 AM EST
// --------------------------------------------------
export function startShopCountdown(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  function getNext3AM_EST() {
    const now = new Date();
    const nowEST = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const next = new Date(nowEST);
    next.setHours(3, 0, 0, 0);
    if (nowEST >= next) next.setDate(next.getDate() + 1);
    return next;
  }

  function update() {
    const now = new Date();
    const next = getNext3AM_EST();
    const diff = next - now;

    if (diff <= 0) {
      el.textContent = "Refreshing soon...";
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    el.textContent = `Refreshes in: ${h}h ${m}m ${s}s`;
  }

  update();
  setInterval(update, 1000);
}

// --------------------------------------------------
// UNIVERSAL PURCHASE HANDLER
// --------------------------------------------------
async function handlePurchase(
  shopType,
  index,
  shop,
  player,
  players,
  playersSha,
  userShops,
  userShopsSha
) {
  const entry = shop.items[index];
  if (!entry) return;

  const qtyOptions = {
    "1": 1,
    "max": calculateMaxAffordable(player, entry),
    "x": null
  };

  let choice = prompt("Buy 1, max, or x?", "1");
  if (!choice) return;
  choice = choice.toLowerCase();

  if (!qtyOptions.hasOwnProperty(choice)) {
    alert("Invalid choice.");
    return;
  }

  let qty = qtyOptions[choice];

  if (choice === "x") {
    qty = parseInt(prompt("Enter quantity:"), 10);
    if (!qty || qty <= 0) {
      alert("Invalid quantity.");
      return;
    }
  }

  const maxAffordable = calculateMaxAffordable(player, entry);
  if (qty > maxAffordable) {
    alert(`You can only afford ${maxAffordable}.`);
    return;
  }

  const totalCost = qty * entry.price;
  player.gold -= totalCost;

  addItemToInventory(player, entry.id, qty);

  entry.qty -= qty;
  if (entry.qty <= 0) shop.items.splice(index, 1);

  await saveJsonFile(FILE_PLAYERS, players, "Shop purchase", playersSha);

  if (shopType === "global") {
    const { sha: shopSha } = await loadJsonFile(FILE_GLOBAL_SHOP, {});
    await saveJsonFile(FILE_GLOBAL_SHOP, shop, "Update global shop", shopSha);
  } else {
    userShops[player.username.toLowerCase()] = shop;
    await saveJsonFile(FILE_USER_SHOPS, userShops, "Update user shop", userShopsSha);
  }

  await logPurchase({
    username: player.username,
    itemId: entry.id,
    qty,
    price: entry.price,
    totalCost,
    shopType,
    timestamp: Date.now()
  });

  alert(`Purchased ${qty}x ${entry.id} for ${totalCost} gold.`);
}

// --------------------------------------------------
// GLOBAL SHOP
// --------------------------------------------------
export async function initGlobalShopUI() {
  const username = getPlayerFromLocalSession();
  if (!username) {
    alert("No Twitch user logged in.");
    return;
  }

  const { players, sha: playersSha } = await loadPlayers();
  const player = players[username];
  if (!player) {
    alert("Player not found in players.json.");
    return;
  }

  const { data: globalShop, sha: shopSha } = await loadJsonFile(FILE_GLOBAL_SHOP, {
    generatedAt: 0,
    items: []
  });

  let shop = globalShop;

  if (!shop.generatedAt || shouldResetShop(shop.generatedAt)) {
    shop = generateGlobalShop();
    await saveJsonFile(FILE_GLOBAL_SHOP, shop, "Auto-regenerate global shop", shopSha);
  }

  renderGlobalShop(shop, player, players, playersSha);
}

function renderGlobalShop(shop, player, players, playersSha) {
  const container = document.getElementById("globalShopContainer");
  const goldSpan = document.getElementById("globalShopGold");
  if (!container) return;

  container.innerHTML = "";
  goldSpan.textContent = player.gold ?? 0;

  renderInventoryPanel(player);

  shop.items.forEach((entry, index) => {
    const info = itemsData[entry.id] || {};
    const rarity = info.rarity || "common";

    const div = document.createElement("div");
    div.className = `item-card glow-${rarity} rarity-animated`;

    div.innerHTML = `
      <div class="item-info">
        <div class="item-name rarity-${rarity}">${info.name || entry.id}</div>
        <div class="item-price">Price: ${entry.price} gold</div>

        <div class="tooltip">
          <strong>${info.name || entry.id}</strong><br>
          <span class="rarity-${rarity}">Rarity: ${rarity}</span><br><br>
          ${info.description || "No description available."}
        </div>
      </div>

      <div class="item-actions">
        <button class="btn buy1-btn">Buy 1</button>
        <button class="btn buymax-btn">Buy Max</button>
        <button class="btn buyx-btn">Buy X</button>
      </div>
    `;

    div.onmouseenter = () => {
      const matches = document.querySelectorAll(`.inventory-item[data-itemid="${entry.id}"]`);
      matches.forEach(m => m.classList.add("inventory-compare"));
    };

    div.onmouseleave = () => {
      const matches = document.querySelectorAll(`.inventory-item[data-itemid="${entry.id}"]`);
      matches.forEach(m => m.classList.remove("inventory-compare"));
    };

    div.querySelector(".buy1-btn").onclick = () =>
      handlePurchase("global", index, shop, player, players, playersSha);

    div.querySelector(".buymax-btn").onclick = () =>
      handlePurchase("global", index, shop, player, players, playersSha);

    div.querySelector(".buyx-btn").onclick = () =>
      handlePurchase("global", index, shop, player, players, playersSha);

    container.appendChild(div);
  });
}

// --------------------------------------------------
// USER DAILY SHOP
// --------------------------------------------------
export async function initUserShopUI() {
  const username = getPlayerFromLocalSession();
  if (!username) {
    alert("No Twitch user logged in.");
    return;
  }

  const { players, sha: playersSha } = await loadPlayers();
  const player = players[username];
  if (!player) {
    alert("Player not found in players.json.");
    return;
  }

  const { data: userShops, sha: userShopsSha } = await loadJsonFile(FILE_USER_SHOPS, {});
  let userShop = userShops[username];

  if (!userShop || !userShop.generatedAt || shouldResetShop(userShop.generatedAt)) {
    userShop = generateUserShop(username);
    userShops[username] = userShop;
    await saveJsonFile(FILE_USER_SHOPS, userShops, `Generate daily shop for ${username}`, userShopsSha);
  }

  renderUserShop(userShop, player, players, playersSha, userShops, userShopsSha);
}

function renderUserShop(userShop, player, players, playersSha, userShops, userShopsSha) {
  const container = document.getElementById("userShopContainer");
  const goldSpan = document.getElementById("userShopGold");
  if (!container) return;

  container.innerHTML = "";
  goldSpan.textContent = player.gold ?? 0;

  renderInventoryPanel(player);

  userShop.items.forEach((entry, index) => {
    const info = itemsData[entry.id] || {};
    const rarity = info.rarity || "common";

    const div = document.createElement("div");
    div.className = `item-card glow-${rarity} rarity-animated`;

    div.innerHTML = `
      <div class="item-info">
        <div class="item-name rarity-${rarity}">${info.name || entry.id}</div>
        <div class="item-price">Price: ${entry.price} gold</div>

        <div class="tooltip">
          <strong>${info.name || entry.id}</strong><br>
          <span class="rarity-${rarity}">Rarity: ${rarity}</span><br><br>
          ${info.description || "No description available."}
        </div>
      </div>

      <div class="item-actions">
        <button class="btn buy1-btn">Buy 1</button>
        <button class="btn buymax-btn">Buy Max</button>
        <button class="btn buyx-btn">Buy X</button>
      </div>
    `;

    div.onmouseenter = () => {
      const matches = document.querySelectorAll(`.inventory-item[data-itemid="${entry.id}"]`);
      matches.forEach(m => m.classList.add("inventory-compare"));
    };

    div.onmouseleave = () => {
      const matches = document.querySelectorAll(`.inventory-item[data-itemid="${entry.id}"]`);
      matches.forEach(m => m.classList.remove("inventory-compare"));
    };

    div.querySelector(".buy1-btn").onclick = () =>
      handlePurchase("daily", index, userShop, player, players, playersSha, userShops, userShopsSha);

    div.querySelector(".buymax-btn").onclick = () =>
      handlePurchase("daily", index, userShop, player, players, playersSha, userShops, userShopsSha);

    div.querySelector(".buyx-btn").onclick = () =>
      handlePurchase("daily", index, userShop, player, players, playersSha, userShops, userShopsSha);

    container.appendChild(div);
  });
}

/************************************************************
 * housing-ui.js
 ************************************************************/

import { HousingEngine } from "./housing-engine.js";

let player = JSON.parse(sessionStorage.getItem("player_data") || "{}");

const homeEl = document.getElementById("home-info");
const furnitureEl = document.getElementById("furniture-list");
const detailEl = document.getElementById("detail-panel");

init();

function init() {
  renderHome();
}

function renderHome() {
  const home = HousingEngine.getPlayerHome(player);

  if (!home) {
    homeEl.innerHTML = `
      <h2>No Home Owned</h2>
      <button class="btn" onclick="buyStarterHome()">Buy Starter Cabin (200g)</button>
    `;
    return;
  }

  const template = HousingEngine.getHome(home.key);

  homeEl.innerHTML = `
    <h2>${template.name}</h2>
    <p>Tier: ${template.tier}</p>
    <p>Furniture Slots: ${home.furniture.length} / ${template.maxFurniture}</p>
    <p>Theme: ${home.theme}</p>

    <button class="btn" onclick="upgradeHome()">Upgrade Home</button>
    <button class="btn" onclick="showFurniture()">Manage Furniture</button>
    <button class="btn" onclick="showThemes()">Change Theme</button>
  `;
}

window.buyStarterHome = function() {
  if ((player.gold || 0) < 200) {
    alert("Not enough gold.");
    return;
  }

  player.gold -= 200;
  HousingEngine.giveHome(player, "starter_cabin");

  sessionStorage.setItem("player_data", JSON.stringify(player));
  renderHome();
};

window.upgradeHome = function() {
  const result = HousingEngine.upgradeHome(player);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  sessionStorage.setItem("player_data", JSON.stringify(player));
  alert("Home upgraded!");
  renderHome();
};

window.showFurniture = function() {
  const home = HousingEngine.getPlayerHome(player);
  const template = HousingEngine.getHome(home.key);

  const out = Object.entries(HousingEngine.getAllFurniture?.() || {})
    .map(([key, f]) => `
      <div class="furniture-row">
        <button onclick="placeFurniture('${key}')">${f.name}</button>
        <span>${f.type}</span>
      </div>
    `)
    .join("");

  detailEl.innerHTML = `
    <h3>Furniture</h3>
    ${out}
  `;
};

window.placeFurniture = function(key) {
  const result = HousingEngine.placeFurniture(player, key);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  sessionStorage.setItem("player_data", JSON.stringify(player));
  alert("Furniture placed!");
  renderHome();
};

window.showThemes = function() {
  const home = HousingEngine.getPlayerHome(player);
  const template = HousingEngine.getHome(home.key);

  const out = template.themes
    .map(t => `<button class="btn" onclick="setTheme('${t}')">${t}</button>`)
    .join("");

  detailEl.innerHTML = `
    <h3>Available Themes</h3>
    ${out}
  `;
};

window.setTheme = function(theme) {
  const result = HousingEngine.setTheme(player, theme);
  if (!result.ok) {
    alert(result.reason);
    return;
  }

  sessionStorage.setItem("player_data", JSON.stringify(player));
  alert("Theme updated!");
  renderHome();
};

window.goToWorldMap = () => (window.location.href = "world-map.html");
window.goToInventory = () => (window.location.href = "inventory.html");

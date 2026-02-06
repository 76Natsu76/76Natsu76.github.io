// world-map.js
// World Map 2.1 — Region + Subregion selection

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { EncounterEngine, initEncounters } from "./encounters.js";
import { EnemyRegistry } from "./enemy-registry.js";
import { WorldSim } from "./world-simulation.js";
import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { getRegenRates } from "./regen.js";
import { initWorldState, tickWorld } from "./world-tick.js";
import { REGION_HIERARCHY } from "./region-hierarchy.js";

/****************************************************
 * SESSION + INITIALIZATION
 ****************************************************/

async function init() {
  await requireSession();
  await initEncounters();
  await EnemyRegistry.loadAll();
  await WorldSim.init();

  const { username } = window.syncState;
  const usernameDisplay = document.getElementById("usernameDisplay");
  if (usernameDisplay) {
    usernameDisplay.textContent = "Logged in as: " + username;
  }

  let player = PlayerStorage.load(username);
  if (!player) {
    alert("No player data found.");
    window.location.href = "landing.html";
    return;
  }

  player = applyRegen(player);
  PlayerStorage.save(username, player);

  let worldState = loadOrInitWorldState();
  worldState = maybeTickWorld(worldState);
  saveWorldState(worldState);

  renderSeasonBanner(worldState);
  renderWorldMap(player, worldState, username);
  wireNavigationButtons();
  wireRegionClicks(player, worldState, username);
}

/****************************************************
 * PLAYER REGEN
 ****************************************************/

function applyRegen(player) {
  if (!player) return player;

  const now = Date.now();
  const last = player.lastRegenTick || now;
  const minutes = (now - last) / 60000;
  if (minutes <= 0) return player;

  const { hpPerMinute, mpPerMinute } = getRegenRates(player);

  const hpGain = Math.floor(minutes * hpPerMinute);
  const mpGain = Math.floor(minutes * mpPerMinute);

  player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + hpGain);
  player.manaCurrent = Math.min(
    player.manaMax,
    (player.manaCurrent ?? player.mana ?? 0) + mpGain
  );
  player.mana = player.manaCurrent;
  player.lastRegenTick = now;

  return player;
}

/****************************************************
 * WORLD STATE LOAD / SAVE / TICK
 ****************************************************/

const WORLD_TICK_STORAGE_KEY = "world_tick_state";

function loadOrInitWorldState() {
  try {
    const raw = localStorage.getItem(WORLD_TICK_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load world tick state", e);
  }

  const regionKeys = Object.keys(WORLD_DATA.regions || {});
  return initWorldState(regionKeys);
}

function saveWorldState(worldState) {
  try {
    localStorage.setItem(WORLD_TICK_STORAGE_KEY, JSON.stringify(worldState));
  } catch (e) {
    console.warn("Failed to save world tick state", e);
  }
}

function maybeTickWorld(worldState) {
  return tickWorld(worldState);
}

/****************************************************
 * UI HELPERS — WEATHER, HAZARD, EVENTS
 ****************************************************/

function weatherKeyToIconAndLabel(key) {
  switch (key) {
    case "clear": return { icon: "☀️", label: "Clear" };
    case "rain":
    case "soft_rain": return { icon: "🌧️", label: "Rain" };
    case "storm": return { icon: "🌩️", label: "Storm" };
    case "fog":
    case "mystic_fog": return { icon: "🌫️", label: "Fog" };
    case "heatwave": return { icon: "🔥", label: "Heatwave" };
    case "void_storm": return { icon: "🌀", label: "Void Storm" };
    case "arcane_winds": return { icon: "✨", label: "Arcane Winds" };
    default: return { icon: "☁️", label: format(key || "Unknown") };
  }
}

function hazardLevelToClass(level) {
  if (level >= 70) return "hazard-high";
  if (level >= 40) return "hazard-medium";
  return "hazard-low";
}

function influenceIcon(key) {
  switch (key) {
    case "corruption": return "🜂";
    case "wildlife": return "🐾";
    case "humanoid": return "⚔️";
    case "elemental": return "✨";
    default: return "•";
  }
}

function formatEventBadge(evt) {
  const type = evt.type || "ambient";
  let cls = "event-badge-ambient";
  if (type === "crisis") cls = "event-badge-crisis";
  if (type === "seasonal") cls = "event-badge-seasonal";

  const label = format(evt.key || type);
  return `<span class="event-badge ${cls}">${label}</span>`;
}

/****************************************************
 * RENDER — SEASON + WORLD MAP
 ****************************************************/

function renderSeasonBanner(worldState) {
  const banner = document.getElementById("seasonBanner");
  if (!banner) return;

  const season = (worldState.season || "Unknown").toString().toLowerCase();
  banner.textContent = "Season: " + format(season);
  banner.className = "season-banner season-" + season;
}

function renderWorldMap(player, worldState, username) {
  const container = document.getElementById("mapContainer");
  if (!container) return;

  const out = [];
  const playerLevel = Number(player.level || 1);

  for (const regionKey in WORLD_DATA.regions) {
    const region = WORLD_DATA.regions[regionKey];
    const tickRegion = worldState.regions?.[regionKey] || {};
    const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
    const biome = BIOMES[biomeKey];

    const [minLevel, maxLevel] = region.levelRange || [1, 999];
    const levelLocked = playerLevel < minLevel;

    const hazardLevel = tickRegion.hazardLevel ?? 0;
    const hazardClass = hazardLevelToClass(hazardLevel);

    const influence = tickRegion.influence || {
      corruption: 0,
      wildlife: 0,
      humanoid: 0,
      elemental: 0
    };

    const weatherKey = tickRegion.currentWeatherKey || region.weatherPool?.[0] || "clear";
    const { icon: weatherIcon, label: weatherLabel } = weatherKeyToIconAndLabel(weatherKey);

    const activeEvents = tickRegion.activeEvents || [];
    const eventBadges = activeEvents.length
      ? activeEvents.map(formatEventBadge).join(" ")
      : "<span class='event-badge event-badge-none'>None</span>";

    const subregionDefs = REGION_HIERARCHY[regionKey]?.subregions || {};
    const subregionOptions = Object.entries(subregionDefs)
      .map(([key, sr]) =>
        `<option value="${key}">${format(key)} (Tier ${sr.tier})</option>`
      )
      .join("");

    out.push(`
      <div class="region-card">
        <div class="region-header">
          <h2>${region.name}</h2>
          <div class="region-subtitle">${format(biomeKey)}</div>
        </div>

        <div class="region-row">
          <div class="region-weather">
            <span class="weather-icon">${weatherIcon}</span>
            <span class="weather-label">${weatherLabel}</span>
          </div>

          <div class="region-hazard">
            <div class="hazard-label">
              <span>Hazard</span>
              <span>${hazardLevel.toFixed(0)}%</span>
            </div>
            <div class="hazard-bar ${hazardClass}">
              <div class="hazard-fill" style="width:${Math.min(100, hazardLevel)}%;"></div>
            </div>
          </div>
        </div>

        <div class="region-influence">
          ${["corruption","wildlife","humanoid","elemental"].map(k => `
            <div class="influence-item">
              <span class="influence-icon">${influenceIcon(k)}</span>
              <span class="influence-label">${format(k)}</span>
              <span class="influence-value">${influence[k].toFixed(0)}</span>
            </div>
          `).join("")}
        </div>

        <div class="region-events">
          <strong>Events:</strong>
          <div class="event-badges">${eventBadges}</div>
        </div>

        <div class="region-subregions">
          <label>Area:
            <select class="subregion-select" data-region="${regionKey}">
              ${subregionOptions}
            </select>
          </label>
        </div>

        <button class="btn ${levelLocked ? "disabled" : ""}"
          data-region="${regionKey}"
          data-locked="${levelLocked ? "1" : "0"}">
          ${levelLocked ? `Requires Lv ${minLevel}` : "Enter Area"}
        </button>
      </div>
    `);
  }

  container.innerHTML = out.join("");
}

/****************************************************
 * EVENT WIRING
 ****************************************************/

function wireRegionClicks(player, worldState, username) {
  const container = document.getElementById("mapContainer");
  if (!container) return;

  container.addEventListener("click", e => {
    const btn = e.target.closest("button[data-region]");
    if (!btn) return;

    const regionKey = btn.getAttribute("data-region");
    const locked = btn.getAttribute("data-locked") === "1";
    if (locked) return;

    const select = container.querySelector(
      `.subregion-select[data-region="${regionKey}"]`
    );
    const subregionKey = select?.value;
    if (!subregionKey) {
      alert("Choose an area before entering.");
      return;
    }

    const encounter = EncounterEngine.generate(regionKey, subregionKey, username);
    sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));
    window.location.href = "fight-interactive.html";
  });
}

function wireNavigationButtons() {
  const charBtn = document.getElementById("characterBtn");
  const invBtn = document.getElementById("inventoryBtn");
  const bestiaryBtn = document.getElementById("bestiaryBtn");

  if (charBtn) charBtn.onclick = () => window.location.href = "character.html";
  if (invBtn) invBtn.onclick = () => window.location.href = "inventory.html";
  if (bestiaryBtn) bestiaryBtn.onclick = () => window.location.href = "bestiary.html";
}

/****************************************************
 * UTIL
 ****************************************************/

function format(str) {
  return String(str)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/****************************************************
 * BOOTSTRAP
 ****************************************************/

init().catch(err => {
  console.error("Failed to init world map:", err);
});

// --- world-map.js — Region cards + map markers + boss unlocks //

import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { EnemyRegistry } from "./enemy-registry.js";
import { initEncounters, EncounterEngine } from "./encounters.js";
import { WorldSim } from "./world-simulation.js";
import { WORLD_DATA } from "./world-data.js";
import { initWorldState, getWorldState, worldTick as tickWorld } from "./world-state.js";
import { REGION_HIERARCHY } from "./region-hierarchy.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { REGION_TO_SETTLEMENT } from "./settlement-index.js";
import { SETTLEMENTS } from "./settlements.js";

// --- GLOBALS FOR POPUP CONTEXT //
let currentPlayer = null;
let currentWorldState = null;
let currentUsername = null;

// --- SIMPLE REGEN RATES (local helper) //
function getRegenRates(player) {
  const hpMax = Number(player.hpMax || 0);
  const mpMax = Number(player.manaMax ?? player.mana ?? 0);

  const hpPerMinute = Math.max(1, Math.floor(hpMax * 0.02));
  const mpPerMinute = Math.max(1, Math.floor(mpMax * 0.02));

  return { hpPerMinute, mpPerMinute };
}

// --- INIT //
async function init() {
  await requireSession();
  await initEncounters();
  await EnemyRegistry.loadAll();
  await WorldSim.init();

  const { username } = window.syncState;
  currentUsername = username;

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
  currentPlayer = player;

  let worldState = loadOrInitWorldState();
  worldState = maybeTickWorld(worldState);
  saveWorldState(worldState);
  currentWorldState = worldState;

  renderGlobalAnnouncements(worldState);
  renderWorldEvents(worldState);
  renderSeasonBanner(worldState);
  renderWorldMap(player, worldState, username);
  wireNavigationButtons();
  wireRegionClicks(player, worldState, username);
  renderRegionMarkers(player);
}

init().catch(err => {
  console.error("Failed to init world map:", err);
});

// --- PLAYER REGEN //
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

// --- WORLD STATE LOAD / SAVE / TICK //
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

// --- REGION UNLOCK LOGIC //
function isRegionUnlocked(player, regionKey, regionState) {
  const rules = WORLD_DATA.regions[regionKey].unlock;

  if (player.level < rules.level) return false;
  if (rules.requiresBossClear && !regionState.worldBossDefeated) return false;

  return true;
}

// --- UI HELPERS — WEATHER, HAZARD, EVENTS //
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
  // Map directly to danger-* classes used in CSS
  if (level >= 70) return "danger-high";
  if (level >= 40) return "danger-medium";
  return "danger-low";
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

function crisisStageToLabel(crisis, stageIndex) {
  if (!crisis) return "None";
  return `${format(crisis)} — Stage ${Number(stageIndex ?? 0) + 1}`;
}

function dangerLevelToClass(danger) {
  if (danger >= 3.5) return "danger-extreme";
  if (danger >= 2.5) return "danger-high";
  if (danger >= 1.5) return "danger-medium";
  return "danger-low";
}

function elementalChargeIcons(charge = {}) {
  return Object.entries(charge)
    .filter(([_, v]) => v > 0)
    .map(([elem, v]) => {
      const icon =
        elem === "fire" ? "🔥" :
        elem === "frost" ? "❄️" :
        elem === "void" ? "🌀" :
        elem === "nature" ? "🌿" :
        "✨";
      return `<span class="elem-charge">${icon} ${v.toFixed(1)}</span>`;
    })
    .join(" ");
}

function overlayIcons(overlays = {}) {
  return Object.keys(overlays)
    .map(key => {
      const icon =
        key === "blight" ? "🟣" :
        key === "storm" ? "🌩️" :
        key === "frost" ? "❄️" :
        key === "wilds" ? "🌿" :
        "⬤";
      return `<span class="overlay-icon">${icon}</span>`;
    })
    .join(" ");
}

function renderWorldEvents(worldState) {
  const box = document.getElementById("worldEventsContent");
  if (!box) return;

  const global = worldState.global || {};
  const out = [];

  // Global Modifiers
  if (global.globalModifiers?.length) {
    out.push(`<div class="world-event-entry">
<span class="world-event-tag">Global Modifiers</span>
${global.globalModifiers.map(m => format(m.key || "modifier")).join(", ")}
</div>`);
  }

  // Weather Fronts
  if (global.weatherFronts?.length) {
    out.push(`<div class="world-event-entry">
<span class="world-event-tag">Weather Fronts</span>
${global.weatherFronts.map(f => format(f.weatherKey)).join(", ")}
</div>`);
  }

  // Migrations
  if (global.migrations?.length) {
    out.push(`<div class="world-event-entry">
<span class="world-event-tag">Migrations</span>
${global.migrations.map(m => format(m.faction)).join(", ")}
</div>`);
  }

  // Anomalies
  if (global.anomalies?.length) {
    out.push(`<div class="world-event-entry">
<span class="world-event-tag">Anomalies</span>
${global.anomalies.map(a => format(a.element)).join(", ")}
</div>`);
  }

  // Global Announcements (last 5)
  const announcements = global.announcements || [];
  if (announcements.length) {
    out.push(`<div class="world-event-entry">
<span class="world-event-tag">Announcements</span>
${announcements.slice(-5).map(a => a.message).join("<br>")}
</div>`);
  }

  if (!out.length) {
    box.innerHTML = `<div class="world-event-entry">No active world events.</div>`;
  } else {
    box.innerHTML = out.join("");
  }
}

// --- GLOBAL OVERLAYS PER REGION //
function buildGlobalOverlaysForRegion(globalState, regionKey) {
  if (!globalState) return "";

  const parts = [];

  // Weather fronts
  for (const front of globalState.weatherFronts || []) {
    const currentRegion = front.path[front.position];
    if (currentRegion === regionKey) {
      const icon = front.weatherKey === "storm" ? "⛈️"
        : front.weatherKey === "heatwave" ? "🔥"
        : front.weatherKey === "void_storm" ? "🌀"
        : "🌦️";

      parts.push(`<span class="global-overlay-tag global-overlay-weather">
${icon} ${format(front.weatherKey)} (Int ${front.intensity || 1})
</span>`);
    }
  }

  // Migrations
  for (const mig of globalState.migrations || []) {
    const currentRegion = mig.path[mig.position];
    if (currentRegion === regionKey) {
      parts.push(`<span class="global-overlay-tag global-overlay-migration">
🐾 ${format(mig.faction)} Migration
</span>`);
    }
  }

  // Anomalies
  for (const anomaly of globalState.anomalies || []) {
    if (anomaly.region === regionKey) {
      const icon = anomaly.element === "void" ? "🌀"
        : anomaly.element === "frost" ? "❄️"
        : anomaly.element === "fire" ? "🔥"
        : "✨";

      parts.push(`<span class="global-overlay-tag global-overlay-anomaly">
${icon} ${format(anomaly.element)} Anomaly (Int ${anomaly.intensity})
</span>`);
    }
  }

  // Global modifiers
  for (const mod of globalState.globalModifiers || []) {
    if (mod.expired) continue;
    parts.push(`<span class="global-overlay-tag global-overlay-global">
🌒 Global Effect
</span>`);
  }

  return parts.join(" ");
}

// --- BOSS STATUS RENDERING //
function renderBossStatus(regionState) {
  if (regionState.worldBossActive) {
    return "⚔️ WORLD BOSS ACTIVE";
  }

  if (regionState.worldBossAwakening) {
    const minutes = Math.ceil((regionState.worldBossAwakening - Date.now()) / 60000);
    return `⏳ Boss Awakening in ${minutes}m`;
  }

  return "Dormant";
}

// --- REGION HISTORY RENDERING //
function renderRegionHistory(regionState) {
  const history = regionState.history || [];
  if (!history.length) {
    return `<div class="history-entry history-empty">No recent events.</div>`;
  }

  return history
    .slice(-20)
    .reverse()
    .map(entry => {
      const time = new Date(entry.timestamp).toLocaleString();
      return `<div class="history-entry">
<span class="history-time">${time}</span>
<span class="history-msg">${entry.message}</span>
</div>`;
    })
    .join("");
}

// --- SEASON BANNER //
function renderSeasonBanner(worldState) {
  const banner = document.getElementById("seasonBanner");
  if (!banner) return;

  const season = (worldState.season || "Unknown").toString().toLowerCase();
  banner.textContent = "Season: " + format(season);
  banner.className = "season-banner season-" + season;
}

// --- WORLD MAP — REGION CARDS //
function renderWorldMap(player, worldState, username) {
  const container = document.getElementById("mapContainer");
  if (!container) return;

  const out = [];
  const playerLevel = Number(player.level || 1);
  const global = worldState.global || {};

  for (const regionKey in WORLD_DATA.regions) {
    const region = WORLD_DATA.regions[regionKey];
    const regionState = worldState.regions?.[regionKey] || {};
    const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
    const biome = BIOMES[biomeKey];

    const globalOverlays = buildGlobalOverlaysForRegion(global, regionKey);

    const [minLevel, maxLevel] = region.levelRange || [1, 999];
    const levelLocked = playerLevel < minLevel;

    const dangerLevel = Number(regionState.dangerLevel ?? 1.0);
    let dangerBoost = 0;
    
    if (player.seedMeta?.cursedClears > 0) dangerBoost += 0.2;
    if (player.seedMeta?.chaosClears > 0) dangerBoost += 0.1;
    
    const effectiveDanger = dangerLevel + dangerBoost;
    const hazardClass = dangerLevelToClass(effectiveDanger);
    const hazardLevel = effectiveDanger * 20;

    const influence = regionState.factionControl || {
      corruption: 0,
      wildlife: 0,
      humanoid: 0,
      elemental: 0
    };

    const weatherKey = regionState.weather || region.weatherPool?.[0] || "clear";
    const { icon: weatherIcon, label: weatherLabel } = weatherKeyToIconAndLabel(weatherKey);

    const activeEvents = regionState.crisis
      ? [{ key: regionState.crisis, type: "crisis" }]
      : [];
    const eventBadges = activeEvents.length
      ? activeEvents.map(formatEventBadge).join(" ")
      : "<span class='event-badge event-badge-none'>None</span>";

    const subregionDefs = REGION_HIERARCHY[regionKey]?.subregions || {};
    const subregionOptions = Object.entries(subregionDefs)
      .map(([key, sr]) =>
        `<option value="${key}">${format(key)} (Tier ${sr.tier})</option>`
      )
      .join("");

    const settlementKey = REGION_TO_SETTLEMENT[regionKey];
    let settlementButtonHtml = "";
    if (settlementKey && SETTLEMENTS[settlementKey]) {
      settlementButtonHtml = `
<button class="btn" onclick="window.location.href='town.html?town=${settlementKey}'">
Visit ${SETTLEMENTS[settlementKey].name}
</button>`;
    }

    out.push(`
<div class="region-card" id="region-card-${regionKey}">
  <div class="region-header">
    <h2>${region.name}</h2>
    <div class="region-subtitle">${format(biomeKey)}</div>
  </div>

  ${settlementButtonHtml}

  <div class="region-row">
    <div class="region-weather">
      <span class="weather-icon">${weatherIcon}</span>
      <span class="weather-label">${weatherLabel}</span>
    </div>

    <div class="region-danger">
      <div class="danger-label">
        <span>Danger</span>
        <span>${dangerLevel.toFixed(2)}</span>
      </div>
      <div class="danger-bar ${hazardClass}">
        <div class="danger-fill" style="width:${Math.min(100, hazardLevel)}%;"></div>
      </div>
    </div>
  </div>

  <div class="region-crisis">
    <strong>Crisis:</strong>
    <span>${crisisStageToLabel(regionState.crisis, regionState.crisisStageIndex)}</span>
  </div>

  <div class="region-boss">
    ${renderBossStatus(regionState)}
  </div>

  <div class="region-recovery">
    <strong>Stability:</strong>
    <span>${Number(regionState.stability ?? 1.0).toFixed(2)}</span>
  </div>

  <div class="region-elemental">
    <strong>Elemental Charge:</strong>
    <div>${elementalChargeIcons(regionState.elementalCharge)}</div>
  </div>

  <div class="anomaly-icon"></div>
  <div class="migration-icon"></div>
  <div class="global-icon"></div>

  <div class="region-overlays">
    <strong>Overlays:</strong>
    <div>${overlayIcons(regionState.overlays)}</div>
  </div>

  <div class="region-player-impact">
    <strong>Player Influence Active</strong>
  </div>

  <div class="region-influence">
    ${Object.keys(influence).map(k => `
      <div class="influence-item">
        <span class="influence-icon">${influenceIcon(k)}</span>
        <span class="influence-label">${format(k)}</span>
        <span class="influence-value">${Number(influence[k] || 0).toFixed(0)}</span>
      </div>
    `).join("")}
  </div>

  <div class="region-history">
    <details>
      <summary>Region History</summary>
      <div class="history-list">
        ${renderRegionHistory(regionState)}
      </div>
    </details>
  </div>

  <div class="region-global-overlays">
    ${globalOverlays}
    ${buildSeedAndRelicOverlays(player)}
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

// --- MAP MARKERS — WITH POPUP (Option C) //
function renderRegionMarkers(player) {
  const world = getWorldState();

  for (const regionKey in world.regions) {
    const regionState = world.regions[regionKey];
    const marker = document.getElementById(`region-${regionKey}-marker`);
    if (!marker) continue;

    const unlocked = isRegionUnlocked(player, regionKey, regionState);

    if (!unlocked) {
      marker.classList.add("locked-region");
      marker.onclick = () => {
        alert("Region locked. Defeat the world boss or reach the required level.");
      };
    } else {
      marker.classList.remove("locked-region");
      marker.onclick = () => {
        openRegionPopup(regionKey);
      };
    }
  }
}

function ensureRegionPopup() {
  let popup = document.getElementById("region-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "region-popup";
    popup.className = "region-popup";
    document.body.appendChild(popup);
  }
  return popup;
}

function openRegionPopup(regionKey) {
  const popup = ensureRegionPopup();
  const region = WORLD_DATA.regions[regionKey];
  const world = getWorldState();
  const regionState = world.regions[regionKey] || {};

  const bossStatus = renderBossStatus(regionState);
  const crisisLabel = crisisStageToLabel(regionState.crisis, regionState.crisisStageIndex);

  popup.innerHTML = `
<div class="region-popup-inner">
  <h2>${region.name}</h2>
  <p><strong>Boss:</strong> ${bossStatus}</p>
  <p><strong>Crisis:</strong> ${crisisLabel}</p>

  <div class="region-popup-buttons">
    <button id="popupRegionOverviewBtn">Region Overview</button>
    <button id="popupOpenCardBtn">Open Region Card</button>
    <button id="popupEnterAreaBtn">Enter Area</button>
    <button id="popupCloseBtn">Close</button>
  </div>
</div>
`;

  popup.style.display = "block";

  document.getElementById("popupRegionOverviewBtn").onclick = () => {
    window.location.href = `region.html?region=${regionKey}`;
  };

  document.getElementById("popupOpenCardBtn").onclick = () => {
    const card = document.getElementById(`region-card-${regionKey}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  document.getElementById("popupEnterAreaBtn").onclick = () => {
    const container = document.getElementById("mapContainer");
    const select = container?.querySelector(`.subregion-select[data-region="${regionKey}"]`);
    const subregionKey = select?.value;
    if (!subregionKey) {
      alert("Choose an area in the region card before entering.");
      return;
    }

    const encounter = EncounterEngine.generate(regionKey, subregionKey, currentUsername);
    sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));
    window.location.href = "fight-interactive.html";
  };

  document.getElementById("popupCloseBtn").onclick = () => {
    popup.style.display = "none";
  };
}

// --- EVENT WIRING — REGION CARD BUTTONS //
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
    // Apply seed-based modifiers
    if (player.seedMeta?.blessedClears > 0) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("blessed_world");
    }
    
    if (player.seedMeta?.cursedClears > 0) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("cursed_world");
    }
    
    if (player.seedMeta?.lootClears > 0) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("loot_world");
    }
    
    if (player.seedMeta?.chaosClears > 0) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("chaos_world");
    }
    
    if (player.seedMeta?.bossrushClears > 0) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("bossrush_world");
    }
    
    // Apply relic-based modifiers
    if (player.relics?.includes("chaos_orb")) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("chaos_flux");
    }
    
    if (player.relics?.includes("bossheart")) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("boss_empower");
    }
    
    if (player.relics?.includes("blessed_feather")) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("healing_winds");
    }
    
    if (player.relics?.includes("cursed_crown")) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("cursed_pressure");
    }
    
    if (player.relics?.includes("golden_idol")) {
      encounter.modifiers = encounter.modifiers || [];
      encounter.modifiers.push("treasure_magnet");
    }

    sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));
    window.location.href = "fight-interactive.html";
  });
}

// --- NAVIGATION BUTTONS //
function wireNavigationButtons() {
  const charBtn = document.getElementById("characterBtn");
  const invBtn = document.getElementById("inventoryBtn");
  const bestiaryBtn = document.getElementById("bestiaryBtn");

  if (charBtn) charBtn.onclick = () => window.location.href = "character.html";
  if (invBtn) invBtn.onclick = () => window.location.href = "inventory.html";
  if (bestiaryBtn) bestiaryBtn.onclick = () => window.location.href = "bestiary.html";
}

function renderGlobalAnnouncements(worldState) {
  const box = document.getElementById("globalAnnouncements");
  if (!box) return;

  const list = worldState.global?.announcements || [];

  if (!list.length) {
    box.innerHTML = `<div class="global-announcement-entry">No global announcements.</div>`;
    return;
  }

  box.innerHTML = list
    .slice(-20)
    .reverse()
    .map(a => {
      const time = new Date(a.timestamp).toLocaleTimeString();
      return `
<div class="global-announcement-entry">
  <span class="global-announcement-time">${time}</span>
  <span>${a.message}</span>
</div>
`;
    })
    .join("");
}

function buildSeedAndRelicOverlays(player) {
  const overlays = [];

  const meta = player.seedMeta || {};
  const relics = player.relics || [];

  // Seed-based overlays
  if (meta.blessedClears > 0) overlays.push(`<span class="global-overlay-tag">✨ Blessed Aura</span>`);
  if (meta.cursedClears > 0) overlays.push(`<span class="global-overlay-tag">🜂 Cursed Influence</span>`);
  if (meta.lootClears > 0) overlays.push(`<span class="global-overlay-tag">💰 Treasure Surge</span>`);
  if (meta.chaosClears > 0) overlays.push(`<span class="global-overlay-tag">🌀 Chaotic Distortion</span>`);
  if (meta.bossrushClears > 0) overlays.push(`<span class="global-overlay-tag">⚔️ Boss Resonance</span>`);

  // Relic-based overlays
  if (relics.includes("chaos_orb")) overlays.push(`<span class="global-overlay-tag">🌀 Chaotic Flux</span>`);
  if (relics.includes("bossheart")) overlays.push(`<span class="global-overlay-tag">❤️ Boss Empowerment</span>`);
  if (relics.includes("blessed_feather")) overlays.push(`<span class="global-overlay-tag">✨ Healing Winds</span>`);
  if (relics.includes("cursed_crown")) overlays.push(`<span class="global-overlay-tag">🜂 Cursed Pressure</span>`);
  if (relics.includes("golden_idol")) overlays.push(`<span class="global-overlay-tag">💰 Treasure Magnetism</span>`);

  return overlays.join(" ");
}

// --- UTIL //
function format(str) {
  return String(str)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

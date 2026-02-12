import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { WORLD_DATA } from "./world-data.js";
import { getWorldState } from "./world-state.js";
import { REGION_HIERARCHY } from "./region-hierarchy.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_SETTLEMENT } from "./settlement-index.js";
import { SETTLEMENTS } from "./settlements.js";
import { EncounterEngine } from "./encounters.js";

// --- Seed & Relic Overlays ---
function buildSeedAndRelicOverlays(player) {
  const overlays = [];
  const meta = player.seedMeta || {};
  const relics = player.relics || [];

  if (meta.blessedClears > 0) overlays.push(`<span class="global-overlay-tag">✨ Blessed Aura</span>`);
  if (meta.cursedClears > 0) overlays.push(`<span class="global-overlay-tag">🜂 Cursed Influence</span>`);
  if (meta.lootClears > 0) overlays.push(`<span class="global-overlay-tag">💰 Treasure Surge</span>`);
  if (meta.chaosClears > 0) overlays.push(`<span class="global-overlay-tag">🌀 Chaotic Distortion</span>`);
  if (meta.bossrushClears > 0) overlays.push(`<span class="global-overlay-tag">⚔️ Boss Resonance</span>`);

  if (relics.includes("chaos_orb")) overlays.push(`<span class="global-overlay-tag">🌀 Chaotic Flux</span>`);
  if (relics.includes("bossheart")) overlays.push(`<span class="global-overlay-tag">❤️ Boss Empowerment</span>`);
  if (relics.includes("blessed_feather")) overlays.push(`<span class="global-overlay-tag">✨ Healing Winds</span>`);
  if (relics.includes("cursed_crown")) overlays.push(`<span class="global-overlay-tag">🜂 Cursed Pressure</span>`);
  if (relics.includes("golden_idol")) overlays.push(`<span class="global-overlay-tag">💰 Treasure Magnet</span>`);

  return overlays.join(" ");
}

// --- Weather Icons ---
function weatherKeyToIconAndLabel(key) {
  switch (key) {
    case "clear": return { icon: "☀️", label: "Clear" };
    case "rain": return { icon: "🌧️", label: "Rain" };
    case "storm": return { icon: "🌩️", label: "Storm" };
    case "fog": return { icon: "🌫️", label: "Fog" };
    case "heatwave": return { icon: "🔥", label: "Heatwave" };
    case "void_storm": return { icon: "🌀", label: "Void Storm" };
    case "arcane_winds": return { icon: "✨", label: "Arcane Winds" };
    default: return { icon: "☁️", label: key };
  }
}

// --- Crisis Label ---
function crisisStageToLabel(crisis, stageIndex) {
  if (!crisis) return "None";
  return `${crisis.replace(/_/g, " ")} — Stage ${Number(stageIndex ?? 0) + 1}`;
}

// --- Influence Icons ---
function influenceIcon(key) {
  switch (key) {
    case "corruption": return "🜂";
    case "wildlife": return "🐾";
    case "humanoid": return "⚔️";
    case "elemental": return "✨";
    default: return "•";
  }
}

// --- Region History ---
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

// --- Boss Status ---
function renderBossStatus(regionState) {
  if (regionState.worldBossActive) return "⚔️ WORLD BOSS ACTIVE";
  if (regionState.worldBossAwakening) {
    const minutes = Math.ceil((regionState.worldBossAwakening - Date.now()) / 60000);
    return `⏳ Awakening in ${minutes}m`;
  }
  return "Dormant";
}

// --- Main Init ---
async function init() {
  await requireSession();

  const params = new URLSearchParams(window.location.search);
  const regionKey = params.get("region");
  if (!regionKey || !WORLD_DATA.regions[regionKey]) {
    alert("Invalid region.");
    window.location.href = "world-map.html";
    return;
  }

  const { username } = window.syncState;
  const player = PlayerStorage.load(username);
  const worldState = getWorldState();
  const regionState = worldState.regions[regionKey] || {};
  const region = WORLD_DATA.regions[regionKey];

  document.getElementById("usernameDisplay").textContent =
    "Logged in as: " + username;

  renderRegionInfo(player, region, regionState, regionKey);
}

init().catch(err => console.error(err));

// --- Render Region Info ---
function renderRegionInfo(player, region, regionState, regionKey) {
  const container = document.getElementById("regionContainer");

  const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
  const biome = BIOMES[biomeKey];

  const weatherKey = regionState.weather || region.weatherPool?.[0] || "clear";
  const { icon: weatherIcon, label: weatherLabel } = weatherKeyToIconAndLabel(weatherKey);

  const danger = Number(regionState.dangerLevel ?? 1.0);
  const hazardLevel = danger * 20;
  const hazardClass =
    danger >= 3.5 ? "danger-extreme" :
    danger >= 2.5 ? "danger-high" :
    danger >= 1.5 ? "danger-medium" :
    "danger-low";

  const influence = regionState.factionControl || {
    corruption: 0,
    wildlife: 0,
    humanoid: 0,
    elemental: 0
  };

  const subregions = REGION_HIERARCHY[regionKey]?.subregions || {};
  const subregionOptions = Object.entries(subregions)
    .map(([key, sr]) =>
      `<option value="${key}">${key.replace(/_/g, " ")} (Tier ${sr.tier})</option>`
    )
    .join("");

  const settlementKey = REGION_TO_SETTLEMENT[regionKey];
  const settlementButton = settlementKey && SETTLEMENTS[settlementKey]
    ? `<button class="btn" onclick="window.location.href='town.html?town=${settlementKey}'">
         Visit ${SETTLEMENTS[settlementKey].name}
       </button>`
    : "";

  const seedRelicOverlays = buildSeedAndRelicOverlays(player);

  container.innerHTML = `
    <div class="region-card">

      <div class="region-header">
        <h2>${region.name}</h2>
        <div class="region-subtitle">${biomeKey.replace(/_/g, " ")}</div>
      </div>

      ${settlementButton}

      <p>${region.flavor}</p>

      <div class="region-row">
        <div class="region-weather">
          <span class="weather-icon">${weatherIcon}</span>
          <span class="weather-label">${weatherLabel}</span>
        </div>

        <div class="region-danger">
          <div class="danger-label">
            <span>Danger</span>
            <span>${danger.toFixed(2)}</span>
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
        <div>${Object.entries(regionState.elementalCharge || {})
          .map(([elem, v]) => `<span class="elem-charge">${elem}: ${v.toFixed(1)}</span>`)
          .join("")}
        </div>
      </div>

      <div class="region-overlays">
        <strong>Overlays:</strong>
        <div>${Object.keys(regionState.overlays || {})
          .map(k => `<span class="overlay-icon">⬤</span>`)
          .join("")}</div>
      </div>

      <div class="region-global-overlays">
        ${seedRelicOverlays || "<span class='global-overlay-none'>No seed/relic effects</span>"}
      </div>

      <div class="region-influence">
        ${Object.keys(influence).map(k => `
          <div class="influence-item">
            <span class="influence-icon">${influenceIcon(k)}</span>
            <span class="influence-label">${k.replace(/_/g, " ")}</span>
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

      <div class="region-subregions">
        <label>Area:
          <select id="subregionSelect">
            ${subregionOptions}
          </select>
        </label>
      </div>

      <button class="btn" id="enterAreaBtn">Enter Area</button>

    </div>
  `;

  document.getElementById("enterAreaBtn").onclick = () => {
    const subregionKey = document.getElementById("subregionSelect").value;
    if (!subregionKey) {
      alert("Choose an area before entering.");
      return;
    }

    const encounter = EncounterEngine.generate(regionKey, subregionKey, player.username);
    sessionStorage.setItem("currentEncounter", JSON.stringify(encounter));
    window.location.href = "fight-interactive.html";
  };
}

function goBack() {
  window.location.href = "world-map.html";
}

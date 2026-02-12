import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { WORLD_DATA } from "./world-data.js";
import { getWorldState } from "./world-state.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { BIOMES } from "./biomes.js";
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

async function init() {
  await requireSession();

  const { username } = window.syncState;
  const player = PlayerStorage.load(username);
  document.getElementById("usernameDisplay").textContent =
    "Logged in as: " + username;

  const encounterRaw = sessionStorage.getItem("currentEncounter");
  if (!encounterRaw) {
    alert("No encounter found.");
    window.location.href = "world-map.html";
    return;
  }

  const encounter = JSON.parse(encounterRaw);
  const regionKey = encounter.region;
  const region = WORLD_DATA.regions[regionKey];
  const worldState = getWorldState();
  const regionState = worldState.regions[regionKey] || {};

  renderEncounter(player, encounter, region, regionState);
}

init().catch(err => console.error(err));

function renderEncounter(player, encounter, region, regionState) {
  const container = document.getElementById("encounterContainer");

  const biomeKey = REGION_TO_BIOME[region.key] || region.biome;
  const biome = BIOMES[biomeKey];

  const weatherKey = regionState.weather || region.weatherPool?.[0] || "clear";
  const { icon: weatherIcon, label: weatherLabel } = weatherKeyToIconAndLabel(weatherKey);

  const seedRelicOverlays = buildSeedAndRelicOverlays(player);

  container.innerHTML = `
    <div class="encounter-card">

      <div class="encounter-title">A Wild Encounter Appears</div>

      <div class="encounter-row"><strong>Region:</strong> ${region.name}</div>
      <div class="encounter-row"><strong>Biome:</strong> ${biomeKey.replace(/_/g, " ")}</div>

      <div class="encounter-row">
        <strong>Weather:</strong> ${weatherIcon} ${weatherLabel}
      </div>

      <div class="encounter-row">
        <strong>Enemy Family:</strong> ${encounter.family}
      </div>

      <div class="encounter-row">
        <strong>Rarity:</strong> ${encounter.rarity}
      </div>

      <div class="encounter-row">
        <strong>Seed/Relic Effects:</strong>
        <div>${seedRelicOverlays || "<span class='global-overlay-none'>None</span>"}</div>
      </div>

      <div class="encounter-buttons">
        <button class="btn" id="fightBtn">Fight</button>
        <button class="btn" id="fleeBtn">Flee</button>
      </div>

    </div>
  `;

  document.getElementById("fightBtn").onclick = () => {
    window.location.href = "fight-interactive.html";
  };

  document.getElementById("fleeBtn").onclick = () => {
    alert("You flee back to the region.");
    window.location.href = `region-info.html?region=${region.key}`;
  };
}

function goBack() {
  window.location.href = "world-map.html";
}

import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { WORLD_DATA } from "./world-data.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { BIOMES } from "./biomes.js";

function tag(label, cls="") {
  return `<span class="modifier-tag ${cls}">${label}</span>`;
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
  renderEncounter(player, encounter);
}

init().catch(err => console.error(err));

function renderEncounter(player, encounter) {
  const container = document.getElementById("encounterContainer");

  const region = WORLD_DATA.regions[encounter.region];
  const biomeKey = REGION_TO_BIOME[encounter.region] || region.biome;
  const biome = BIOMES[biomeKey];

  // Build modifier tags
  const modTags = encounter.modifiers.map(m => {
    if (m.startsWith("crisis_")) return tag(m.replace("crisis_", "Crisis: "), "crisis-tag");
    if (m.startsWith("storm_") || m.startsWith("weather_front")) return tag(m.replace(/_/g, " "), "weather-tag");
    if (m.startsWith("migration_")) return tag(m.replace("migration_", "Migration: "), "migration-tag");
    if (m.startsWith("anomaly_")) return tag(m.replace("anomaly_", "Anomaly: "), "anomaly-tag");
    if (m.startsWith("global_")) return tag(m.replace("global_", "Global: "), "global-tag");
    if (m.includes("chaos")) return tag(m.replace(/_/g, " "), "chaos-tag");
    return tag(m.replace(/_/g, " "));
  }).join("");

  const chaosTag = encounter.chaosMutated
    ? tag("Chaos Mutation", "chaos-tag")
    : "";

  container.innerHTML = `
    <div class="encounter-card">

      <div class="encounter-title">A Wild Encounter Appears</div>

      <div class="encounter-row"><strong>Region:</strong> ${region.name}</div>
      <div class="encounter-row"><strong>Biome:</strong> ${biomeKey.replace(/_/g, " ")}</div>
      <div class="encounter-row"><strong>Weather:</strong> ${encounter.weather}</div>

      <div class="encounter-row"><strong>Enemy Family:</strong> ${encounter.family}</div>
      <div class="encounter-row"><strong>Rarity:</strong> ${encounter.rarity}</div>

      <div class="encounter-row"><strong>Danger Level:</strong> ${encounter.danger.toFixed(2)}</div>

      ${encounter.crisis ? `
        <div class="encounter-row"><strong>Crisis:</strong> ${encounter.crisis}</div>
      ` : ""}

      ${encounter.anomalyElement ? `
        <div class="encounter-row"><strong>Anomaly:</strong> ${encounter.anomalyElement}</div>
      ` : ""}

      ${encounter.migrationFaction ? `
        <div class="encounter-row"><strong>Migration:</strong> ${encounter.migrationFaction}</div>
      ` : ""}

      <div class="encounter-row">
        <strong>Modifiers:</strong>
        <div>${chaosTag}${modTags || "<span class='modifier-tag'>None</span>"}</div>
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
    window.location.href = `region-info.html?region=${encounter.region}`;
  };
}

function goBack() {
  window.location.href = "world-map.html";
}

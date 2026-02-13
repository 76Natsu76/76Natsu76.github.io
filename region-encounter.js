import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { WORLD_DATA } from "./world-data.js";
import { ENEMY_REGISTRY } from "./enemy-registry.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";
import { BIOMES } from "./biomes.js";
import {
  ANOMALIES,
  MIGRATIONS,
  GLOBAL_MODIFIERS
} from "./environment-taxonomy.js";
// NEW IMPORTS
import { REGION_IDENTITY } from "./region-identity.js";
import { BIOME_IDENTITY } from "./biome-identity.js";
import { SUBREGION_IDENTITY } from "./subregion-identity.js";


function prettyEnvLabel(key, table) {
  if (!key) return "None";
  return table[key]?.label || key;
}

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

  const baseEnemy = ENEMY_REGISTRY[encounter.family];
  if (!baseEnemy) {
    container.innerHTML = `<div class="encounter-card">Unknown enemy family: ${encounter.family}</div>`;
    return;
  }

  const enemy = buildPreviewEnemy(baseEnemy, encounter);

  const modTags = buildModifierTags(encounter);

  container.innerHTML = `
    <div class="encounter-card">

      <div class="section-title">Enemy</div>
      <div><strong>Name:</strong> ${enemy.name}</div>
      <div><strong>Family:</strong> ${encounter.family}</div>
      <div><strong>Element:</strong> ${enemy.element || "none"}</div>
      <div><strong>Rarity:</strong> ${encounter.rarity}</div>

      <div class="section-title">Stats</div>
      ${statRow("HP", `${enemy.hpCurrent} / ${enemy.hpMax}`)}
      ${statRow("ATK", enemy.atk)}
      ${statRow("DEF", enemy.def)}
      ${statRow("SPD", enemy.speed)}

      <div class="section-title">Environment</div>
      <div><strong>Region:</strong> ${region.name}</div>
      <div><strong>Biome:</strong> ${biomeKey.replace(/_/g, " ")}</div>
      <div><strong>Weather:</strong> ${encounter.weather}</div>
      <div><strong>Danger:</strong> ${encounter.danger.toFixed(2)}</div>
      ${encounter.crisis ? `<div><strong>Crisis:</strong> ${encounter.crisis}</div>` : ""}
      ${encounter.anomaly ? `<div>${tag(prettyEnvLabel(encounter.anomaly, ANOMALIES), "anomaly-tag")}</div>` : ""}
      ${encounter.migration ? `<div>${tag(prettyEnvLabel(encounter.migration, MIGRATIONS), "migration-tag")}</div>` : ""}
      ${encounter.globalModifier ? `<div>${tag(prettyEnvLabel(encounter.globalModifier, GLOBAL_MODIFIERS), "global-tag")}</div>` : ""}

      <div class="section-title">Modifiers</div>
      <div>${modTags || "<span class='modifier-tag'>None</span>"}</div>

      <div class="section-title">Abilities</div>
      <div>${renderAbilities(enemy)}</div>

      <div class="section-title">Flavor Tags</div>
      <div>${(enemy.flavorTags || []).join(", ") || "None"}</div>

      <button class="btn" id="fightBtn">Fight</button>
      <button class="btn" id="fleeBtn">Flee</button>

    </div>
  `;

  document.getElementById("fightBtn").onclick = () => {
    window.location.href = "fight-interactive.html";
  };

  document.getElementById("fleeBtn").onclick = () => {
    window.location.href = `region-info.html?region=${encounter.region}`;
  };
}

function statRow(label, value) {
  return `
    <div class="stat-row">
      <span>${label}</span>
      <span>${value}</span>
    </div>
  `;
}

function buildModifierTags(encounter) {
  return encounter.modifiers
    .map(m => {
      if (m.startsWith("crisis_")) return tag(m.replace("crisis_", "Crisis: "), "crisis-tag");
      if (m.startsWith("storm_") || m.startsWith("weather_front")) return tag(m.replace(/_/g, " "), "weather-tag");
      if (m.startsWith("migration_")) return tag(m.replace("migration_", "Migration: "), "migration-tag");
      if (m.startsWith("anomaly_")) return tag(m.replace("anomaly_", "Anomaly: "), "anomaly-tag");
      if (m.startsWith("global_")) return tag(m.replace("global_", "Global: "), "global-tag");
      if (m.includes("chaos")) return tag(m.replace(/_/g, " "), "chaos-tag");
      return tag(m.replace(/_/g, " "));
    })
    .join("");
}

function buildPreviewEnemy(base, encounter) {
  const e = JSON.parse(JSON.stringify(base));

  e.hpMax = Math.floor(e.hpMax * rarityMult(encounter.rarity));
  e.atk = Math.floor(e.atk * rarityMult(encounter.rarity));
  e.def = Math.floor(e.def * rarityMult(encounter.rarity));
  e.speed = Math.floor(e.speed * rarityMult(encounter.rarity));

  const dangerMult = 1 + (encounter.danger - 1) * 0.25;
  e.hpMax = Math.floor(e.hpMax * dangerMult);
  e.atk = Math.floor(e.atk * dangerMult);
  e.def = Math.floor(e.def * dangerMult);

  if (encounter.chaosMutated) {
    e.flavorTags = e.flavorTags || [];
    e.flavorTags.push("chaos-mutated");
    e.atk = Math.floor(e.atk * 1.1);
    e.def = Math.floor(e.def * 1.1);
    e.speed = Math.floor(e.speed * 1.1);
  }

  e.hpCurrent = e.hpMax;

  return e;
}

function rarityMult(r) {
  return {
    common: 1.0,
    uncommon: 1.15,
    rare: 1.35,
    elite: 1.6,
    boss: 2.0
  }[r] || 1.0;
}

function renderAbilities(enemy) {
  if (!enemy.abilities || !enemy.abilities.length) return "None";
  return enemy.abilities.map(a => `<div>• ${a.name}</div>`).join("");
}

export function getRegionContext(regionId, biomeId, subregionId) {
  return {
    regionId,
    biomeId,
    subregionId,
    regionIdentity: REGION_IDENTITY[regionId] || null,
    biomeIdentity: BIOME_IDENTITY[biomeId] || null,
    subregionIdentity:
      SUBREGION_IDENTITY[regionId]?.[subregionId] || null
  };
}

export function resolveRegionEncounter(regionId, biomeId, subregionId, rng) {
  const ctx = getRegionContext(regionId, biomeId, subregionId);

  // build base weights from your existing tables
  let weights = buildBaseEncounterWeights(regionId, biomeId, subregionId);

  // apply identity biases (from encounters.js helper)
  weights = applyIdentityBiases(weights, ctx);

  return rollFromWeights(weights, rng);
}

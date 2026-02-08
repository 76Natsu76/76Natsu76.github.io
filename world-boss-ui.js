/************************************************************
 * world-boss-ui.js
 * ----------------------------------------------------------
 * New UI for world boss encounters using the modern system.
 ************************************************************/

import { EncounterEngine } from "./encounters.js";
import { WORLD_BOSSES } from "./boss-definitions.js";
import { getWorldState } from "./world-state.js";
import { runBossTurn, handleBossDeath, getBossIntro } from "./boss-combat.js";
import { resolveBossLoot } from "./boss-loot-resolver.js";

let encounter = null;
let boss = null;
let player = null;
let regionKey = null;

export function initWorldBossUI(username) {
  const params = new URLSearchParams(window.location.search);
  regionKey = params.get("region");

  if (!regionKey) {
    document.getElementById("worldboss-content").innerHTML = `
      <h2>Error: No region specified.</h2>
      <button onclick="window.location.href='world-map.html'">Return to Map</button>
    `;
    return;
  }

  const world = getWorldState();
  const regionState = world.regions[regionKey];

  if (!regionState?.worldBossActive) {
    document.getElementById("worldboss-content").innerHTML = `
      <h2>No active world boss in this region.</h2>
      <button onclick="window.location.href='world-map.html'">Return to Map</button>
    `;
    return;
  }

  // Generate the boss encounter
  encounter = EncounterEngine.generate(regionKey, "boss", username, null);
  boss = encounter.enemies[0];
  player = { username };

  renderIntro();
}

// ------------------------------------------------------------
// INTRO SCREEN
// ------------------------------------------------------------
function renderIntro() {
  const intro = getBossIntro(encounter);

  document.getElementById("worldboss-content").innerHTML = `
    <h2>${encounter.bossName}</h2>
    <p>${intro}</p>

    <button id="startFightBtn">Begin Battle</button>
    <button onclick="window.location.href='world-map.html'">Return to Map</button>
  `;

  document.getElementById("startFightBtn").onclick = renderBattle;
}

// ------------------------------------------------------------
// BATTLE UI
// ------------------------------------------------------------
function renderBattle() {
  const hpPct = Math.floor((boss.hp / boss.hpMax) * 100);
  const phase = encounter.phase + 1;
  const phaseData = encounter.phases[encounter.phase];

  document.getElementById("worldboss-content").innerHTML = `
    <h2>${encounter.bossName}</h2>

    <p><strong>HP:</strong> ${boss.hp} / ${boss.hpMax} (${hpPct}%)</p>
    <p><strong>Phase:</strong> ${phase} — ${phaseData.name}</p>
    <p><strong>Abilities:</strong> ${phaseData.abilities.join(", ")}</p>

    <div id="boss-log" class="boss-log"></div>

    <button id="attackBtn">Attack</button>
    <button onclick="window.location.href='world-map.html'">Retreat</button>
  `;

  document.getElementById("attackBtn").onclick = playerAttack;
}

// ------------------------------------------------------------
// PLAYER ATTACK → BOSS TURN
// ------------------------------------------------------------
function playerAttack() {
  const logs = [];

  // Player deals fixed damage for now (placeholder)
  const dmg = 150;
  boss.hp = Math.max(0, boss.hp - dmg);

  logs.push({ type: "player", text: `You strike the boss for ${dmg} damage!` });

  if (boss.hp <= 0) {
    return finishBossFight(logs);
  }

  // Boss turn
  const action = runBossTurn(encounter, boss, player, logs);

  logs.push({
    type: "boss",
    text: `${boss.name} uses ${action.ability?.name || "a basic attack"}!`
  });

  // Render logs
  const logBox = document.getElementById("boss-log");
  logBox.innerHTML = logs.map(l => `<p>${l.text}</p>`).join("");

  // Re-render battle UI
  renderBattle();
}

// ------------------------------------------------------------
// BOSS DEFEATED
// ------------------------------------------------------------
function finishBossFight(logs) {
  handleBossDeath(encounter, regionKey, logs);

  const loot = resolveBossLoot(encounter.bossKey);

  document.getElementById("worldboss-content").innerHTML = `
    <h2>${encounter.bossName} Defeated!</h2>

    <h3>Loot Earned:</h3>
    <ul>
      ${loot.items.map(i => `<li>${i}</li>`).join("")}
    </ul>

    <button onclick="window.location.href='world-map.html'">Return to Map</button>
  `;
}

/************************************************************
 * world-boss-ui.js
 ************************************************************/

import { WorldBossEngine } from "./world-boss-engine.js";
import { WorldSim } from "./world-simulation.js";
import { getPlayerById } from "./player-registry.js";

let currentPlayer = null;

export function initWorldBossUI(playerId) {
  currentPlayer = getPlayerById(playerId);
  renderOverview();
}

function renderOverview() {
  const boss = WorldBossEngine.activeBoss;

  if (!boss) {
    document.getElementById("worldboss-content").innerHTML = `
      <h2>No active world boss</h2>
      <button id="spawnBossBtn">Spawn Boss</button>
    `;

    document.getElementById("spawnBossBtn").onclick = spawnBossPrompt;
    return;
  }

  const hpPercent = Math.floor((boss.hp / boss.maxHP) * 100);

  document.getElementById("worldboss-content").innerHTML = `
    <h2>${boss.name}</h2>
    <p>HP: ${boss.hp} / ${boss.maxHP} (${hpPercent}%)</p>
    <p>Phase: ${boss.phaseIndex + 1}</p>
    <p>Turns: ${boss.turnCount}</p>

    <button id="fightBossBtn">Fight Boss</button>
  `;

  document.getElementById("fightBossBtn").onclick = fightBoss;
}

function spawnBossPrompt() {
  const WORLD_BOSSES = WorldSim._getBossData();
  const keys = Object.keys(WORLD_BOSSES);

  const options = keys
    .map(k => `<option value="${k}">${WORLD_BOSSES[k].name}</option>`)
    .join("");

  document.getElementById("worldboss-content").innerHTML = `
    <h2>Spawn World Boss</h2>
    <select id="boss-select">${options}</select>
    <button id="spawnSelectedBtn">Spawn</button>
  `;

  document.getElementById("spawnSelectedBtn").onclick = spawnSelectedBoss;
}

function spawnSelectedBoss() {
  const key = document.getElementById("boss-select").value;
  WorldBossEngine.spawnBoss(key);
  renderOverview();
}

function fightBoss() {
  alert("World boss combat not implemented yet.");
}

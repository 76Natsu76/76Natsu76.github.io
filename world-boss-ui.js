/************************************************************
 * world-boss-ui.js
 ************************************************************/

import { WorldBossEngine } from './world-boss-engine.js';
import { WORLD_BOSSES } from './world-boss-templates.json';
import { getPlayerById } from './player-registry.js';

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
      <button onclick="spawnBossPrompt()">Spawn Boss</button>
    `;
    return;
  }

  const hpPercent = Math.floor((boss.hp / boss.maxHP) * 100);

  document.getElementById("worldboss-content").innerHTML = `
    <h2>${boss.name}</h2>
    <p>HP: ${boss.hp} / ${boss.maxHP} (${hpPercent}%)</p>
    <p>Phase: ${boss.phaseIndex + 1}</p>
    <p>Turns: ${boss.turnCount}</p>

    <button onclick="fightBoss()">Fight Boss</button>
  `;
}

window.spawnBossPrompt = function() {
  const keys = Object.keys(WORLD_BOSSES);
  const options = keys.map(k => `<option value="${k}">${WORLD_BOSSES[k].name}</option>`).join("");

  document.getElementById("worldboss-content").innerHTML = `
    <h2>Spawn World Boss</h2>
    <select id="boss-select">${options}</select>
    <button onclick="spawnSelectedBoss()">Spawn</button>
  `;
};

window.spawnSelectedBoss = function() {
  const key = document.getElementById("boss-select").value;
  WorldBossEngine.spawnBoss(key);
  renderOverview();
};

window.fightBoss = function() {
  // Hook into your combat engine
  alert("World boss combat not implemented yet.");
};

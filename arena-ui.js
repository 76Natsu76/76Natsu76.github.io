/************************************************************
 * arena-ui.js — Modernized JS Module Version
 ************************************************************/

import { ArenaEngine } from './arena-engine.js';
import { ArenaLeaderboard } from './arena-leaderboard.js';
import { ArenaHistory } from './arena-history.js';
import { ARENA } from './arena.js';
import { getPlayerById } from './player-registry.js';

let currentPlayer = null;

export function initArenaUI(playerId) {
  currentPlayer = getPlayerById(playerId);
  window.showLobby();
}

/************************************************************
 * Lobby
 ************************************************************/
window.showLobby = function() {
  const rating = currentPlayer.arenaRating ?? 1000;
  const season = ARENA.seasons.currentSeason;
  const seasonName = ARENA.seasons.seasonConfig[season].name;

  const modes = Object.entries(ARENA.modes)
    .map(([key, m]) => `
      <button onclick="queueMode('${key}')">${m.name}</button>
    `)
    .join("");

  document.getElementById("arena-content").innerHTML = `
    <h2>Arena Lobby</h2>
    <p><strong>Rating:</strong> ${rating}</p>
    <p><strong>Season:</strong> ${season} — ${seasonName}</p>

    <h3>Modes</h3>
    <div>${modes}</div>
  `;
};

window.queueMode = function(modeKey) {
  ArenaEngine.queuePlayer(modeKey, currentPlayer.id);
  alert(`Queued for ${ARENA.modes[modeKey].name}`);
};

/************************************************************
 * Leaderboards
 ************************************************************/
window.showLeaderboards = function() {
  const solo = ArenaLeaderboard.getSoloTop(20)
    .map((p, i) => `<li>${i+1}. ${p.name} — ${p.arenaRating}</li>`)
    .join("");

  const guilds = ArenaLeaderboard.getGuildTop(20)
    .map((g, i) => `<li>${i+1}. ${g.name} — ${g.pvp.rating}</li>`)
    .join("");

  document.getElementById("arena-content").innerHTML = `
    <h2>Arena Leaderboards</h2>

    <h3>Solo Top 20</h3>
    <ul>${solo}</ul>

    <h3>Guild Top 20</h3>
    <ul>${guilds}</ul>
  `;
};

/************************************************************
 * Match History
 ************************************************************/
window.showHistory = function() {
  const matches = ArenaHistory.getRecentMatches(20)
    .map(m => `
      <li>
        ${new Date(m.timestamp).toLocaleString()} —
        ${m.modeKey} —
        Winner: ${m.winner}
      </li>
    `)
    .join("");

  document.getElementById("arena-content").innerHTML = `
    <h2>Match History</h2>
    <ul>${matches}</ul>
  `;
};

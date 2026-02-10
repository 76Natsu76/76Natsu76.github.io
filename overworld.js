/****************************************************
 * OVERWORLD — Pokémon-style movement + travel system
 ****************************************************/

import { isTraveling, getTravelRemaining, finishTravel } from "./travel-lockout.js";
import { PlayerStorage } from "./player-storage.js";

/****************************************************
 * TRAVEL COUNTDOWN UI
 ****************************************************/
export function renderTravelCountdown(ms) {
  const panel = document.getElementById("travelPanel");
  if (!panel) return;

  const seconds = Math.ceil(ms / 1000);

  panel.innerHTML = `
    <div class="section">
      <h2>Traveling...</h2>
      <p>Arrival in ${seconds} seconds</p>
      <button class="btn" id="cancelTravelBtn">Cancel Travel</button>
    </div>
  `;

  const cancelBtn = document.getElementById("cancelTravelBtn");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      player.travel = null;
      PlayerStorage.save(player.username, player);
      panel.innerHTML = "";
    };
  }
}

/****************************************************
 * MAIN OVERWORLD LOOP
 ****************************************************/
function overworldLoop(player) {

  // 1. Travel just finished?
  if (player.travel && Date.now() >= player.travel.endsAt) {
    finishTravel(player);
    PlayerStorage.save(player.username, player);
    alert("You have arrived at your destination.");
  }

  // 2. Still traveling?
  if (isTraveling(player)) {
    const remaining = getTravelRemaining(player);
    renderTravelCountdown(remaining);
    return;
  }

  // 3. Normal overworld movement
  renderOverworld(player);
}

/****************************************************
 * RENDER OVERWORLD
 ****************************************************/
export function renderOverworld(player) {
  const canvas = document.getElementById("overworldCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const pos = getPlayerPosition(player);

  drawMap(ctx);
  drawPlayer(ctx, pos);
}

/****************************************************
 * MOVEMENT HANDLER
 ****************************************************/
document.addEventListener("keydown", e => {
  if (isTraveling(player)) return; // movement locked during travel

  const pos = getPlayerPosition(player);

  if (e.key === "ArrowUp") pos.y -= 4;
  if (e.key === "ArrowDown") pos.y += 4;
  if (e.key === "ArrowLeft") pos.x -= 4;
  if (e.key === "ArrowRight") pos.x += 4;

  setPlayerPosition(player, pos.x, pos.y);
  PlayerStorage.save(player.username, player);

  renderOverworld(player);

  checkForEncounters(player);
  checkForBuildingEntry(player);
});

/****************************************************
 * CONTINUOUS GAME LOOP
 ****************************************************/
function gameLoop() {
  overworldLoop(player);
  requestAnimationFrame(gameLoop);
}

gameLoop();

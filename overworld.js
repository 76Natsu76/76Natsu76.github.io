/****************************************************
 * OVERWORLD — travel + tiles + sprite + collision
 ****************************************************/

import { isTraveling, getTravelRemaining, finishTravel } from "./travel-lockout.js";
import { PlayerStorage } from "./player-storage.js";
import { TILE_SIZE, TILEMAP, COLLISION_TILES, getTileAtPixel } from "./world-map-data.js";
import { getPlayerPosition, setPlayerPosition } from "./player-position.js";
import { checkForEncounters } from "./encounter-check.js";
import { checkForBuildingEntry } from "./building-check.js";

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
      window.player.travel = null;
      PlayerStorage.save(window.player.username, window.player);
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

  // 3. Normal overworld rendering
  renderOverworld(player);
}

/****************************************************
 * RENDER OVERWORLD (tiles + player sprite)
 ****************************************************/
export function renderOverworld(player) {
  const canvas = document.getElementById("overworldCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const pos = getPlayerPosition(player);

  drawMap(ctx);
  drawPlayer(ctx, pos);
}

function drawMap(ctx) {
  for (let row = 0; row < TILEMAP.length; row++) {
    for (let col = 0; col < TILEMAP[row].length; col++) {
      const id = TILEMAP[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      // Simple color mapping
      let color = "#228B22"; // grass
      if (id === 1) color = "#1E90FF"; // water
      if (id === 2) color = "#696969"; // mountain
      if (id === 3) color = "#B8860B"; // town

      ctx.fillStyle = color;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = "#111";
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawPlayer(ctx, pos) {
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(pos.x + TILE_SIZE / 2, pos.y + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
  ctx.fill();
}

/****************************************************
 * COLLISION CHECK
 ****************************************************/
function canMoveTo(player, newX, newY) {
  const tile = getTileAtPixel(newX + TILE_SIZE / 2, newY + TILE_SIZE / 2);
  if (!tile) return false;
  if (COLLISION_TILES.has(tile.id)) return false;
  return true;
}

/****************************************************
 * MOVEMENT HANDLER
 ****************************************************/
document.addEventListener("keydown", e => {
  const player = window.player;
  if (!player) return;

  if (isTraveling(player)) return; // movement locked during travel

  const pos = getPlayerPosition(player);
  let newX = pos.x;
  let newY = pos.y;

  if (e.key === "ArrowUp") newY -= TILE_SIZE;
  if (e.key === "ArrowDown") newY += TILE_SIZE;
  if (e.key === "ArrowLeft") newX -= TILE_SIZE;
  if (e.key === "ArrowRight") newX += TILE_SIZE;

  // No movement key pressed
  if (newX === pos.x && newY === pos.y) return;

  // Collision check
  if (!canMoveTo(player, newX, newY)) return;

  setPlayerPosition(player, newX, newY);
  PlayerStorage.save(player.username, player);

  renderOverworld(player);
  checkForEncounters(player);
  checkForBuildingEntry(player);
});

/****************************************************
 * CONTINUOUS GAME LOOP
 ****************************************************/
function gameLoop() {
  const player = window.player;
  if (player) {
    overworldLoop(player);
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

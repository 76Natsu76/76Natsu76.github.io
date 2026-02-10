/************************************************************
 * OVERWORLD — smooth movement + animation + camera
 ************************************************************/

import { isTraveling, getTravelRemaining, finishTravel } from "./travel-lockout.js";
import { PlayerStorage } from "./player-storage.js";
import { TILE_SIZE, TILEMAP, COLLISION_TILES, getTileAtPixel } from "./world-map-data.js";
import { getPlayerPosition, setPlayerPosition } from "./player-position.js";
import { checkForOverworldEncounter } from "./overworld-encounter.js";
import { checkForBuildingEntry } from "./building-check.js";
import { PLAYER_SPRITE, loadPlayerSprite, updatePlayerSprite, drawPlayerSprite } from "./player-sprite.js";
import { CAMERA, updateCamera } from "./overworld-camera.js";

/************************************************************
 * INITIALIZATION
 ************************************************************/
loadPlayerSprite();

let lastTime = performance.now();

/************************************************************
 * MOVEMENT STATE
 ************************************************************/
const movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  speed: 2.5 // pixels per frame
};

document.addEventListener("keydown", e => {
  if (isTraveling(player)) return;

  if (e.key === "ArrowUp") movement.up = true;
  if (e.key === "ArrowDown") movement.down = true;
  if (e.key === "ArrowLeft") movement.left = true;
  if (e.key === "ArrowRight") movement.right = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowUp") movement.up = false;
  if (e.key === "ArrowDown") movement.down = false;
  if (e.key === "ArrowLeft") movement.left = false;
  if (e.key === "ArrowRight") movement.right = false;
});

/************************************************************
 * COLLISION CHECK
 ************************************************************/
function canMoveTo(x, y) {
  const tile = getTileAtPixel(x + TILE_SIZE / 2, y + TILE_SIZE / 2);
  if (!tile) return false;
  return !COLLISION_TILES.has(tile.id);
}

/************************************************************
 * MAIN LOOP
 ************************************************************/
function gameLoop(time) {
  const deltaTime = time - lastTime;
  lastTime = time;

  overworldLoop(player, deltaTime);
  requestAnimationFrame(gameLoop);
}

function overworldLoop(player, deltaTime) {
  // Travel completion
  if (player.travel && Date.now() >= player.travel.endsAt) {
    finishTravel(player);
    PlayerStorage.save(player.username, player);
    alert("You have arrived at your destination.");
  }

  // Travel lockout
  if (isTraveling(player)) {
    const remaining = getTravelRemaining(player);
    renderTravelCountdown(remaining);
    return;
  }

  updateMovement(player, deltaTime);
  renderOverworld(player, deltaTime);
}

/************************************************************
 * MOVEMENT + ANIMATION
 ************************************************************/
function updateMovement(player, deltaTime) {
  const pos = getPlayerPosition(player);
  let newX = pos.x;
  let newY = pos.y;

  PLAYER_SPRITE.moving = false;

  if (movement.up) {
    newY -= movement.speed;
    PLAYER_SPRITE.direction = "up";
    PLAYER_SPRITE.moving = true;
  }
  if (movement.down) {
    newY += movement.speed;
    PLAYER_SPRITE.direction = "down";
    PLAYER_SPRITE.moving = true;
  }
  if (movement.left) {
    newX -= movement.speed;
    PLAYER_SPRITE.direction = "left";
    PLAYER_SPRITE.moving = true;
  }
  if (movement.right) {
    newX += movement.speed;
    PLAYER_SPRITE.direction = "right";
    PLAYER_SPRITE.moving = true;
  }

  if (canMoveTo(newX, newY)) {
    setPlayerPosition(player, newX, newY);
    PlayerStorage.save(player.username, player);
  }

  updatePlayerSprite(deltaTime);
  updateCamera(pos.x, pos.y);

  if (PLAYER_SPRITE.moving) {
    checkForOverworldEncounter(player);
    checkForBuildingEntry(player);
  }
}

/************************************************************
 * RENDERING
 ************************************************************/
function renderOverworld(player, deltaTime) {
  const canvas = document.getElementById("overworldCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap(ctx);
  drawPlayer(ctx);
}

function drawMap(ctx) {
  for (let row = 0; row < TILEMAP.length; row++) {
    for (let col = 0; col < TILEMAP[row].length; col++) {
      const id = TILEMAP[row][col];
      const x = col * TILE_SIZE - CAMERA.x;
      const y = row * TILE_SIZE - CAMERA.y;

      let color = "#228B22";
      if (id === 1) color = "#1E90FF";
      if (id === 2) color = "#696969";
      if (id === 3) color = "#B8860B";

      ctx.fillStyle = color;
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawPlayer(ctx) {
  const pos = getPlayerPosition(player);
  const screenX = pos.x - CAMERA.x;
  const screenY = pos.y - CAMERA.y;

  drawPlayerSprite(ctx, screenX, screenY);
}

/************************************************************
 * START LOOP
 ************************************************************/
gameLoop(performance.now());

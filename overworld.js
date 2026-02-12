/************************************************************
 * OVERWORLD — Phase 4 Movement + Region Awareness + Encounters
 ************************************************************/

import { isTraveling, getTravelRemaining, finishTravel } from "./travel-lockout.js";
import { PlayerStorage } from "./player-storage.js";
import { TILE_SIZE, TILEMAP, COLLISION_TILES, getTileAtPixel, getRegionAtPixel } from "./world-map-data.js";
import { getPlayerPosition, setPlayerPosition } from "./player-position.js";
import { checkForOverworldEncounter } from "./overworld-encounter.js";
import { checkForBuildingEntry } from "./building-check.js";
import { PLAYER_SPRITE, loadPlayerSprite, updatePlayerSprite, drawPlayerSprite } from "./player-sprite.js";
import { CAMERA, updateCamera } from "./overworld-camera.js";
import { WORLD_DATA } from "./world-data.js";
import { getWorldState } from "./world-state.js";
import { WeatherEngine } from "./weather-engine.js";

/************************************************************
 * INITIALIZATION
 ************************************************************/
loadPlayerSprite();

let lastTime = performance.now();
let currentRegionKey = null;

/************************************************************
 * MOVEMENT STATE
 ************************************************************/
const movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  baseSpeed: 2.5
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
 * REGION-AWARE MOVEMENT SPEED
 ************************************************************/
function computeMovementSpeed(player, regionKey, regionState) {
  let speed = movement.baseSpeed;

  // Mount speed
  if (player.mount) {
    speed *= 1.25;
  }

  // Weather penalties
  const weatherKey = regionState.weather || WeatherEngine.rollWeather(regionKey);
  if (weatherKey === "storm") speed *= 0.85;
  if (weatherKey === "blizzard") speed *= 0.80;
  if (weatherKey === "fog") speed *= 0.90;
  if (weatherKey === "heatwave") speed *= 0.90;

  // Crisis penalties
  if (regionState.crisis) {
    speed *= 0.90;
  }

  // Seed meta bonuses
  const meta = player.seedMeta || {};
  if (meta.blessedClears > 0) speed *= 1.05;
  if (meta.cursedClears > 0) speed *= 0.95;

  return speed;
}

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
 * MOVEMENT + REGION TRANSITIONS + ENCOUNTERS
 ************************************************************/
function updateMovement(player, deltaTime) {
  const pos = getPlayerPosition(player);
  let newX = pos.x;
  let newY = pos.y;

  PLAYER_SPRITE.moving = false;

  // Determine region
  const regionKey = getRegionAtPixel(pos.x, pos.y);
  const worldState = getWorldState();
  const regionState = worldState.regions[regionKey] || {};
  const region = WORLD_DATA.regions[regionKey];

  // Movement speed (region-aware)
  const speed = computeMovementSpeed(player, regionKey, regionState);

  if (movement.up) {
    newY -= speed;
    PLAYER_SPRITE.direction = "up";
    PLAYER_SPRITE.moving = true;
  }
  if (movement.down) {
    newY += speed;
    PLAYER_SPRITE.direction = "down";
    PLAYER_SPRITE.moving = true;
  }
  if (movement.left) {
    newX -= speed;
    PLAYER_SPRITE.direction = "left";
    PLAYER_SPRITE.moving = true;
  }
  if (movement.right) {
    newX += speed;
    PLAYER_SPRITE.direction = "right";
    PLAYER_SPRITE.moving = true;
  }

  // Collision
  if (canMoveTo(newX, newY)) {
    setPlayerPosition(player, newX, newY);
    PlayerStorage.save(player.username, player);
  }

  // Region transition detection
  const newRegionKey = getRegionAtPixel(newX, newY);
  if (newRegionKey !== currentRegionKey) {
    currentRegionKey = newRegionKey;
    console.log(`Entered region: ${newRegionKey}`);
  }

  updatePlayerSprite(deltaTime);
  updateCamera(pos.x, pos.y);

  // Only check encounters when moving
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

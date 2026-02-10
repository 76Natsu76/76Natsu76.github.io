import { isTraveling, getTravelRemaining, finishTravel } from "./travel-lockout.js";
import { PlayerStorage } from "./player-storage.js";

function overworldLoop(player) {
  // Check if travel just finished
  if (player.travel && Date.now() >= player.travel.endsAt) {
    finishTravel(player);
    PlayerStorage.save(player.username, player);
    alert("You have arrived at your destination.");
  }

  // If still traveling, show countdown
  if (isTraveling(player)) {
    const remaining = getTravelRemaining(player);
    renderTravelCountdown(remaining);
    return;
  }

  // Normal overworld movement
  renderOverworld(player);
}

export function renderOverworld(player) {
  const canvas = document.getElementById("overworldCanvas");
  const ctx = canvas.getContext("2d");

  const pos = getPlayerPosition(player);

  drawMap(ctx);
  drawPlayer(ctx, pos);
}

if (!isTaveling(player)) {
  document.addEventListener("keydown", e => {
    const pos = getPlayerPosition(player);
  
    if (e.key === "ArrowUp") pos.y -= 4;
    if (e.key === "ArrowDown") pos.y += 4;
    if (e.key === "ArrowLeft") pos.x -= 4;
    if (e.key === "ArrowRight") pos.x += 4;
  
    setPlayerPosition(player, pos.x, pos.y);
    renderOverworld(player);
  
    checkForEncounters(player);
    checkForBuildingEntry(player);
  });
}

function gameLoop() {
  overworldLoop(player);
  requestAnimationFrame(gameLoop);
}

gameLoop();

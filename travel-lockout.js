// travel-lockout.js

export function isTraveling(player) {
  return player.travel && Date.now() < player.travel.endsAt;
}

export function getTravelRemaining(player) {
  if (!player.travel) return 0;
  return Math.max(0, player.travel.endsAt - Date.now());
}

export function startTravel(player, destination, travelTimeMs, mountSpeed = 1) {
  player.travel = {
    destination,
    endsAt: Date.now() + travelTimeMs,
    mountSpeed
  };
}

export function finishTravel(player) {
  if (!player.travel) return;

  // Snap player to destination
  player.position = player.travel.destination;

  // Clear travel state
  player.travel = null;
}


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
// maybe?

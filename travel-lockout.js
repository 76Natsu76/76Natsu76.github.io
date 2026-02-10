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

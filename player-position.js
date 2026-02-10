// player-position.js

export function getPlayerPosition(player) {
  if (!player.position) {
    player.position = { x: 0, y: 0 };
  }
  return player.position;
}

export function setPlayerPosition(player, x, y) {
  player.position = { x, y };
}

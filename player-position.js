export function getPlayerPosition(player) {
  return player.position || { x: 0, y: 0 };
}

export function setPlayerPosition(player, x, y) {
  player.position = { x, y };
}

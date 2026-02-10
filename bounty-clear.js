// bounty-clear.js
import { PlayerStorage } from "./player-storage.js";

export function clearBounty(player, settlementKey) {
  if (!player.bounty?.[settlementKey]) return false;

  const cost = player.bounty[settlementKey];

  if (player.gold < cost) return false;

  player.gold -= cost;
  player.bounty[settlementKey] = 0;

  PlayerStorage.save(player.username, player);
  return true;
}

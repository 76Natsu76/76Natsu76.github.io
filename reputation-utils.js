// reputation-utils.js
import { PlayerStorage } from "./player-storage.js";

export function adjustReputation(player, settlementKey, amount) {
  player.reputation = player.reputation || {};
  const current = player.reputation[settlementKey] || 0;
  player.reputation[settlementKey] = current + amount;
  PlayerStorage.save(player.username, player);
}

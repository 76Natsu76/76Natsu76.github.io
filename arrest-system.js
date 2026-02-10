// arrest-system.js
import { PlayerStorage } from "./player-storage.js";

export function arrestPlayer(player, settlementKey) {
  player.hpCurrent = 1;
  player.manaCurrent = 0;

  player.bounty[settlementKey] = 0;

  player.jailedUntil = Date.now() + 5 * 60 * 1000; // 5 minutes

  PlayerStorage.save(player.username, player);

  return {
    ok: true,
    message: "You have been arrested and jailed for your crimes."
  };
}

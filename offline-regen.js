// offline-regen.js

import { getRegenRates } from "./regen.js";
import { PlayerStorage } from "./player-storage.js";

export function applyOfflineRegen(player) {
  const now = Date.now();
  const last = player.lastRegenTick || player.lastSeen || now;

  const diffMs = now - last;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes <= 0) {
    player.lastRegenTick = now;
    return player;
  }

  const { hpPerMinute, mpPerMinute } = getRegenRates(player);

  let remaining = diffMinutes;

  // First hour = fast regen (2×)
  const firstHour = Math.min(60, remaining);
  if (firstHour > 0) {
    player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + hpPerMinute * 2 * firstHour);
    player.mana = Math.min(player.manaMax, player.mana + mpPerMinute * 2 * firstHour);
    remaining -= firstHour;
  }

  // After first hour = slow regen (0.5×)
  if (remaining > 0) {
    player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + hpPerMinute * 0.5 * remaining);
    player.mana = Math.min(player.manaMax, player.mana + mpPerMinute * 0.5 * remaining);
  }

  player.lastRegenTick = now;
  return player;
}

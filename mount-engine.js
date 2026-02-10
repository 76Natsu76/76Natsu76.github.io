/************************************************************
 * mount-engine.js
 * Canonical mount engine
 ************************************************************/

import { MOUNTS } from "./mounts.js";
import { PlayerStorage } from "./player-storage.js";

export const MountEngine = {
  getMount(key) {
    return MOUNTS[key] || null;
  },

  getAllMounts() {
    return MOUNTS;
  },

  getPlayerMounts(player) {
    return player.mounts || [];
  },

  giveMount(player, mountKey) {
    if (!MOUNTS[mountKey]) {
      return { ok: false, reason: "Unknown mount." };
    }

    player.mounts = player.mounts || [];
    if (!player.mounts.includes(mountKey)) {
      player.mounts.push(mountKey);
    }

    PlayerStorage.save(player.username, player);
    return { ok: true };
  },

  equipMount(player, mountKey) {
    if (!player.mounts?.includes(mountKey)) {
      return { ok: false, reason: "You do not own this mount." };
    }

    const mount = MOUNTS[mountKey];
    if (!mount) {
      return { ok: false, reason: "Unknown mount." };
    }

    // Canonical fields
    player.activeMount = mountKey;
    player.mount = mount; // used by travel-time.js (mount.speed)

    PlayerStorage.save(player.username, player);
    return { ok: true, reason: "Mount equipped." };
  },

  unequipMount(player) {
    player.activeMount = null;
    player.mount = null;
    PlayerStorage.save(player.username, player);
  },

  getActiveMount(player) {
    if (!player.activeMount) return null;
    return MOUNTS[player.activeMount] || null;
  },

  applyTravelBonuses(player) {
    const mount = this.getActiveMount(player);
    if (!mount) return;

    player.travelSpeed = (player.travelSpeed || 100) + (mount.speedBonus || 0);
    player.travelCostReduction =
      (player.travelCostReduction || 0) + (mount.travelCostReduction || 0);
  }
};

/************************************************************
 * mount-engine.js
 ************************************************************/

import { MOUNTS } from "./mounts.json";

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
    if (!MOUNTS[mountKey]) return false;

    player.mounts = player.mounts || [];
    if (!player.mounts.includes(mountKey)) {
      player.mounts.push(mountKey);
    }
    return true;
  },

  equipMount(player, mountKey) {
    if (!player.mounts?.includes(mountKey)) {
      return { ok: false, reason: "You do not own this mount." };
    }
    player.activeMount = mountKey;
    return { ok: true, reason: "Mount equipped." };
  },

  unequipMount(player) {
    player.activeMount = null;
  },

  getActiveMount(player) {
    if (!player.activeMount) return null;
    return MOUNTS[player.activeMount] || null;
  },

  applyTravelBonuses(player) {
    const mount = this.getActiveMount(player);
    if (!mount) return;

    player.travelSpeed = (player.travelSpeed || 100) + (mount.speedBonus || 0);
    player.travelCostReduction = (player.travelCostReduction || 0) + (mount.travelCostReduction || 0);
  }
};

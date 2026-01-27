/************************************************************
 * world-boss-announcements.js
 ************************************************************/

import { WORLD_BOSSES } from "./world-boss-templates.json";

export const WorldBossAnnouncements = {
  lastState: {},

  checkForAnnouncements(newState) {
    for (const regionKey in newState) {
      const region = newState[regionKey];
      const prev = this.lastState[regionKey];

      // Boss spawned
      if ((!prev?.worldBoss || !prev.worldBoss.active) &&
          region.worldBoss?.active) {
        const bossKey = region.worldBoss.key;
        const boss = WORLD_BOSSES[bossKey];
        this.announceSpawn(regionKey, boss);
      }

      // Boss despawned
      if (prev?.worldBoss?.active && !region.worldBoss) {
        this.announceDespawn(regionKey);
      }

      // Boss killed
      if (prev?.worldBoss?.active &&
          region.worldBoss?.hp === 0) {
        const bossKey = prev.worldBoss.key;
        const boss = WORLD_BOSSES[bossKey];
        this.announceDeath(regionKey, boss);
      }
    }

    this.lastState = JSON.parse(JSON.stringify(newState));
  },

  announceSpawn(regionKey, boss) {
    console.log(
      `%cWORLD BOSS SPAWNED: ${boss.name} in ${regionKey}!`,
      "color:#ff4444;font-weight:bold;"
    );
  },

  announceDespawn(regionKey) {
    console.log(
      `%cWorld boss in ${regionKey} has vanished.`,
      "color:#888;"
    );
  },

  announceDeath(regionKey, boss) {
    console.log(
      `%cWORLD BOSS DEFEATED: ${boss.name} in ${regionKey}!`,
      "color:#ffd86b;font-weight:bold;"
    );
  }
};

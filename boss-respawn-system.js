// boss-respawn-system.js
// Handles world boss respawn timers, awakening scheduling, and announcements.

import { WORLD_BOSSES } from "./boss-definitions.js";
import { getWorldState, addRegionHistory } from "./world-state.js";

export const BossRespawnSystem = {
  tick,
  scheduleRespawn,
  forceSpawnNow
};

// ------------------------------------------------------------
// MAIN TICK — called from GlobalSim.tick()
// ------------------------------------------------------------
function tick() {
  const world = getWorldState();
  const now = Date.now();

  for (const regionKey in world.regions) {
    const region = world.regions[regionKey];

    // If a boss is already active, nothing to do
    if (region.worldBossActive) continue;

    // If a boss is awakening soon, check timer
    if (region.worldBossAwakening && now >= region.worldBossAwakening) {
      region.worldBossActive = true;
      region.worldBossAwakening = null;

      const boss = findBossForRegion(regionKey);
      if (boss) {
        addRegionHistory(
          regionKey,
          "boss_awakened",
          `${boss.name} has awakened in this region!`
        );
      }
      continue;
    }

    // If no awakening timer, no active boss → schedule next spawn
    if (!region.worldBossAwakening) {
      scheduleRespawn(regionKey);
    }
  }
}

// ------------------------------------------------------------
// SCHEDULE RESPAWN
// ------------------------------------------------------------
function scheduleRespawn(regionKey) {
  const world = getWorldState();
  const region = world.regions[regionKey];
  if (!region) return;

  const boss = findBossForRegion(regionKey);
  if (!boss) return;

  // Use the boss's awakening delay
  const delay = boss.awakeningDelayMs || 60 * 60 * 1000;

  region.worldBossAwakening = Date.now() + delay;

  addRegionHistory(
    regionKey,
    "boss_respawn_scheduled",
    `${boss.name} will reawaken in this region.`
  );
}

// ------------------------------------------------------------
// FORCE SPAWN (admin/debug)
// ------------------------------------------------------------
function forceSpawnNow(regionKey) {
  const world = getWorldState();
  const region = world.regions[regionKey];
  if (!region) return;

  region.worldBossActive = true;
  region.worldBossAwakening = null;

  const boss = findBossForRegion(regionKey);
  if (boss) {
    addRegionHistory(
      regionKey,
      "boss_forced_spawn",
      `${boss.name} has been forcibly awakened!`
    );
  }
}

// ------------------------------------------------------------
// FIND BOSS FOR REGION
// ------------------------------------------------------------
function findBossForRegion(regionKey) {
  for (const key in WORLD_BOSSES) {
    const boss = WORLD_BOSSES[key];
    if (boss.region === regionKey) return boss;
  }
  return null;
}

// world-boss-progression.js

import { WORLD_BOSSES } from "./world-boss-templates.js";
import { REGION_UNLOCKS } from "./region-unlock.js";

export function updateWorldBosses(worldState) {
  const now = Date.now();

  for (const bossKey in WORLD_BOSSES) {
    const bossDef = WORLD_BOSSES[bossKey];
    const region = bossDef.spawnRules.region;

    // Ensure boss entry exists
    if (!worldState.bosses[bossKey]) {
      worldState.bosses[bossKey] = {
        active: false,
        hp: bossDef.maxHP,
        maxHP: bossDef.maxHP,
        region,
        respawnAt: 0
      };
    }

    const boss = worldState.bosses[bossKey];

    // If boss is active, nothing to do here
    if (boss.active) continue;

    // If boss is inactive but respawn timer not reached, skip
    if (boss.respawnAt > now) continue;

    // Try spawning boss
    if (Math.random() < (bossDef.spawnRules.chance || 0)) {
      boss.active = true;
      boss.hp = boss.maxHP;
      boss.respawnAt = 0;
    }
  }

  export function handleBossDefeat(worldState, bossKey) {
    const boss = worldState.bosses[bossKey];
    const bossDef = WORLD_BOSSES[bossKey];
  
    if (!boss || !boss.active) return worldState;
  
    // Mark boss defeated
    boss.active = false;
    boss.hp = 0;
  
    // Set respawn timer
    const hours = bossDef.spawnRules.respawnHours || 24;
    boss.respawnAt = Date.now() + hours * 60 * 60 * 1000;
  
    // Unlock region
    const region = bossDef.spawnRules.region;
    worldState.regionUnlocks[region] = true;
  
    return worldState;
  }


  return worldState;
}

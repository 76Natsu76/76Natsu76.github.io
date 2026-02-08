// boss-encounter-generator.js
// Handles world boss encounters, overriding normal encounters when active.

import { WORLD_BOSSES } from "./boss-definitions.js";
import { getWorldState, addRegionHistory } from "./world-state.js";
import { BOSS_LOOT_TABLES } from "./boss-loot-tables.js";
import { EnemyRegistry } from "./enemy-registry.js";

// ------------------------------------------------------------
// MAIN ENTRY POINT
// ------------------------------------------------------------
export function generateBossEncounter(regionKey) {
  const world = getWorldState();
  const regionState = world.regions[regionKey];

  if (!regionState) {
    throw new Error(`Unknown region: ${regionKey}`);
  }

  // No boss active → no boss encounter
  if (!regionState.worldBossActive) {
    return null;
  }

  // Identify which boss is assigned to this region
  const boss = findBossForRegion(regionKey);
  if (!boss) {
    console.warn(`No boss definition found for region: ${regionKey}`);
    return null;
  }

  // Build the boss enemy instance
  const enemy = buildBossInstance(boss);

  // Build encounter object
  const encounter = {
    isBossEncounter: true,
    bossKey: boss.key,
    bossName: boss.name,
    region: regionKey,
    enemies: [enemy],
    phase: 0,
    phases: boss.phases,
    enrage: boss.enrage,
    lootTable: boss.lootTable,
    flavor: boss.flavor,
    debug: {
      regionKey,
      bossKey: boss.key,
      bossLevel: boss.level,
      element: boss.element,
      phases: boss.phases.length
    }
  };

  // Log history
  addRegionHistory(
    regionKey,
    "boss_encounter",
    `${boss.name} has been challenged!`
  );

  return encounter;
}

// ------------------------------------------------------------
// FIND BOSS FOR REGION
// ------------------------------------------------------------
function findBossForRegion(regionKey) {
  for (const key in WORLD_BOSSES) {
    const boss = WORLD_BOSSES[key];
    if (boss.region === regionKey) {
      return boss;
    }
  }
  return null;
}

// ------------------------------------------------------------
// BUILD BOSS INSTANCE
// ------------------------------------------------------------
function buildBossInstance(boss) {
  // Pull base stats from enemy registry if available
  const template = EnemyRegistry.enemies[boss.key];

  if (!template) {
    console.warn(`Boss template missing for ${boss.key}, using fallback stats.`);
  }

  const baseHP = template?.baseHP ?? 5000;
  const baseATK = template?.baseATK ?? 500;
  const baseDEF = template?.baseDEF ?? 400;

  return {
    key: boss.key,
    name: boss.name,
    family: template?.family || "boss",
    element: boss.element,
    rarity: "boss",
    tier: template?.tier ?? 10,
    level: boss.level,

    hp: baseHP,
    hpMax: baseHP,
    atk: baseATK,
    def: baseDEF,

    portrait: template?.portrait || `/assets/bosses/${boss.key}.png`,
    flavor: boss.flavor,
    modifiers: []
  };
}

// ------------------------------------------------------------
// BOSS LOOT RESOLUTION
// ------------------------------------------------------------
export function rollBossLoot(bossKey) {
  const table = BOSS_LOOT_TABLES[bossKey];
  if (!table) return [];

  const drops = [];

  // Guaranteed
  for (const item of table.guaranteed || []) {
    drops.push(item);
  }

  // Rare
  for (const entry of table.rare || []) {
    if (Math.random() < entry.chance) {
      drops.push(entry.item);
    }
  }

  // Ultra Rare
  for (const entry of table.ultraRare || []) {
    if (Math.random() < entry.chance) {
      drops.push(entry.item);
    }
  }

  // Mythic
  for (const entry of table.mythic || []) {
    if (Math.random() < entry.chance) {
      drops.push(entry.item);
    }
  }

  return drops;
}

// ------------------------------------------------------------
// BOSS DEFEAT HANDLER
// ------------------------------------------------------------
export function handleBossDefeat(regionKey, bossKey) {
  const world = getWorldState();
  const regionState = world.regions[regionKey];

  if (!regionState) return;

  regionState.worldBossActive = false;
  regionState.worldBossAwakening = null;

  addRegionHistory(
    regionKey,
    "boss_defeated",
    `${WORLD_BOSSES[bossKey].name} has been defeated!`
  );

  // Respawn timer handled by global simulation or a separate respawn system
}

/************************************************************
 * dungeon-encounters.js — Multi‑Wave Dungeon Encounter Generator
 ************************************************************/

import { DUNGEONS, getGreatDungeonLevelRange } from "./dungeons.js";
import { resolveEnemy } from "./resolveEnemy.js";
import { DungeonEngine } from "./dungeon-engine.js";

/**
 * Generate a multi‑wave encounter for a dungeon room.
 * This is used for:
 *  - normal dungeon combat rooms
 *  - labyrinth combat rooms
 *  - great dungeon floors
 *  - endless dungeon floors
 */
export function generateDungeonEncounter(run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const floor = run.currentFloor;

  // Determine wave count
  const waves = getWaveCount(dungeon, floor);

  const waveList = [];
  for (let i = 0; i < waves; i++) {
    const waveEnemies = generateWaveEnemies(run, i);
    waveList.push({
      waveIndex: i,
      enemies: waveEnemies
    });
  }

  return {
    type: "multiwave",
    waves: waveList,
    totalWaves: waves
  };
}

/************************************************************
 * WAVE COUNT LOGIC
 ************************************************************/
function getWaveCount(dungeon, floor) {
  if (dungeon.type === "endless") {
    // Endless: 2 waves normally, 3 waves on boss floors
    if (floor % dungeon.megaBossEvery === 0) return 4;
    if (floor % dungeon.bossEvery === 0) return 3;
    return 2;
  }

  if (dungeon.type === "great_dungeon") {
    // Great Dungeon: 2 waves normally, 3 waves on boss floors
    if (floor % dungeon.bossEvery === 0) return 3;
    return 2;
  }

  // Normal / labyrinth: always 2 waves
  return 2;
}

/************************************************************
 * WAVE ENEMY GENERATION
 ************************************************************/
function generateWaveEnemies(run, waveIndex) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const floor = run.currentFloor;

  // Determine enemy source
  let enemyKeys = [];

  if (dungeon.type === "endless") {
    enemyKeys = dungeon.baseEncounterTable;
  } else if (dungeon.type === "great_dungeon") {
    // Great Dungeon uses level scaling
    const { min, max } = getGreatDungeonLevelRange(floor);
    enemyKeys = pickEnemiesByLevelRange(min, max);
  } else {
    // Normal / labyrinth
    const floorConfig = dungeon.floorsConfig?.[floor];
    enemyKeys = floorConfig?.encounterTable || [];
  }

  // Convert enemy keys → resolved enemy objects
  const enemies = [];
  for (const key of enemyKeys) {
    const enemy = resolveEnemy(key, dungeon.regionKey || dungeon.region || "dungeon", 1);

    // Apply dungeon scaling
    if (dungeon.type === "endless") {
      DungeonEngine.applyEndlessScaling(enemy, run);
    } else if (run.enemyScaling && run.enemyScaling !== 1.0) {
      DungeonEngine.applyScaling(enemy, run.enemyScaling);
    }

    // Apply wave scaling (each wave gets stronger)
    const waveMult = 1 + waveIndex * 0.15;
    enemy.hp = Math.floor(enemy.hp * waveMult);
    enemy.hpMax = Math.floor(enemy.hpMax * waveMult);
    enemy.atk = Math.floor(enemy.atk * waveMult);

    enemy.isDungeonEnemy = true;
    enemy.waveIndex = waveIndex;

    enemies.push(enemy);
  }

  return enemies;
}

/************************************************************
 * GREAT DUNGEON ENEMY PICKER
 ************************************************************/
function pickEnemiesByLevelRange(minLevel, maxLevel) {
  // Placeholder: you will plug in your tier/level enemy registry
  // For now, return generic enemies based on level band
  if (maxLevel <= 20) return ["slime", "goblin_scout"];
  if (maxLevel <= 50) return ["orc_raider", "shadow_wolf"];
  if (maxLevel <= 100) return ["voidling", "abyss_shade"];
  if (maxLevel <= 300) return ["astral_chimera", "rift_beast"];
  if (maxLevel <= 600) return ["mana_crest_riftlord", "nullborn_ravager"];
  if (maxLevel <= 1000) return ["depth_crowned_cataclysm", "abyssal_warden"];

  return ["slime"];
}

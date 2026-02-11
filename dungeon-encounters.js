// dungeon-encounters.js
// Multi-wave dungeon encounters for dungeon runs

import { DUNGEONS } from "./dungeons.js";
import { DungeonEngine } from "./dungeon-engine.js";

/**
 * Generate a multi-wave encounter for the current dungeon floor.
 *
 * options:
 *  - waves: number of waves (default 3)
 *  - statStep: per-wave stat multiplier step (e.g. 0.15 => +15% per wave)
 */
export function generateDungeonEncounter(run, options = {}) {
  const dungeon = DUNGEONS[run.dungeonKey];
  if (!dungeon) {
    throw new Error(`Unknown dungeon key: ${run.dungeonKey}`);
  }

  const waves = Math.max(1, options.waves ?? 3);
  const statStep = options.statStep ?? 0.15;

  // Base enemy descriptor for this floor
  let enemiesDescriptor = null;

  if (dungeon.type === "endless") {
    enemiesDescriptor = dungeon.baseEncounterTable;
  } else {
    const floor = DungeonEngine.getCurrentFloor(run);
    enemiesDescriptor = floor?.encounterTable || [];
  }

  const resultWaves = [];

  for (let i = 0; i < waves; i++) {
    const baseEnemies = DungeonEngine.buildEncounterEnemies(run, enemiesDescriptor);
    const scaledEnemies = applyWaveScaling(baseEnemies, i, statStep);

    resultWaves.push({
      waveIndex: i,
      waveNumber: i + 1,
      enemies: scaledEnemies,
      statMult: 1 + statStep * i
    });
  }

  return {
    waves: resultWaves,
    totalWaves: waves
  };
}

/**
 * Scale enemies for a given wave.
 */
function applyWaveScaling(enemies, waveIndex, statStep) {
  const statMult = 1 + statStep * waveIndex;

  return enemies.map(e => {
    const hpMaxBase = e.hpMax ?? e.hp ?? 1;
    const hpMax = Math.round(hpMaxBase * statMult);
    const hp = Math.min(hpMax, Math.round((e.hp ?? hpMaxBase) * statMult));
    const atk = typeof e.atk === "number" ? Math.round(e.atk * statMult) : e.atk;
    const def = typeof e.def === "number" ? Math.round(e.def * statMult) : e.def;

    return {
      ...e,
      hp,
      hpMax,
      atk,
      def,
      dungeonScaling: {
        waveIndex,
        statMult
      }
    };
  });
}

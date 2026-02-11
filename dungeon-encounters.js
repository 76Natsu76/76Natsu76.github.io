// dungeon-encounters.js
// Dungeon-style chained encounters (multi-wave runs)

import { EncounterEngine } from "./encounters.js";
import { rollEncounterAffixes, applyAffixesToEncounter } from "./encounter-affixes.js";

const DUNGEON_SESSION_KEY = "currentDungeonRun";

export const DungeonEncounters = {
  startRun,
  getCurrentRun,
  advanceWave,
  clearRun
};

/**
 * Start a new dungeon run.
 *
 * options:
 *  - waves: number of waves (default 3)
 *  - statStep: per-wave stat multiplier step (e.g. 0.15 => +15% per wave)
 *  - rewardStep: per-wave reward multiplier step (e.g. 0.25 => +25% per wave)
 *  - enemyOverride: optional enemy key to force for all waves
 */
function startRun(regionKey, subregionKey, username, options = {}) {
  const waves = Math.max(1, options.waves ?? 3);
  const statStep = options.statStep ?? 0.15;
  const rewardStep = options.rewardStep ?? 0.25;
  const enemyOverride = options.enemyOverride || null;

  const dungeonId = buildDungeonId(regionKey, subregionKey);

  const waveData = [];
  for (let i = 0; i < waves; i++) {
    const baseEncounter = EncounterEngine.generate(
      regionKey,
      subregionKey,
      username,
      enemyOverride
    );

    const scaledEncounter = applyWaveScaling(baseEncounter, i, {
      statStep,
      rewardStep,
      dungeonId,
      totalWaves: waves
    });

    waveData.push(scaledEncounter);
  }

  const run = {
    id: dungeonId,
    region: regionKey,
    subregion: subregionKey,
    waves: waveData,
    currentWaveIndex: 0,
    totalWaves: waves,
    isComplete: false
  };

  sessionStorage.setItem(DUNGEON_SESSION_KEY, JSON.stringify(run));
  return run;
}

function getCurrentRun() {
  const raw = sessionStorage.getItem(DUNGEON_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Advance to the next wave.
 * Returns updated run, or null if no run / already complete.
 */
function advanceWave() {
  const raw = sessionStorage.getItem(DUNGEON_SESSION_KEY);
  if (!raw) return null;

  const run = JSON.parse(raw);
  if (run.isComplete) return run;

  run.currentWaveIndex += 1;
  if (run.currentWaveIndex >= run.totalWaves) {
    run.currentWaveIndex = run.totalWaves - 1;
    run.isComplete = true;
  }

  sessionStorage.setItem(DUNGEON_SESSION_KEY, JSON.stringify(run));
  return run;
}

function clearRun() {
  sessionStorage.removeItem(DUNGEON_SESSION_KEY);
}

/**
 * Apply per-wave scaling + metadata.
 */
function applyWaveScaling(encounter, waveIndex, cfg) {
  const { statStep, rewardStep, dungeonId, totalWaves } = cfg;

  // Roll 0–1 affixes per wave, increasing chance each wave
  const affixCount = Math.random() < waveIndex * 0.2 ? 1 : 0;
  const affixes = rollEncounterAffixes(affixCount);

  applyAffixesToEncounter(encounter, affixes);

  const waveNumber = waveIndex + 1;
  const statMult = 1 + statStep * waveIndex;
  const rewardMult = 1 + rewardStep * waveIndex;

  const enemies = encounter.enemies.map(e => {
    const hpMax = Math.round(e.hpMax * statMult);
    const hp = Math.min(hpMax, Math.round(e.hp * statMult));
    const atk = Math.round(e.atk * statMult);
    const def = Math.round(e.def * statMult);

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

  return {
    ...encounter,
    enemies,
    dungeon: {
      id: dungeonId,
      waveIndex,
      waveNumber,
      totalWaves,
      statMult,
      rewardMult
    },
    debug: {
      ...(encounter.debug || {}),
      dungeonWave: waveNumber,
      dungeonTotalWaves: totalWaves,
      dungeonStatMult: statMult,
      dungeonRewardMult: rewardMult
    }
  };
}

function buildDungeonId(regionKey, subregionKey) {
  const ts = Date.now().toString(36);
  return `dng_${regionKey}_${subregionKey}_${ts}`;
}

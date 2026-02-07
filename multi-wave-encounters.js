// multi-wave-encounters.js

import { EncounterEngine } from "./encounters.js";

export function generateMultiWaveEncounter(regionKey, subregionKey, username, options = {}) {
  const {
    waves = 3,
    difficultyRamp = 0.15 // +15% stats per wave
  } = options;

  const waveData = [];

  for (let i = 0; i < waves; i++) {
    const encounter = EncounterEngine.generate(regionKey, subregionKey, username);

    // Apply difficulty ramp
    if (i > 0) {
      for (const enemy of encounter.enemies) {
        enemy.hpMax = Math.floor(enemy.hpMax * (1 + difficultyRamp * i));
        enemy.hp = enemy.hpMax;
        enemy.atk = Math.floor(enemy.atk * (1 + difficultyRamp * i));
        enemy.def = Math.floor(enemy.def * (1 + difficultyRamp * i));
      }
    }

    waveData.push(encounter);
  }

  return {
    type: "multi-wave",
    region: regionKey,
    subregion: subregionKey,
    waves: waveData.length,
    encounters: waveData
  };
}

// dynamic-scaling.js

export function applyDynamicScaling(encounter, playerLevel, options = {}) {
  const {
    regionDanger = 1.0,
    crisisIntensity = 1.0,
    scalingFactor = 0.05 // 5% per level difference
  } = options;

  for (const enemy of encounter.enemies) {
    const levelDiff = playerLevel - enemy.level;

    if (levelDiff > 0) {
      const scale = 1 + levelDiff * scalingFactor;
      enemy.hpMax = Math.floor(enemy.hpMax * scale * regionDanger * crisisIntensity);
      enemy.hp = enemy.hpMax;
      enemy.atk = Math.floor(enemy.atk * scale * regionDanger * crisisIntensity);
      enemy.def = Math.floor(enemy.def * scale * regionDanger * crisisIntensity);
    }
  }

  encounter.scaling = {
    playerLevel,
    regionDanger,
    crisisIntensity
  };

  return encounter;
}

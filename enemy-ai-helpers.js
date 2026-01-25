// enemy-ai-helpers.js

export function getUsableAbilities(enemy) {
  return (enemy.abilities || []).filter(a => !enemy.cooldowns[a.key]);
}

export function estimateAbilityDamage(enemy, player, ability) {
  const power = ability.power || 0;
  return Math.floor(power + enemy.atk);
}

export function highestDamageAbility(enemy, player, abilities) {
  let best = null, bestDmg = 0;
  for (const a of abilities) {
    const dmg = estimateAbilityDamage(enemy, player, a);
    if (dmg > bestDmg) {
      bestDmg = dmg;
      best = a;
    }
  }
  return best;
}

export function resolveBossCombo(enemy, player, abilities) {
  return null;
}

export function getAdaptiveCounter(enemy, player, abilities) {
  return null;
}

export function getBossPatterns(enemy) {
  return {
    phase1: [],
    phase2: [],
    phase3: [],
    phase4: []
  };
}

export function resolvePatternStep(step, enemy, player, abilities) {
  return null;
}

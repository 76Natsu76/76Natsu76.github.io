// regen.js
export function getRegenRates(player) {
  const lvl = player.level || 1;

  const baseHp = 0.1 * lvl;
  const baseMp = 0.3 * lvl;

  let hpMult = 1.0;
  let mpMult = 1.0;

  if (player.profession === "spirit_mage") {
    hpMult = 0.8;
    mpMult = 1.0;
  }

  if (player.profession === "berserker" && player.family === "orc") {
    hpMult = 1.5;
    mpMult = 0.1;
  }

  return {
    hpPerMinute: baseHp * hpMult,
    mpPerMinute: baseMp * mpMult
  };
}

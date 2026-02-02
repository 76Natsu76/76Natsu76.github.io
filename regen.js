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

export function applyRegen(player) {
  if (!player) return player;

  const now = Date.now();
  const last = player.lastRegenTick || now;

  const minutes = (now - last) / 60000;
  if (minutes <= 0) return player;

  const hpPerMin = player.hpRegenRate ?? 6;
  const mpPerMin = player.mpRegenRate ?? 0.5;

  const hpGain = Math.floor(minutes * hpPerMin);
  const mpGain = Math.floor(minutes * mpPerMin);

  player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + hpGain);
  player.manaCurrent = Math.min(player.manaMax, (player.manaCurrent ?? player.mana ?? 0) + mpGain);
  player.mana = player.manaCurrent;

  player.lastRegenTick = now;

  return player;
}

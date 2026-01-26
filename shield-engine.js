/************************************************************
 * shield-engine.js
 * ----------------------------------------------------------
 * Handles shield application and consumption.
 *
 * Assumes:
 * - target.shieldCurrent (number) optional
 ************************************************************/

export function applyShield(target, effect, logs) {
  const value = effect.value ?? effect.power ?? 0;
  if (!value) return;

  if (effect.stack === 'replace') {
    target.shieldCurrent = value;
  } else {
    target.shieldCurrent = (target.shieldCurrent || 0) + value;
  }

  logs?.push(`${target.name} gains a shield of ${value}.`);
}

export function absorbDamageWithShield(target, incomingDamage, logs) {
  let remaining = incomingDamage;
  let absorbed = 0;

  if (target.shieldCurrent && target.shieldCurrent > 0) {
    const used = Math.min(target.shieldCurrent, remaining);
    target.shieldCurrent -= used;
    remaining -= used;
    absorbed = used;
  }

  if (absorbed > 0) {
    logs?.push(`${target.name}'s shield absorbs ${absorbed} damage.`);
  }

  return remaining;
}

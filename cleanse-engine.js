/************************************************************
 * cleanse-engine.js
 * ----------------------------------------------------------
 * Removes status effects based on a list of types.
 *
 * Assumes:
 * - target.statuses: [] of { type, ... }
 ************************************************************/

export function cleanseEffects(target, effect, logs) {
  if (!effect || !Array.isArray(effect.remove)) return;
  if (!target.statuses || target.statuses.length === 0) return;

  const before = target.statuses.length;
  target.statuses = target.statuses.filter(
    s => !effect.remove.includes(s.type)
  );
  const removed = before - target.statuses.length;

  if (removed > 0) {
    logs?.push(`${target.name} is cleansed of ${removed} harmful effect(s).`);
  }
}

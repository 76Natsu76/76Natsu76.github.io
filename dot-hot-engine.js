/************************************************************
 * dot-hot-engine.js
 * ----------------------------------------------------------
 * Thin helpers for scheduling DOT/HOT effects.
 * In practice, most DOT/HOT is handled via status-engine.
 ************************************************************/

import { applyStatusEffect } from './status-engine.js';

export function scheduleDOT(target, effect, source, logs) {
  // Expect effect like { type: 'burn', value, duration, stack }
  applyStatusEffect(target, effect, source, logs);
}

export function scheduleHOT(target, effect, source, logs) {
  // Expect effect like { type: 'hot_percent' or 'heal_over_time', value, duration }
  applyStatusEffect(target, effect, source, logs);
}

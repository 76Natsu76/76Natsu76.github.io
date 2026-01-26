/************************************************************
 * status-engine.js
 * ----------------------------------------------------------
 * Central place to apply status effects defined in:
 * - ability-definitions.json
 * - subrace-ability-definitions.json
 *
 * Assumes each combatant has:
 * - statuses: [] (array of active effects)
 ************************************************************/

export function applyStatusEffect(target, effect, source, logs) {
  if (!effect || !effect.type) return;

  if (!target.statuses) target.statuses = [];

  const existing = findStackTarget(target, effect);

  const entry = {
    type: effect.type,
    duration: effect.duration ?? 0,
    value: effect.value ?? effect.power ?? 0,
    valuePerTurn: effect.valuePerTurn ?? 0,
    stack: effect.stack || 'add',
    sourceId: source?.id || null
  };

  if (existing && effect.stack === 'replace') {
    Object.assign(existing, entry);
  } else if (existing && effect.stack === 'add') {
    existing.value += entry.value;
    existing.valuePerTurn += entry.valuePerTurn;
    existing.duration = Math.max(existing.duration, entry.duration);
  } else {
    target.statuses.push(entry);
  }

  if (logs) {
    logs.push(buildStatusLog(target, effect));
  }
}

function findStackTarget(target, effect) {
  if (!target.statuses) return null;
  return target.statuses.find(s => s.type === effect.type);
}

function buildStatusLog(target, effect) {
  switch (effect.type) {
    case 'burn':
    case 'poison':
    case 'bleed':
      return `${target.name} is afflicted with ${effect.type}.`;
    case 'shield':
      return `${target.name} gains a protective shield.`;
    case 'heal_flat':
    case 'hot_percent':
      return `${target.name} is affected by a healing effect.`;
    case 'cleanse':
      return `${target.name}'s harmful effects are cleansed.`;
    default:
      return `${target.name} is affected by ${effect.type}.`;
  }
}

/************************************************************
 * Per-turn status processing (optional hook)
 ************************************************************/
export function processStatusesAtTurnStart(target, logs) {
  if (!target.statuses || target.statuses.length === 0) return;

  const remaining = [];

  for (const s of target.statuses) {
    if (isDOT(s.type)) {
      const dmg = Math.max(1, Math.floor(s.value || s.valuePerTurn || 0));
      target.hpCurrent = Math.max(0, target.hpCurrent - dmg);
      logs?.push(`${target.name} suffers ${dmg} damage from ${s.type}.`);
    }

    if (isHOT(s.type)) {
      const heal = Math.max(1, Math.floor(s.value || s.valuePerTurn || 0));
      target.hpCurrent = Math.min(target.hpMax, target.hpCurrent + heal);
      logs?.push(`${target.name} recovers ${heal} health from ${s.type}.`);
    }

    s.duration = Math.max(0, (s.duration ?? 0) - 1);
    if (s.duration > 0) remaining.push(s);
  }

  target.statuses = remaining;
}

function isDOT(type) {
  return ['burn', 'poison', 'bleed', 'acid', 'curse'].includes(type);
}

function isHOT(type) {
  return ['hot_percent', 'heal_over_time'].includes(type);
}

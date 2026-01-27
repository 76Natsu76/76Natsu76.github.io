/************************************************************
 * loot-tables.js
 * ----------------------------------------------------------
 * Generic loot resolver for any loot table shaped like:
 *
 * {
 *   goldRange: [min, max],
 *   xpRange: [min, max],
 *   items: [
 *     { itemKey: "string", weight: 1, min: 1, max: 1 }
 *   ]
 * }
 *
 * This file does NOT import JSON directly; instead, other
 * systems pass in the table definition object.
 ************************************************************/

/**
 * Roll a single loot table definition.
 * @param {Object} tableDef - Loot table definition.
 * @param {Function} rng - Optional RNG function (default Math.random).
 * @returns {{gold:number, xp:number, items:Array<{itemKey:string, quantity:number}>}}
 */
export function rollLootTable(tableDef, rng = Math.random) {
  if (!tableDef) {
    return { gold: 0, xp: 0, items: [] };
  }

  const gold = rollRange(tableDef.goldRange, rng);
  const xp = rollRange(tableDef.xpRange, rng);
  const items = [];

  if (Array.isArray(tableDef.items) && tableDef.items.length > 0) {
    const chosen = chooseWeighted(tableDef.items, rng);
    if (chosen) {
      const qty = rollInt(chosen.min ?? 1, chosen.max ?? 1, rng);
      if (qty > 0) {
        items.push({
          itemKey: chosen.itemKey,
          quantity: qty
        });
      }
    }
  }

  return { gold, xp, items };
}

/**
 * Roll multiple loot tables and merge results.
 * @param {Array<Object>} tables
 * @param {Function} rng
 */
export function rollMultipleLootTables(tables, rng = Math.random) {
  const result = { gold: 0, xp: 0, items: [] };

  for (const t of tables) {
    const r = rollLootTable(t, rng);
    result.gold += r.gold;
    result.xp += r.xp;
    mergeItems(result.items, r.items);
  }

  return result;
}

/************************************************************
 * Helpers
 ************************************************************/

function rollRange(range, rng) {
  if (!Array.isArray(range) || range.length !== 2) return 0;
  return rollInt(range[0], range[1], rng);
}

function rollInt(min, max, rng) {
  const lo = Math.floor(min);
  const hi = Math.floor(max);
  if (hi <= lo) return lo;
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function chooseWeighted(entries, rng) {
  let total = 0;
  for (const e of entries) {
    total += e.weight ?? 1;
  }
  if (total <= 0) return null;

  let roll = rng() * total;
  for (const e of entries) {
    const w = e.weight ?? 1;
    if (roll < w) return e;
    roll -= w;
  }
  return entries[entries.length - 1] || null;
}

function mergeItems(targetItems, newItems) {
  for (const ni of newItems) {
    const existing = targetItems.find(t => t.itemKey === ni.itemKey);
    if (existing) {
      existing.quantity += ni.quantity;
    } else {
      targetItems.push({ ...ni });
    }
  }
}

// overworld-encounter.js

import { REGION_ENCOUNTER_TABLES } from "./region-encounter-tables.js";
import { getRegionAtPixel } from "./world-map-data.js";
import { startEncounter } from "./encounter-engine.js"; // your existing engine

function chooseWeighted(entries) {
  let total = 0;
  for (const e of entries) total += e.weight;
  let roll = Math.random() * total;
  for (const e of entries) {
    if (roll < e.weight) return e;
    roll -= e.weight;
  }
  return entries[entries.length - 1];
}

export function checkForOverworldEncounter(player) {
  const pos = player.position;
  const region = getRegionAtPixel(pos.x, pos.y);

  if (!region) return;

  const table = REGION_ENCOUNTER_TABLES[region];
  if (!table) return;

  // 2% base encounter chance per tile step
  if (Math.random() > 0.02) return;

  // 90% base, 10% rare
  const pool = Math.random() < 0.1 ? table.rare : table.base;
  const chosen = chooseWeighted(pool);

  if (!chosen) return;

  startEncounter({
    type: "overworld",
    region,
    enemyKey: chosen.enemyKey
  });
}

// overworld-encounter.js

import { REGION_ENCOUNTER_TABLES } from "./region-encounter-tables.js";
import { getRegionAtPixel } from "./world-map-data.js";
import { startEncounter } from "./encounter-engine.js";
import { chooseRarityWeighted } from "./utils-weighted.js"; // you already have this
import { pickEnemyFromTierBands } from "./encounter-generator.js"; // you already have this

// Map TILE_REGION → subregion keys
const REGION_TO_SUBREGION = {
  forest: "forest-edge",
  deep_forest: "deep-forest",
  plains: "plains-field",
  swamp: "swamp-marsh",
  mountain: "mountain-pass",
  frostlands: "frost-edge",
  desert: "desert-dunes",
  capital_city: null // safe zone
};

export function checkForOverworldEncounter(player) {
  const pos = player.position;
  const region = getRegionAtPixel(pos.x, pos.y);

  if (!region) return;

  const subregion = REGION_TO_SUBREGION[region];
  if (!subregion) return; // safe zone or undefined region

  const table = REGION_ENCOUNTER_TABLES[subregion];
  if (!table) return;

  // 2% encounter chance per tile step
  if (Math.random() > 0.02) return;

  // Choose rarity using your existing rarity weights
  const rarity = chooseRarityWeighted({
    common: 70,
    uncommon: 20,
    rare: 9,
    boss: 1
  });

  const tierBands = table[rarity]?.tiers;
  if (!tierBands) return;

  // Use your existing tier-based enemy picker
  const enemyKey = pickEnemyFromTierBands(subregion, rarity, tierBands);
  if (!enemyKey) return;

  startEncounter({
    type: "overworld",
    region,
    subregion,
    rarity,
    enemyKey
  });
}

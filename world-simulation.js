// world-simulation.js
// Central index for world simulation data & helpers.

import { BIOME_PRESETS } from "./biome-presets.js";
import { REGION_BIOMES } from "./region-biomes.js";
import { REGION_MODIFIERS } from "./region-modifiers.js";
import { weatherTable } from "./weatherTable.js"; // assuming you exported it
// If weatherTable is still global in that file, you can skip this import
// and just re-export a wrapper or leave it out.

export { BIOME_PRESETS, REGION_BIOMES, REGION_MODIFIERS, weatherTable };

// Optional helpers

export function getBiomeForRegion(regionKey) {
  return REGION_BIOMES[regionKey] || null;
}

export function getRegionModifiers(regionKey) {
  return REGION_MODIFIERS[regionKey] || {
    hpMult: 1,
    atkMult: 1,
    defMult: 1,
    speedMult: 1,
    elementAffinity: {}
  };
}

export function getWeatherDefinition(weatherKey) {
  if (!weatherTable) return null;
  return weatherTable[weatherKey] || null;
}

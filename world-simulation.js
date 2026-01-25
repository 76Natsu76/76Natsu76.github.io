// world-simulation.js

import { BIOME_PRESETS } from "./biome-presets.js";
import { REGION_BIOMES } from "./region-biomes.js";
import { REGION_MODIFIERS } from "./region-modifiers.js";
import { weatherTable } from "./weatherTable.js";

export { BIOME_PRESETS, REGION_BIOMES, REGION_MODIFIERS, weatherTable };

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
  return weatherTable[weatherKey] || null;
}

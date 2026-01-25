// region-modifiers.js
// Builds REGION_MODIFIERS from biome presets + region-biome mapping.

import { BIOME_PRESETS } from "./biome-presets.js";
import { REGION_BIOMES } from "./region-biomes.js";

function buildRegionModifiers() {
  const result = {};
  for (const [regionKey, biomeKey] of Object.entries(REGION_BIOMES)) {
    const preset = BIOME_PRESETS[biomeKey];
    if (!preset) continue;
    result[regionKey] = {
      hpMult: preset.hpMult,
      atkMult: preset.atkMult,
      defMult: preset.defMult,
      speedMult: preset.speedMult,
      elementAffinity: { ...(preset.elementAffinity || {}) }
    };
  }
  return result;
}

export const REGION_MODIFIERS = buildRegionModifiers();

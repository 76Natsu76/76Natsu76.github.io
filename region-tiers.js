// region-tiers.js
import { REGION_TIER_BANDS } from "./region-tier-bands.js";

export const REGION_TIERS = {};

for (const region in REGION_TIER_BANDS) {
  const band = REGION_TIER_BANDS[region];

  // Use maxTier as the region’s displayed tier
  REGION_TIERS[region] = band.maxTier || band.minTier || 1;
}

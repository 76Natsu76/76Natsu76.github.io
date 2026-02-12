import { World } from "./world.js";
import { seededRNG } from "./rng.js";

export const TravelEngine = {
  move(player, fromRegion, toRegion) {
    const region = World.getRegion(fromRegion);
    if (!region.travelLinks.includes(toRegion)) {
      throw new Error(`Cannot travel from ${fromRegion} to ${toRegion}`);
    }

    const rng = seededRNG(player.id + Date.now());

    // Travel time (base 10 units)
    let travelTime = 10;

    // Mount speed
    if (player.mount) {
      travelTime *= 0.75;
    }

    // Region difficulty
    const dest = World.getRegion(toRegion);
    travelTime *= dest.regionTier * 0.9;

    // Random variation
    travelTime *= (0.9 + rng() * 0.2);

    return {
      success: true,
      travelTime,
      encounter: this.rollEncounter(player, dest, rng)
    };
  },

  rollEncounter(player, region, rng) {
    const rate = WORLD_DATA.worldSettings.defaultEncounterRate *
                 region.encounterRateMult;

    if (rng() < rate * 0.15) {
      return { type: "encounter" };
    }

    return null;
  }
};

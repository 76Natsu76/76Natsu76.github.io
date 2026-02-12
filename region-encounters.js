import { World } from "./world.js";
import { seededRNG } from "./rng.js";

export function generateRegionEncounter(regionKey, seed = null) {
  const region = World.getRegion(regionKey);
  const rng = seededRNG(seed || regionKey + Date.now());

  // Pick family
  const family = weightedPick(region.enemyFamilies, rng);

  // Pick rarity
  const rarity = weightedPick(region.rarityWeights, rng);

  return {
    region: regionKey,
    family: family.id,
    rarity: rarity.id
  };
}

function weightedPick(list, rng) {
  const total = list.reduce((sum, x) => sum + x.weight, 0);
  let roll = rng() * total;

  for (const entry of list) {
    if (roll < entry.weight) return entry;
    roll -= entry.weight;
  }

  return list[list.length - 1];
}

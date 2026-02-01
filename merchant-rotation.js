// merchant-rotation.js

import { MerchantProviders } from "./merchant-providers.js";
import { generateMerchantInventory } from "./merchant-inventory.js";

export function rotateMerchants(worldState) {
  const now = Date.now();

  // GLOBAL MERCHANT
  if (!worldState.globalMerchant || now >= worldState.globalMerchant.nextRotation) {
    const provider = MerchantProviders.global;

    const instance = provider.getMerchantInstance(worldState);

    worldState.globalMerchant = {
      ...instance,
      inventory: generateMerchantInventory(instance),
      nextRotation: now + (6 * 60 * 60 * 1000) // 6 hours
    };
  }

  // FUTURE: biome merchants
  if (MerchantProviders.biome.enabled) {
    // iterate biomes and assign merchants
  }

  // FUTURE: region merchants
  if (MerchantProviders.region.enabled) {
    // iterate regions and assign merchants
  }

  // FUTURE: traveling merchants
  if (MerchantProviders.traveling.enabled) {
    // spawn rare merchants
  }

  return worldState;
}

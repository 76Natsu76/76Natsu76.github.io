// merchant-providers.js

export const MerchantProviders = {
  global: {
    key: "global",
    enabled: true,
    getMerchantInstance: (worldState) => {
      return {
        id: "global_merchant",
        type: "general",
        personality: "neutral",
        region: "town",
      };
    }
  },

  // Future: biome merchants
  biome: {
    key: "biome",
    enabled: false,
    getMerchantInstance: (worldState, biomeKey) => {
      return {
        id: `biome_${biomeKey}`,
        type: "biome_specialist",
        personality: "regional",
        region: biomeKey,
      };
    }
  },

  // Future: region merchants
  region: {
    key: "region",
    enabled: false,
    getMerchantInstance: (worldState, regionKey) => {
      return {
        id: `region_${regionKey}`,
        type: "regional",
        personality: "local",
        region: regionKey,
      };
    }
  },

  // Future: traveling merchants
  traveling: {
    key: "traveling",
    enabled: false,
    getMerchantInstance: (worldState) => {
      return {
        id: `traveling_${Date.now()}`,
        type: "rare",
        personality: "eccentric",
        region: "random",
      };
    }
  }
};

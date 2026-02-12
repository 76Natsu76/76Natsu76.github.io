import { WORLD_DATA } from "./world-data.js";

export const World = {
  getRegion(key) {
    return WORLD_DATA.regions[key] || null;
  },

  listRegions() {
    return Object.values(WORLD_DATA.regions);
  },

  getTravelLinks(key) {
    const r = WORLD_DATA.regions[key];
    return r ? r.travelLinks : [];
  },

  getWeatherPool(key) {
    const r = WORLD_DATA.regions[key];
    return r ? r.weatherPool : [];
  },

  getEnemyFamilies(key) {
    const r = WORLD_DATA.regions[key];
    return r ? r.enemyFamilies : [];
  },

  getRarityWeights(key) {
    const r = WORLD_DATA.regions[key];
    return r ? r.rarityWeights : [];
  },

  getCombatModifiers(key) {
    const r = WORLD_DATA.regions[key];
    return r ? r.combatModifiers : {};
  }
};

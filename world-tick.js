// world-tick.js

/*
 * IDEA - SEASONS WILL EXIST
 * 1 SEASON LASTS 1 WEEK IRL
 * A YEAR IN GAME IS 1 MONTH IRL
 * week 1 = spring || week 2 = summer || week 3 = fall || week 4 = winter
 */

import { REGION_BIOMES, getWeatherDefinition } from "./world-simulation.js";

const BIOME_WEATHER_POOLS = {
  forest: ["clear", "rain", "fog"],
  plains: ["clear", "rain", "storm"],
  swamp: ["fog", "rain", "clear"],
  desert: ["clear", "heatwave", "storm"],
  tundra: ["clear", "storm", "fog"],
  mountains: ["clear", "storm", "fog"],
  cavern: ["clear", "fog"],
  ruins: ["clear", "fog", "rain"],
  coastal: ["clear", "rain", "storm"],
  volcanic: ["clear", "heatwave", "storm"],
  arcane: ["clear", "arcane_winds", "storm"],
  celestial: ["clear", "arcane_winds"],
  void: ["clear", "void_storm", "fog"],
  primeval: ["clear", "rain", "storm"],
  storm: ["storm", "rain", "clear"],
  abyssal: ["void_storm", "storm", "fog"],
  astral: ["clear", "arcane_winds"]
};

function chooseWeatherForBiome(biome) {
  const pool = BIOME_WEATHER_POOLS[biome] || ["clear"];
  const key = pool[Math.floor(Math.random() * pool.length)];
  return getWeatherDefinition(key);
}

export function initWorldState(regionKeys) {
  const regions = {};
  for (const key of regionKeys) {
    const biome = REGION_BIOMES[key] || null;
    const weather = biome ? chooseWeatherForBiome(biome) : getWeatherDefinition("clear");
    regions[key] = {
      key,
      biome,
      currentWeatherKey: weather ? weather.key : "clear",
      lastWeatherChange: 0,
      crisisState: null
    };
  }
  return {
    day: 0,
    tickCount: 0,
    regions
  };
}

export function tickWorld(worldState, deltaMinutes) {
  worldState.tickCount += 1;
  const WEATHER_MINUTES = 30;
  for (const regionKey in worldState.regions) {
    const region = worldState.regions[regionKey];
    region.lastWeatherChange += deltaMinutes;
    if (region.lastWeatherChange >= WEATHER_MINUTES) {
      region.lastWeatherChange = 0;
      if (region.biome) {
        const weather = chooseWeatherForBiome(region.biome);
        if (weather) {
          region.currentWeatherKey = weather.key;
        }
      }
    }
  }
  return worldState;
}

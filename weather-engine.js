import { World } from "./world.js";
import { seededRNG } from "./rng.js";

export const WeatherEngine = {
  rollWeather(regionKey, seed = null) {
    const region = World.getRegion(regionKey);
    const pool = region.weatherPool || ["clear"];

    const rng = seededRNG(seed || regionKey + Date.now());
    const index = Math.floor(rng() * pool.length);

    return pool[index];
  }
};

/************************************************************
 * region-unlocks.js
 ************************************************************/

const STORAGE_KEY = "global_region_unlocks";

export function loadRegionUnlocks(defaults) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(raw);
}

export function saveRegionUnlocks(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const REGION_UNLOCKS = {
  "unlocks": {
    "forest": true,
    "plains": true,
    "cavern": false,
    "ruins": false,
    "swamp": false,
    "desert": false,
    "tundra": false,
    "mountains": false,
    "void_realm": false,
    "astral_plane": false,
    "abyss": false
  }
};

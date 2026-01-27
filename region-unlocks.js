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

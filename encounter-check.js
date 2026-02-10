export function checkForEncounters(player) {
  const pos = getPlayerPosition(player);
  const region = getRegionAt(pos);

  if (!region || region.safeZone) return;

  if (Math.random() < 0.02) {
    startEncounter(region.encounterTable);
  }
}

export function checkForBuildingEntry(player) {
  const pos = getPlayerPosition(player);

  for (const b of WORLD_MAP.buildings) {
    if (Math.abs(pos.x - b.x) < 16 && Math.abs(pos.y - b.y) < 16) {
      enterBuilding(b.settlement, b.buildingId, player);
      return;
    }
  }
}

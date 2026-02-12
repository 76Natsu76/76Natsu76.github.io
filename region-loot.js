export function applyRegionLootModifiers(loot, region) {
  loot.gold = Math.floor(loot.gold * region.lootModifier);
  loot.xp = Math.floor(loot.xp * region.lootModifier);

  if (Math.random() < region.rareSpawnMult * 0.01) {
    loot.items.push("rare_region_drop");
  }

  return loot;
}

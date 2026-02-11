/************************************************************
 * dungeon-reward-summary.js — Canonical Reward Aggregator
 ************************************************************/

export function summarizeDungeonRewards(player, dungeon, chestLoot = null) {
  const result = {
    xp: 0,
    gold: 0,
    items: []
  };

  /************************************************************
   * 1. BASE DUNGEON REWARDS (normal dungeons only)
   ************************************************************/
  if (dungeon.rewards && dungeon.type !== "endless") {
    const base = dungeon.rewards;

    result.xp += base.xp || 0;
    result.gold += base.gold || 0;

    if (base.items?.length) {
      for (const itemKey of base.items) {
        result.items.push({ itemKey, quantity: 1 });
      }
    }
  }

  /************************************************************
   * 2. BOSS CHEST LOOT (normal, labyrinth, great_dungeon)
   ************************************************************/
  if (chestLoot) {
    result.xp += chestLoot.xp || 0;
    result.gold += chestLoot.gold || 0;

    if (chestLoot.items?.length) {
      for (const item of chestLoot.items) {
        result.items.push({
          itemKey: item.itemKey,
          quantity: item.quantity ?? 1
        });
      }
    }
  }

  /************************************************************
   * 3. APPLY TO PLAYER
   ************************************************************/
  player.xp = (player.xp || 0) + result.xp;
  player.gold = (player.gold || 0) + result.gold;

  player.inventory = player.inventory || [];
  for (const item of result.items) {
    player.inventory.push({
      key: item.itemKey,
      itemKey: item.itemKey,
      quantity: item.quantity
    });
  }

  return result;
}

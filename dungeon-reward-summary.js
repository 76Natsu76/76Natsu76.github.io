// dungeon-reward-summary.js

export function summarizeDungeonRewards(player, dungeon) {
  const rewards = dungeon.rewards || {};

  // Apply XP
  player.xp = (player.xp || 0) + (rewards.xp || 0);

  // Apply gold
  player.gold = (player.gold || 0) + (rewards.gold || 0);

  // Apply items
  const items = rewards.items || [];
  for (const itemKey of items) {
    player.inventory.push({ id: itemKey, key: itemKey, qty: 1 });
  }

  return {
    xp: rewards.xp || 0,
    gold: rewards.gold || 0,
    items
  };
}

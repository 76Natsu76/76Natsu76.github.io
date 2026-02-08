// boss-loot-resolver.js
// Rolls loot for world bosses using BOSS_LOOT_TABLES.

import { BOSS_LOOT_TABLES } from "./boss-loot-tables.js";
import { WORLD_BOSSES } from "./boss-definitions.js";

// ------------------------------------------------------------
// MAIN ENTRY
// ------------------------------------------------------------
export function resolveBossLoot(bossKey) {
  const table = BOSS_LOOT_TABLES[bossKey];
  if (!table) {
    console.warn(`No loot table found for boss: ${bossKey}`);
    return { gold: 0, items: [] };
  }

  const items = [];

  // Guaranteed items
  for (const item of table.guaranteed || []) {
    items.push(item);
  }

  // Rare items
  for (const entry of table.rare || []) {
    if (Math.random() < entry.chance) {
      items.push(entry.item);
    }
  }

  // Ultra Rare items
  for (const entry of table.ultraRare || []) {
    if (Math.random() < entry.chance) {
      items.push(entry.item);
    }
  }

  // Mythic items
  for (const entry of table.mythic || []) {
    if (Math.random() < entry.chance) {
      items.push(entry.item);
    }
  }

  // Gold (if defined in boss template)
  const boss = WORLD_BOSSES[bossKey];
  let gold = 0;

  if (boss?.goldRange) {
    const [min, max] = boss.goldRange;
    gold = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return { gold, items };
}

// ------------------------------------------------------------
// MULTIPLAYER DISTRIBUTION (future support)
// ------------------------------------------------------------
export function distributeBossLootToPlayers(players, bossKey) {
  const baseLoot = resolveBossLoot(bossKey);

  // For now: every player gets identical loot
  // Later: contribution-based, guild-based, or weighted distribution
  return players.map(p => ({
    player: p,
    gold: baseLoot.gold,
    items: [...baseLoot.items]
  }));
}

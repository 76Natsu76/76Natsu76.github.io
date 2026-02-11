/************************************************************
 * dungeon-events.js — Canonical Dungeon Event + Chest System
 ************************************************************/

import { DUNGEONS } from "./dungeons.js";
import { rollLootTable } from "./loot-tables.js";
import { DUNGEON_LOOT_TABLES } from "./dungeon-loot-tables.js";
import { resolveEnemy } from "./resolveEnemy.js";

/************************************************************
 * EVENT DEFINITIONS
 ************************************************************/
export const DUNGEON_EVENTS = {
  echo_shrine: {
    name: "Echo Shrine",
    type: "buff",
    description: "A resonant shrine that amplifies inner strength.",
    effects: [
      { type: "buff", stat: "atk", value: 10 }
    ]
  },

  collapsed_passage: {
    name: "Collapsed Passage",
    type: "trap",
    description: "A sudden cave-in threatens to crush you.",
    effects: [
      { type: "damage", value: 15 }
    ]
  },

  rift_anomaly: {
    name: "Rift Anomaly",
    type: "modifier",
    description: "Reality bends, altering the dungeon’s rules.",
    effects: [
      { type: "modifier", key: "enemyScaling", delta: 0.10 }
    ]
  },

  unstable_reality: {
    name: "Unstable Reality",
    type: "chaos",
    description: "The astral plane flickers unpredictably.",
    effects: [
      { type: "buff", stat: "atk", value: 5 },
      { type: "debuff", stat: "def", value: 5 }
    ]
  },

  tempest_shrine: {
    name: "Tempest Shrine",
    type: "buff",
    description: "Lightning crackles around you.",
    effects: [
      { type: "buff", stat: "spd", value: 5 }
    ]
  },

  broken_conduit: {
    name: "Broken Conduit",
    type: "trap",
    description: "A surge of unstable lightning erupts.",
    effects: [
      { type: "damage", value: 20 }
    ]
  }
};

/************************************************************
 * CHEST + MIMIC SYSTEM
 ************************************************************/

/**
 * Resolve a chest room.
 * Handles:
 *  - mimic chance
 *  - boss chest (guaranteed treasure)
 *  - loot scaling
 *  - marking chest as opened
 */
export function resolveDungeonChest(player, run, roomKey) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const logs = [];

  // Prevent double opening
  if (run.openedChests[roomKey]) {
    return { type: "already_opened", logs };
  }

  const isBossChest = run.state === "boss" || roomKey === "boss_room";

  // Mimic chance (0% on boss chest)
  const mimicChance = isBossChest ? 0 : 0.25;

  if (Math.random() < mimicChance) {
    logs.push("The chest snaps open — it's a MIMIC!");

    const mimic = resolveEnemy("mimic", dungeon.regionKey || "dungeon", 1);
    mimic.isDungeonEnemy = true;
    mimic.isMimic = true;

    // Apply dungeon scaling
    if (run.enemyScaling && run.enemyScaling !== 1.0) {
      mimic.hp = Math.floor(mimic.hp * run.enemyScaling);
      mimic.hpMax = Math.floor(mimic.hpMax * run.enemyScaling);
      mimic.atk = Math.floor(mimic.atk * run.enemyScaling);
    }

    return {
      type: "mimic",
      enemy: mimic,
      logs
    };
  }

  // Treasure chest
  const lootTableKey = getChestLootTable(run, dungeon);
  const lootTable = DUNGEON_LOOT_TABLES[lootTableKey];

  if (!lootTable) {
    logs.push("The chest is empty…");
    return { type: "treasure", loot: null, logs };
  }

  let loot = rollLootTable(lootTable);

  // Double loot modifier
  if (run.doubleLoot) {
    const extra = rollLootTable(lootTable);
    loot.gold += extra.gold;
    loot.xp += extra.xp;
    loot.items.push(...extra.items);
    logs.push("Dungeon modifier: Double loot!");
  }

  logs.push(`You found treasure: ${JSON.stringify(loot)}`);

  run.openedChests[roomKey] = true;

  return {
    type: "treasure",
    loot,
    logs
  };
}

/************************************************************
 * Determine which loot table to use for a chest
 ************************************************************/
function getChestLootTable(run, dungeon) {
  // Endless dungeon uses base loot table
  if (dungeon.type === "endless") {
    return dungeon.baseLootTable;
  }

  // Great Dungeon uses floor-based scaling
  if (dungeon.type === "great_dungeon") {
    const floor = run.currentFloor;
    const band = Math.ceil(floor / 10); // floors 1–10 → band 1, etc.
    return `great_dungeon_band_${band}`;
  }

  // Normal / labyrinth use floorConfig
  const floorConfig = dungeon.floorsConfig?.[run.currentFloor];
  return floorConfig?.lootTable || null;
}

/************************************************************
 * EVENT RESOLUTION API
 ************************************************************/
export function resolveDungeonEvent(eventKey, player, run) {
  const event = DUNGEON_EVENTS[eventKey];
  const logs = [];

  if (!event) {
    logs.push(`Unknown event: ${eventKey}`);
    return { logs };
  }

  logs.push(`Event: ${event.name}`);

  for (const effect of event.effects) {
    applyEventEffect(effect, player, run, logs);
  }

  return { logs };
}

/************************************************************
 * Apply event effects
 ************************************************************/
function applyEventEffect(effect, player, run, logs) {
  switch (effect.type) {
    case "buff":
      player[effect.stat] += effect.value;
      logs.push(`You feel empowered (+${effect.value} ${effect.stat}).`);
      break;

    case "debuff":
      player[effect.stat] -= effect.value;
      logs.push(`A curse weakens you (-${effect.value} ${effect.stat}).`);
      break;

    case "heal":
      if (run.noHealing) {
        logs.push("A healing force tries to reach you, but the dungeon forbids it.");
      } else {
        player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + effect.value);
        logs.push(`You recover ${effect.value} HP.`);
      }
      break;

    case "damage":
      player.hpCurrent = Math.max(0, player.hpCurrent - effect.value);
      logs.push(`You take ${effect.value} damage.`);
      break;

    case "modifier":
      run.modifiers[effect.key] =
        (run.modifiers[effect.key] || 0) + effect.delta;
      logs.push(`Dungeon shifts: ${effect.key} increased by ${effect.delta}.`);
      break;
  }
}

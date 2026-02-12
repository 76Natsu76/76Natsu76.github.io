// dungeon-engine.js
import { DUNGEONS } from "./dungeons.js";
import { DUNGEON_EVENTS } from "./dungeon-events.js";
import { DUNGEON_LOOT_TABLES } from "./dungeon-loot-tables.js";

import { rollLootTable } from "./loot-tables.js";
import { resolveEnemy } from "./resolveEnemy.js";
import { PlayerStorage } from "./player-storage.js";
import { summarizeDungeonRewards } from "./dungeon-reward-summary.js";

export const DungeonEngine = {
  createRun,
  isEndless,
  getCurrentFloor,
  generateRoom,
  generateEndlessRoom,
  buildEncounterEnemies,
  resolveEvent,
  applyEventEffect,
  resolveTreasure,
  generateBoss,
  completeFloor,
  completeDungeon,
  failDungeon,
  applyEndlessScaling,
  applyScaling,
  updateEndlessScore,
  saveRun,
  finalizeDungeon
};

// --- RUN LIFECYCLE --- //
function createRun(player, dungeonKey) {
  const dungeon = DUNGEONS[dungeonKey];

  const run = {
    dungeonKey,
    currentFloor: 1,
    state: "exploring",
    if (dungeon.modifiers) {
      run.activeModifiers = [...dungeon.modifiers];
    },
    modifiers: {
      ...(dungeon.dungeonModifiers || {})
    },
    noHealing: !!(dungeon.dungeonModifiers && dungeon.dungeonModifiers.noHealing),
    doubleLoot: !!(dungeon.dungeonModifiers && dungeon.dungeonModifiers.doubleLoot),
    enemyScaling:
      (dungeon.dungeonModifiers && dungeon.dungeonModifiers.enemyScaling) || 1.0,
    completed: false,
    failed: false,
    startedAt: Date.now(),
    progress: []
  };

  if (dungeon.type === "endless") {
    run.highestFloor = 1;
    run.endlessScore = 0;
  }

  return run;
}

function isEndless(run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  return dungeon && dungeon.type === "endless";
}

function getCurrentFloor(run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  if (!dungeon || dungeon.type === "endless") return null;
  return dungeon.floors[run.currentFloor - 1];
}

// --- ROOM GENERATION --- //
function generateRoom(run) {
  const dungeon = DUNGEONS[run.dungeonKey];

  // Endless handled separately
  if (dungeon.type === "endless") {
    return this.generateEndlessRoom(run);
  }

  const floor = this.getCurrentFloor(run);

  // --- Chest Room Logic ---
  if (dungeon.chestRoomsPerFloor) {
    const roomsPerFloor = dungeon.roomsPerFloor || 3;
    const chestRooms = dungeon.chestRoomsPerFloor;

    // Determine if this room index is a chest room
    const roomIndex = run.roomIndex || 0;
    const chestInterval = Math.floor(roomsPerFloor / chestRooms);

    if (roomIndex % chestInterval === 0) {
      // Boss floor chest override
      if (dungeon.bossFloor && run.currentFloor === dungeon.bossFloor && dungeon.bossChest) {
        return { type: "boss_chest", lootTable: dungeon.treasureLootTable };
      }

      // Mimic roll
      const mimicChance = dungeon.mimicChance ?? 0.25;
      if (Math.random() < mimicChance) {
        return { type: "mimic", enemyKey: "mimic_monster" };
      }

      // Normal treasure chest
      return { type: "treasure", lootTable: dungeon.treasureLootTable };
    }
  }

  // --- Normal room logic ---
  const roll = Math.random();
  if (roll < 0.6) return { type: "encounter", enemies: floor.encounterTable };
  if (roll < 0.8) return { type: "event", events: floor.events };
  return { type: "treasure", lootTable: floor.lootTable };
}

function generateEndlessRoom(run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const floor = run.currentFloor;

  // Boss cadence
  if (floor % dungeon.megaBossEvery === 0) {
    return { type: "boss", tier: "mega" };
  }
  if (floor % dungeon.bossEvery === 0) {
    return { type: "boss", tier: "mini" };
  }

  const roll = Math.random();
  if (roll < 0.6) {
    // baseEncounterTable can describe multi-enemy packs
    return { type: "encounter", enemies: dungeon.baseEncounterTable };
  }
  if (roll < 0.8) {
    return { type: "event", events: ["rift_anomaly"] };
  }
  return { type: "treasure", lootTable: dungeon.baseLootTable };
}

// --- ENCOUNTER ENEMY RESOLUTION (MULTI-ENEMY) --- //
function buildEncounterEnemies(run, enemiesDescriptor) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const regionKey = dungeon.regionKey || dungeon.region || "forest";

  const result = [];

  const addResolved = (enemyKey, tier = 1, count = 1) => {
    for (let i = 0; i < count; i++) {
      const enemy = resolveEnemy(enemyKey, regionKey, tier);
      if (isEndless(run)) {
        applyEndlessScaling(enemy, run);
      } else if (run.enemyScaling && run.enemyScaling !== 1.0) {
        applyScaling(enemy, run.enemyScaling);
      }
      enemy.isDungeonEnemy = true;
      enemy.dungeonKey = run.dungeonKey;
      result.push(enemy);
    }
  };

  const processEntry = entry => {
    if (!entry) return;
    if (typeof entry === "string") {
      addResolved(entry, 1, 1);
    } else if (typeof entry === "object") {
      const key = entry.key;
      const tier = entry.tier || 1;
      const count = entry.count || 1;
      addResolved(key, tier, count);
    }
  };

  if (Array.isArray(enemiesDescriptor)) {
    enemiesDescriptor.forEach(processEntry);
  } else {
    processEntry(enemiesDescriptor);
  }

  return result;
}

// --- EVENTS --- //
function resolveEvent(eventKey, player, run, logs) {
  const event = DUNGEON_EVENTS[eventKey];
  if (!event) return;

  logs.push(`Event: ${event.name}`);

  for (const effect of event.effects) {
    applyEventEffect(effect, player, run, logs);
  }
}

function applyEventEffect(effect, player, run, logs) {
  switch (effect.type) {
    case "buff":
      player.atk += effect.value;
      logs.push(`You feel empowered (+${effect.value} ATK).`);
      break;
    case "debuff":
      player.def -= effect.value;
      logs.push(`A curse weakens you (-${effect.value} DEF).`);
      break;
    case "heal":
      if (run.noHealing) {
        logs.push(
          "A healing force tries to reach you, but the dungeon forbids it."
        );
      } else {
        player.hpCurrent = Math.min(
          player.hpMax,
          player.hpCurrent + effect.value
        );
        logs.push(`You recover ${effect.value} HP.`);
      }
      break;
    case "damage":
      player.hpCurrent = Math.max(0, player.hpCurrent - effect.value);
      logs.push(`You take ${effect.value} damage.`);
      break;
    case "modifier": {
      const [key, delta] = effect.value.split("+");
      const amount = parseFloat(delta);
      run.modifiers[key] = (run.modifiers[key] || 0) + amount;
      logs.push(`Dungeon shifts: ${key} increased by ${amount}.`);
      break;
    }
  }
}

// --- TREASURE --- //
function resolveTreasure(lootTableKey, run, logs) {
  const table = DUNGEON_LOOT_TABLES[lootTableKey];
  if (!table) return null;

  let loot = rollLootTable(table);
  if (run.activeModifiers?.includes("double_loot")) {
    logs.push("Modifier active: Double Loot!");
    const extra = rollLootTable(table);
    loot.gold += extra.gold;
    loot.xp += extra.xp;
    loot.items.push(...extra.items);
  }

  if (run.doubleLoot) {
    const extra = rollLootTable(table);
    loot.gold += extra.gold;
    loot.xp += extra.xp;
    loot.items.push(...extra.items);
    logs.push("Dungeon modifier: Double loot!");
  }

  logs.push(`You found: ${JSON.stringify(loot)}`);
  return loot;
}

// --- BOSS --- //
function generateBoss(run, tierOverride = null) {
  const dungeon = DUNGEONS[run.dungeonKey];

  if (dungeon.type === "endless") {
    const tier = tierOverride || run.nextBossTier || "mini";
    const key =
      tier === "mega" ? dungeon.megaBossEnemyKey : dungeon.bossEnemyKey;

    const enemy = resolveEnemy(
      key,
      dungeon.regionKey || dungeon.region || "forest",
      1
    );
    enemy.isDungeonBoss = true;
    enemy.dungeonKey = run.dungeonKey;

    if (isEndless(run)) {
      applyEndlessScaling(enemy, run);
    } else if (run.enemyScaling && run.enemyScaling !== 1.0) {
      applyScaling(enemy, run.enemyScaling);
    }

    return enemy;
  }

  const enemy = resolveEnemy(
    dungeon.boss.enemyKey,
    dungeon.regionKey || dungeon.region || "forest",
    dungeon.boss.tier || 1
  );
  enemy.isDungeonBoss = true;
  enemy.dungeonKey = run.dungeonKey;

  if (run.enemyScaling && run.enemyScaling !== 1.0) {
    applyScaling(enemy, run.enemyScaling);
  }

  return enemy;
}

// --- FLOOR / DUNGEON PROGRESSION --- //
function completeFloor(run) {
  const dungeon = DUNGEONS[run.dungeonKey];

  if (dungeon.floorModifiers && dungeon.floorModifiers[run.currentFloor]) {
    run.activeModifiers.push(...dungeon.floorModifiers[run.currentFloor]);
  }
  
  if (dungeon.type === "endless") {
    run.currentFloor++;
    run.highestFloor = Math.max(run.highestFloor || 1, run.currentFloor);
    run.endlessScore = run.highestFloor;
    run.state = "exploring";
    return;
  }

  run.currentFloor++;
  if (run.currentFloor > dungeon.floors.length) {
    run.state = "boss";
  }
}

function completeDungeon(run) {
  run.completed = true;
  run.state = "completed";
}

function failDungeon(run) {
  run.failed = true;
  run.state = "failed";
}

// --- SCALING --- //
function applyEndlessScaling(enemy, run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const floor = run.currentFloor;

  const hpMult = Math.pow(dungeon.scaling.enemyHP, floor - 1);
  const atkMult = Math.pow(dungeon.scaling.enemyATK, floor - 1);

  if (typeof enemy.hp === "number") {
    enemy.hp = Math.floor(enemy.hp * hpMult);
    enemy.hpMax = Math.floor((enemy.hpMax || enemy.hp) * hpMult);
  }
  if (typeof enemy.atk === "number") {
    enemy.atk = Math.floor(enemy.atk * atkMult);
  }
  if (typeof enemy.attack === "number") {
    enemy.attack = Math.floor(enemy.attack * atkMult);
  }

  return enemy;
}

function applyScaling(enemy, mult) {
  if (typeof enemy.hp === "number") {
    enemy.hp = Math.floor(enemy.hp * mult);
    enemy.hpMax = Math.floor((enemy.hpMax || enemy.hp) * mult);
  }
  if (typeof enemy.atk === "number") {
    enemy.atk = Math.floor(enemy.atk * mult);
  }
  if (typeof enemy.attack === "number") {
    enemy.attack = Math.floor(enemy.attack * mult);
  }
  return enemy;
}

function updateEndlessScore(run) {
  run.highestFloor = Math.max(run.highestFloor || 1, run.currentFloor);
  run.endlessScore = run.highestFloor;
}

// --- PERSISTENCE --- //
function saveRun(player, run, username) {
  player.activeDungeonRun = run;
  PlayerStorage.save(username, player);
}

/**
 * Finalize a completed dungeon:
 * - apply static dungeon rewards
 * - merge boss chest loot
 * - record clears + lastCompletedDungeonRun
 * - clear activeDungeonRun
 */
function finalizeDungeon(player, run, combatResult, username) {
  const dungeon = DUNGEONS[run.dungeonKey];

  completeDungeon(run);

  player.dungeonRecords = player.dungeonRecords || {};
  const rec = player.dungeonRecords[run.dungeonKey] || { clears: 0 };
  rec.clears += 1;
  player.dungeonRecords[run.dungeonKey] = rec;

  // Base dungeon rewards (xp/gold/items by key)
  const baseSummary = summarizeDungeonRewards(player, dungeon);

  // Boss chest / combat loot
  const chestLoot = (combatResult && combatResult.loot) || [];
  if (!Array.isArray(player.inventory)) player.inventory = [];

  for (const item of chestLoot) {
    const existing = player.inventory.find(
      i => i.name === item.name && i.type === item.type
    );
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity || item.qty || 1);
    } else {
      player.inventory.push(item);
    }
  }

  player.lastCompletedDungeonRun = {
    dungeonKey: run.dungeonKey,
    xp: baseSummary.xp,
    gold: baseSummary.gold,
    items: chestLoot
  };

  player.activeDungeonRun = null;
  PlayerStorage.save(username, player);

  return player.lastCompletedDungeonRun;
}

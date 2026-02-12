// dungeon-engine.js
import { DUNGEONS } from "./dungeons.js";
import { DUNGEON_EVENTS } from "./dungeon-events.js";
import { DUNGEON_LOOT_TABLES } from "./dungeon-loot-tables.js";

import { rollLootTable } from "./loot-tables.js";
import { resolveEnemy } from "./resolveEnemy.js";
import { PlayerStorage, recordBeatenSeed } from "./player-storage.js";
import { summarizeDungeonRewards } from "./dungeon-reward-summary.js";
import { detectSeedType, SEED_TYPES } from "./seeds.js";
import { RELICS, RELIC_DROPS } from "./relics.js";
import { SEED_LOOT } from "./seed-loot.js";
import { COMPLETION_REWARDS } from "./completion-rewards.js";
import { seededRNG } from "./rng.js";

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
  finalizeDungeon,
  moveToLabyrinthRoom
};

// --- RUN LIFECYCLE --- //
function createRun(player, dungeonKey, seed = null) {
  const dungeon = DUNGEONS[dungeonKey];

  if (player.relics?.length) {
    for (const relicKey of player.relics) {
      const relic = RELICS[relicKey];
      if (relic?.apply) relic.apply(run);
    }
  }

  // If no seed provided, generate one
  if (!seed) {
    seed = Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Detect seed type
  const seedType = detectSeedType(seed);

  const baseMods = dungeon.dungeonModifiers || {};

  const run = {
    dungeonKey,
    seed,
    seedType,                     // ⭐ NEW
    state: "exploring",
    currentFloor: 1,
    highestFloor: 1,

    // Legacy modifiers
    modifiers: { ...baseMods },
    noHealing: !!baseMods.noHealing,
    doubleLoot: !!baseMods.doubleLoot,
    enemyScaling: baseMods.enemyScaling || 1.0,

    // New-style modifiers
    activeModifiers: dungeon.modifiers ? [...dungeon.modifiers] : [],

    completed: false,
    failed: false,
    startedAt: Date.now(),
    progress: []
  };

  // ⭐ Apply seed-based modifiers
  const seedDef = SEED_TYPES[seedType];
  if (seedDef?.modifiers) {
    run.activeModifiers.push(...seedDef.modifiers);
  
  }

  switch (seedType) {
    case "blessed":
      run.healBonus = (run.healBonus || 1) * 1.25;
      run.bonusTreasureRooms = 1;
      break;
  
    case "cursed":
      run.enemyScaling *= 1.25;
      run.curseLootChance = 0.25;
      break;
  
    case "loot":
      run.bonusTreasureRooms = 2;
      run.doubleLoot = true;
      break;
  
    case "chaos":
      run.chaosChance = 0.15;
      break;
  
    case "bossrush":
      run.bossRush = true;
      run.bossLootMult = (run.bossLootMult || 1) * 1.3;
      break;
  }

  // ⭐ Initialize labyrinth with seed
  if (dungeon.type === "labyrinth") {
    run.mode = "labyrinth";
    run.labyrinth = generateLabyrinth(dungeon, seed); // pass seed
  } else if (dungeon.type === "endless") {
    run.mode = "endless";
    run.highestFloor = 1;
    run.endlessScore = 0;
  } else {
    run.mode = "linear";
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

  // Prefer floorsConfig (canonical)
  if (dungeon.floorsConfig) {
    return dungeon.floorsConfig[run.currentFloor] || null;
  }

  // Legacy: dungeon.floors as an array of floor configs
  if (Array.isArray(dungeon.floors)) {
    return dungeon.floors[run.currentFloor - 1] || null;
  }

  return null;
}

// --- ROOM GENERATION --- //
function generateRoom(run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  if (!dungeon) throw new Error(`Unknown dungeon key: ${run.dungeonKey}`);

  const rng = seededRNG(run.seed || "default");

  // Track room index for linear dungeons
  run.roomIndex = run.roomIndex || 0;
  const roomIndex = run.roomIndex;

  // LABYRINTH
  if (run.mode === "labyrinth" || dungeon.type === "labyrinth") {
    return generateLabyrinthRoom(run);
  }

  // ENDLESS
  if (dungeon.type === "endless") {
    return generateEndlessRoom(run);
  }

  // SEED: Boss Rush
  if (run.bossRush && roomIndex % 3 === 0) {
    run.roomIndex++;
    return { type: "boss" };
  }

  // SEED: Chaos Mode
  if (run.chaosMode) {
    const chaosMods = ["unstable_magic", "enemy_frenzy", "thick_fog"];
    const randomMod = chaosMods[Math.floor(rng() * chaosMods.length)];
    run.activeModifiers.push(randomMod);
  }

  if (run.bonusTreasureRooms && rng() < 0.1 * run.bonusTreasureRooms) {
    run.roomIndex++;
    return { type: "treasure", lootTable: dungeon.treasureLootTable };
  }

  const floor = getCurrentFloor(run);

  // CHEST LOGIC
  if (dungeon.chestRoomsPerFloor) {
    const roomsPerFloor = dungeon.roomsPerFloor || 3;
    const chestRooms = dungeon.chestRoomsPerFloor;
    const chestInterval = Math.max(1, Math.floor(roomsPerFloor / chestRooms));

    if (roomIndex % chestInterval === 0) {
      // Boss chest override
      if (dungeon.bossFloor &&
          run.currentFloor === dungeon.bossFloor &&
          dungeon.bossChest) {
        run.roomIndex++;
        return { type: "boss_chest", lootTable: dungeon.treasureLootTable };
      }

      // Mimic roll (seeded)
      const mimicChance = dungeon.mimicChance ?? 0.25;
      if (rng() < mimicChance) {
        run.roomIndex++;
        return { type: "mimic", enemyKey: "mimic_monster" };
      }

      // Normal treasure
      run.roomIndex++;
      return { type: "treasure", lootTable: dungeon.treasureLootTable };
    }
  }

  // NORMAL ROOM LOGIC (seeded)
  const roll = rng();

  if (floor) {
    if (roll < 0.6) {
      run.roomIndex++;
      return { type: "encounter", enemies: floor.encounterTable };
    }
    if (roll < 0.8) {
      run.roomIndex++;
      return { type: "event", events: floor.events };
    }
    run.roomIndex++;
    return { type: "treasure", lootTable: floor.lootTable };
  }

  // FALLBACK
  if (roll < 0.6) {
    run.roomIndex++;
    return { type: "encounter", enemies: dungeon.baseEncounterTable || [] };
  }
  if (roll < 0.8) {
    run.roomIndex++;
    return { type: "event", events: dungeon.baseEvents || [] };
  }

  run.roomIndex++;
  return {
    type: "treasure",
    lootTable: dungeon.baseLootTable || dungeon.treasureLootTable || null
  };
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
        logs.push("A healing force tries to reach you, but the dungeon forbids it.");
      } else {
        let healAmount = effect.value;

        if (run.healBonus) {
          healAmount = Math.floor(healAmount * run.healBonus);
        }

        player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + healAmount);
        logs.push(`You recover ${healAmount} HP.`);
      }
      break;

    case "damage":
      let dmg = effect.value;

      if (run.damageReduction) {
        dmg = Math.max(0, Math.floor(dmg * (1 - run.damageReduction)));
      }

      player.hpCurrent = Math.max(0, player.hpCurrent - dmg);
      logs.push(`You take ${dmg} damage.`);
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
  const rng = seededRNG(run.seed || "default");
  const table = DUNGEON_LOOT_TABLES[lootTableKey];
  if (!table) return null;

  let loot = rollLootTable(table);

  // New-style modifier: "double_loot" in activeModifiers
  if (run.activeModifiers?.includes("double_loot")) {
    logs.push("Modifier active: Double Loot!");
    const extra = rollLootTable(table);
    loot.gold += extra.gold;
    loot.xp += extra.xp;
    loot.items.push(...extra.items);
  }

  // Legacy dungeonModifiers flag
  if (run.doubleLoot) {
    const extra = rollLootTable(table);
    loot.gold += extra.gold;
    loot.xp += extra.xp;
    loot.items.push(...extra.items);
    logs.push("Dungeon modifier: Double loot!");
  }

  if (run.bossLootMult) {
    loot.gold = Math.floor(loot.gold * run.bossLootMult);
    loot.xp = Math.floor(loot.xp * run.bossLootMult);
  }

  if (run.chaosChance && rng() < run.chaosChance) {
    const chaosMods = ["unstable_magic", "enemy_frenzy", "thick_fog"];
    const randomMod = chaosMods[Math.floor(rng() * chaosMods.length)];
    run.activeModifiers.push(randomMod);
  }

  if (run.curseLootChance && rng() < run.curseLootChance) {
    loot.items.push("cursed_mark");
  }
  
  const seedType = run.seedType;
  const seedLoot = SEED_LOOT[seedType];
  
  if (seedLoot) {
    loot.gold = Math.floor(loot.gold * seedLoot.goldMult);
    loot.xp = Math.floor(loot.xp * seedLoot.xpMult);
  
    if (seedLoot.extraItems) {
      loot.items.push(...seedLoot.extraItems);
    }
  
    if (seedLoot.curseChance && rng() < seedLoot.curseChance) {
      loot.items.push("cursed_mark");
    }
  
    if (seedLoot.chaosItemChance && rng() < seedLoot.chaosItemChance) {
      const chaosItem = seedLoot.chaosItems[Math.floor(rng() * seedLoot.chaosItems.length)];
      loot.items.push(chaosItem);
    }
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

  // Floor-based modifier injection (for great_dungeon / others)
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
  if (dungeon.floorsConfig) {
    const maxFloor = Object.keys(dungeon.floorsConfig).length;
    if (run.currentFloor > maxFloor) {
      run.state = "boss";
    }
  } else if (typeof dungeon.floors === "number") {
    if (run.currentFloor > dungeon.floors) {
      run.state = "boss";
    }
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
      existing.quantity =
        (existing.quantity || 1) + (item.quantity || item.qty || 1);
    } else {
      player.inventory.push(item);
    }
  }
  
  if (!player.relics) player.relics = [];
  
  const seedType = run.seedType;
  const relicPool = RELIC_DROPS[seedType] || [];
  
  if (relicPool.length && Math.random() < 0.25) {
    const relic = relicPool[Math.floor(Math.random() * relicPool.length)];
  
    if (!player.relics.includes(relic)) {
      player.relics.push(relic);
  
      player.notifications = player.notifications || [];
      player.notifications.push({
        message: `Unlocked Relic: ${relic}`,
        time: Date.now()
      });
    }
  }

  const seedReward = COMPLETION_REWARDS[run.seedType];
  if (seedReward) {
    player.xp += seedReward.xp;
    player.gold += seedReward.gold;
    player.inventory.push(...seedReward.items);
  
    player.notifications = player.notifications || [];
    player.notifications.push({
      message: `Seed Completion Reward: +${seedReward.xp} XP, +${seedReward.gold} gold, items: ${seedReward.items.join(", ")}`,
      time: Date.now()
    });
  }

  player.lastCompletedDungeonRun = {
    dungeonKey: run.dungeonKey,
    xp: baseSummary.xp,
    gold: baseSummary.gold,
    items: chestLoot
  };

  player.activeDungeonRun = null;
  PlayerStorage.save(username, player);

  if (run.mode === "labyrinth") {
    recordBeatenSeed(player, run);
  }

  return player.lastCompletedDungeonRun;
}

// --- LABYRINTH GENERATION --- //
function generateLabyrinth(dungeon, seed) {
  const cfg = dungeon.labyrinthConfig || {};
  const roomCount = cfg.roomCount || 20;
  const minDegree = cfg.minDegree || 1;
  const maxDegree = cfg.maxDegree || 3;
  const rng = seededRNG(seed);

  const rooms = {};
  const ids = [];

  // create nodes
  for (let i = 0; i < roomCount; i++) {
    const id = `R${i + 1}`;
    ids.push(id);
    rooms[id] = {
      id,
      type: "normal", // will refine later
      neighbors: [],
      depth: 0,
      visited: false,
      modifiers: []
    };
  }

  // build a connected backbone (simple chain)
  for (let i = 0; i < ids.length - 1; i++) {
    const a = ids[i];
    const b = ids[i + 1];
    rooms[a].neighbors.push(b);
    rooms[b].neighbors.push(a);
  }

  // add extra edges for loops / branches
  const extraEdges = Math.floor(roomCount * 0.6);
  for (let i = 0; i < extraEdges; i++) {
    const a = ids[Math.floor(rng() * ids.length)];
    const b = ids[Math.floor(rng() * ids.length)];
    if (a === b) continue;
    if (!rooms[a].neighbors.includes(b)) {
      if (
        rooms[a].neighbors.length < maxDegree &&
        rooms[b].neighbors.length < maxDegree
      ) {
        rooms[a].neighbors.push(b);
        rooms[b].neighbors.push(a);
      }
    }
  }

  // compute depths from start (R1)
  const startId = ids[0];
  const queue = [startId];
  rooms[startId].depth = 0;
  const visited = new Set([startId]);

  while (queue.length) {
    const cur = queue.shift();
    const curDepth = rooms[cur].depth;
    for (const n of rooms[cur].neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        rooms[n].depth = curDepth + 1;
        queue.push(n);
      }
    }
  }

  // pick boss room: farthest depth or cfg.bossAtDepth
  let bossRoomId = null;
  if (cfg.bossAtDepth != null) {
    const candidates = ids.filter(id => rooms[id].depth >= cfg.bossAtDepth);
    bossRoomId = candidates.length
      ? candidates[Math.floor(rng() * candidates.length)]
      : ids[ids.length - 1];
  } else {
    bossRoomId = ids.reduce(
      (best, id) => (rooms[id].depth > rooms[best].depth ? id : best),
      ids[0]
    );
  }

  rooms[bossRoomId].type = "boss";

  // sprinkle treasure / events / mimics
  const nonBossIds = ids.filter(id => id !== bossRoomId);
  shuffle(nonBossIds, rng);

  const treasureCount = Math.max(2, Math.floor(roomCount * 0.15));
  const eventCount = Math.max(2, Math.floor(roomCount * 0.15));
  const mimicCount = Math.max(1, Math.floor(roomCount * 0.05));

  for (let i = 0; i < treasureCount && i < nonBossIds.length; i++) {
    rooms[nonBossIds[i]].type = "treasure";
  }
  for (
    let i = treasureCount;
    i < treasureCount + eventCount && i < nonBossIds.length;
    i++
  ) {
    if (rooms[nonBossIds[i]].type === "normal") {
      rooms[nonBossIds[i]].type = "event";
    }
  }
  for (
    let i = treasureCount + eventCount;
    i < treasureCount + eventCount + mimicCount &&
    i < nonBossIds.length;
    i++
  ) {
    if (rooms[nonBossIds[i]].type === "normal") {
      rooms[nonBossIds[i]].type = "mimic";
      rooms[nonBossIds[i]].enemyKey = "mimic_monster";
    }
  }

  return {
    rooms,
    startRoomId: startId,
    currentRoomId: startId,
    bossRoomId
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Generate a room from the labyrinth graph
function generateLabyrinthRoom(run) {
  const dungeon = DUNGEONS[run.dungeonKey];
  const lab = run.labyrinth;
  if (!lab) throw new Error("No labyrinth data on run");

  const room = lab.rooms[lab.currentRoomId];
  if (!room) throw new Error("Invalid labyrinth room");

  room.visited = true;

  const baseFloor =
    (dungeon.floorsConfig && dungeon.floorsConfig[1]) || null;

  switch (room.type) {
    case "boss":
      run.state = "boss";
      return { type: "boss" };

    case "treasure":
      return {
        type: "treasure",
        lootTable:
          (baseFloor && baseFloor.lootTable) ||
          dungeon.baseLootTable ||
          dungeon.treasureLootTable
      };

    case "event":
      return {
        type: "event",
        events: ["labyrinth_whisper", "lost_explorer", "cursed_altar"]
      };

    case "mimic":
      return {
        type: "mimic",
        enemyKey: room.enemyKey || "mimic_monster"
      };

    default:
      return {
        type: "encounter",
        enemies:
          (baseFloor && baseFloor.encounterTable) ||
          dungeon.baseEncounterTable ||
          []
      };
  }
}

function moveToLabyrinthRoom(run, nextRoomId) {
  if (!run.labyrinth) return;
  const lab = run.labyrinth;
  const current = lab.rooms[lab.currentRoomId];
  if (!current.neighbors.includes(nextRoomId)) {
    throw new Error("Invalid move: not a neighbor");
  }
  lab.currentRoomId = nextRoomId;
}

function getLabyrinthVisibility(run) {
  const lab = run.labyrinth;
  if (!lab) return {};

  const visible = {};
  const frontier = new Set();

  // Mark visited rooms as visible
  for (const id in lab.rooms) {
    if (lab.rooms[id].visited) {
      visible[id] = "visible";
      for (const n of lab.rooms[id].neighbors) {
        if (!lab.rooms[n].visited) {
          frontier.add(n);
        }
      }
    }
  }

  // Mark frontier rooms as "adjacent"
  for (const id of frontier) {
    if (!visible[id]) visible[id] = "adjacent";
  }

  return visible;
}

DungeonEngine.getLabyrinthVisibility = getLabyrinthVisibility;

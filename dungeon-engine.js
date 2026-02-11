// dungeon-engine.js
import { DUNGEONS } from "./dungeons.js";
import { DUNGEON_EVENTS } from "./dungeon-events.js";
import { DUNGEON_LOOT_TABLES } from "./dungeon-loot-tables.js";

import { rollLootTable } from "./loot-tables.js";
import { resolveEnemy } from "./resolveEnemy.js";
import { PlayerStorage } from "./player-storage.js";
import { summarizeDungeonRewards } from "./dungeon-reward-summary.js";

export const DungeonEngine = {
  // --- RUN LIFECYCLE --- //
  createRun(player, dungeonKey) {
    const dungeon = DUNGEONS[dungeonKey];

    const run = {
      dungeonKey,
      currentFloor: 1,
      state: "exploring",
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
      progress: [],
      roomIndex: 0 // for labyrinth / room-based dungeons
    };

    if (dungeon.type === "endless") {
      run.highestFloor = 1;
      run.endlessScore = 0;
    }

    return run;
  },

  isEndless(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    return dungeon && dungeon.type === "endless";
  },

  getCurrentFloor(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    if (!dungeon || dungeon.type === "endless") return null;
    // Old-style explicit floors array
    if (Array.isArray(dungeon.floors)) {
      return dungeon.floors[run.currentFloor - 1] || null;
    }
    // New-style numeric floors: generic floor config
    return {
      floorIndex: run.currentFloor,
      encounterTable: dungeon.baseEncounterTable || [],
      events: ["echo_shrine"],
      lootTable: dungeon.baseLootTable || null
    };
  },

  // --- ROOM GENERATION --- //
  generateRoom(run) {
    const dungeon = DUNGEONS[run.dungeonKey];

    if (dungeon.type === "endless") {
      return this.generateEndlessRoom(run);
    }

    const floor = this.getCurrentFloor(run);
    const roll = Math.random();

    if (roll < 0.6) {
      return { type: "encounter", enemies: floor.encounterTable };
    }
    if (roll < 0.8) {
      return { type: "event", events: floor.events };
    }
    return { type: "treasure", lootTable: floor.lootTable };
  },

  generateEndlessRoom(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    const floor = run.currentFloor;

    if (floor % dungeon.megaBossEvery === 0) {
      return { type: "boss", tier: "mega" };
    }
    if (floor % dungeon.bossEvery === 0) {
      return { type: "boss", tier: "mini" };
    }

    const roll = Math.random();
    if (roll < 0.6) {
      return { type: "encounter", enemies: dungeon.baseEncounterTable };
    }
    if (roll < 0.8) {
      return { type: "event", events: ["rift_anomaly"] };
    }
    return { type: "treasure", lootTable: dungeon.baseLootTable };
  },

  // --- ENCOUNTER ENEMY RESOLUTION (MULTI-ENEMY) --- //
  buildEncounterEnemies(run, enemiesDescriptor) {
    const dungeon = DUNGEONS[run.dungeonKey];
    const regionKey = dungeon.regionKey || dungeon.region || "forest";

    const result = [];

    const addResolved = (enemyKey, tier = 1, count = 1) => {
      for (let i = 0; i < count; i++) {
        const enemy = resolveEnemy(enemyKey, regionKey, tier);
        if (this.isEndless(run)) {
          this.applyEndlessScaling(enemy, run);
        } else if (run.enemyScaling && run.enemyScaling !== 1.0) {
          this.applyScaling(enemy, run.enemyScaling);
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
  },

  // --- EVENTS --- //
  resolveEvent(eventKey, player, run, logs) {
    const event = DUNGEON_EVENTS[eventKey];
    if (!event) return;

    logs.push(`Event: ${event.name}`);

    for (const effect of event.effects) {
      this.applyEventEffect(effect, player, run, logs);
    }
  },

  applyEventEffect(effect, player, run, logs) {
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
  },

  // --- TREASURE --- //
  resolveTreasure(lootTableKey, run, logs) {
    const table = DUNGEON_LOOT_TABLES[lootTableKey];
    if (!table) return null;

    let loot = rollLootTable(table);
    if (run.doubleLoot) {
      const extra = rollLootTable(table);
      loot.gold += extra.gold;
      loot.xp += extra.xp;
      loot.items.push(...extra.items);
      logs.push("Dungeon modifier: Double loot!");
    }

    logs.push(`You found: ${JSON.stringify(loot)}`);
    return loot;
  },

  // --- BOSS --- //
  generateBoss(run, tierOverride = null) {
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

      if (this.isEndless(run)) {
        this.applyEndlessScaling(enemy, run);
      } else if (run.enemyScaling && run.enemyScaling !== 1.0) {
        this.applyScaling(enemy, run.enemyScaling);
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
      this.applyScaling(enemy, run.enemyScaling);
    }

    return enemy;
  },

  // --- FLOOR / DUNGEON PROGRESSION --- //
  completeFloor(run) {
    const dungeon = DUNGEONS[run.dungeonKey];

    if (dungeon.type === "endless") {
      run.currentFloor++;
      run.highestFloor = Math.max(run.highestFloor || 1, run.currentFloor);
      run.endlessScore = run.highestFloor;
      run.state = "exploring";
      return;
    }

    run.currentFloor++;
    if (Array.isArray(dungeon.floors)) {
      if (run.currentFloor > dungeon.floors.length) {
        run.state = "boss";
      }
    } else {
      if (run.currentFloor > dungeon.floors) {
        run.state = "boss";
      }
    }
  },

  completeDungeon(run) {
    run.completed = true;
    run.state = "completed";
  },

  failDungeon(run) {
    run.failed = true;
    run.state = "failed";
  },

  // Called when the dungeon is fully cleared and rewards should be granted
  finalizeDungeon(player, run, chestLoot, username) {
    const dungeon = DUNGEONS[run.dungeonKey];
    const rewards = summarizeDungeonRewards(player, dungeon, chestLoot);

    run.completed = true;
    run.state = "completed";

    player.lastCompletedDungeonRun = {
      dungeonKey: run.dungeonKey,
      xp: rewards.xp,
      gold: rewards.gold,
      items: rewards.items,
      floorsCleared: run.currentFloor,
      score: this.isEndless(run) ? run.endlessScore : null
    };

    player.activeDungeonRun = null;
    PlayerStorage.save(username, player);
  },

  applyEndlessScaling(enemy, run) {
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
  },

  applyScaling(enemy, mult) {
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
  },

  updateEndlessScore(run) {
    run.highestFloor = Math.max(run.highestFloor || 1, run.currentFloor);
    run.endlessScore = run.highestFloor;
  },

  saveRun(player, run, username) {
    player.activeDungeonRun = run;
    PlayerStorage.save(username, player);
  }
};

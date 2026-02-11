/************************************************************
 * dungeon-engine.js — Canonical Dungeon Run Engine
 ************************************************************/

import { DUNGEONS } from "./dungeons.js";
import { DUNGEON_EVENTS } from "./dungeon-events.js";
import { DUNGEON_LOOT_TABLES } from "./dungeon-loot-tables.js";

import { rollLootTable } from "./loot-tables.js";
import { resolveEnemy } from "./resolveEnemy.js";
import { PlayerStorage } from "./player-storage.js";

export const DungeonEngine = {
  /************************************************************
   * RUN LIFECYCLE
   ************************************************************/
  createRun(player, dungeonKey) {
    const dungeon = DUNGEONS[dungeonKey];
    if (!dungeon) {
      throw new Error(`Unknown dungeon: ${dungeonKey}`);
    }

    const run = {
      dungeonKey,
      currentFloor: 1,
      state: "exploring", // exploring | boss | completed | failed
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
      progress: [], // optional: per-room logs, etc.
      openedChests: {}, // roomKey -> true
      clearedRooms: {}  // roomKey -> true
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

  getCurrentFloorConfig(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    if (!dungeon || dungeon.type === "endless") return null;

    // canonical: floors is a number, details live in floorsConfig
    const floorIndex = run.currentFloor;
    return (dungeon.floorsConfig && dungeon.floorsConfig[floorIndex]) || null;
  },

  /************************************************************
   * ROOM GENERATION
   ************************************************************/
  generateRoom(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    if (!dungeon) return null;

    if (dungeon.type === "endless") {
      return this.generateEndlessRoom(run);
    }

    // normal / labyrinth / great_dungeon share this path
    const floorConfig = this.getCurrentFloorConfig(run);
    const roll = Math.random();

    // basic distribution: 60% combat, 20% event, 20% treasure
    if (roll < 0.6 && floorConfig?.encounterTable) {
      return {
        type: "encounter",
        enemies: floorConfig.encounterTable,
        floorConfig
      };
    }

    if (roll < 0.8 && floorConfig?.events?.length) {
      return {
        type: "event",
        events: floorConfig.events,
        floorConfig
      };
    }

    return {
      type: "treasure",
      lootTable: floorConfig?.lootTable || null,
      floorConfig
    };
  },

  generateEndlessRoom(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    const floor = run.currentFloor;

    // Boss cadence
    if (dungeon.megaBossEvery && floor % dungeon.megaBossEvery === 0) {
      return { type: "boss", tier: "mega" };
    }
    if (dungeon.bossEvery && floor % dungeon.bossEvery === 0) {
      return { type: "boss", tier: "mini" };
    }

    const roll = Math.random();

    if (roll < 0.6 && dungeon.baseEncounterTable) {
      return {
        type: "encounter",
        enemies: dungeon.baseEncounterTable
      };
    }

    if (roll < 0.8) {
      return {
        type: "event",
        events: ["rift_anomaly"]
      };
    }

    return {
      type: "treasure",
      lootTable: dungeon.baseLootTable || null
    };
  },

  /************************************************************
   * ENCOUNTER ENEMY RESOLUTION (MULTI-ENEMY)
   ************************************************************/
  /**
   * Given a dungeon run and an "enemies" descriptor from generateRoom,
   * build an array of resolved enemy instances.
   *
   * Supports:
   * - array of enemy keys: ["goblin_scout", "goblin_scout", "goblin_shaman"]
   * - array of objects: [{ key, tier, count }, ...]
   * - single key or single object
   */
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

  /************************************************************
   * EVENTS
   ************************************************************/
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
        const [key, delta] = String(effect.value).split("+");
        const amount = parseFloat(delta);
        run.modifiers[key] = (run.modifiers[key] || 0) + amount;
        logs.push(`Dungeon shifts: ${key} increased by ${amount}.`);
        break;
      }
    }
  },

  /************************************************************
   * TREASURE
   ************************************************************/
  resolveTreasure(lootTableKey, run, logs) {
    if (!lootTableKey) {
      logs.push("You find an empty, dust‑covered chest.");
      return null;
    }

    const table = DUNGEON_LOOT_TABLES[lootTableKey];
    if (!table) {
      logs.push("You find a strange chest, but its contents are undefined.");
      return null;
    }

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

  /************************************************************
   * BOSS GENERATION
   ************************************************************/
  generateBoss(run, tierOverride = null) {
    const dungeon = DUNGEONS[run.dungeonKey];
    if (!dungeon) return null;

    const regionKey = dungeon.regionKey || dungeon.region || "forest";

    // Endless-style boss
    if (dungeon.type === "endless") {
      const tier = tierOverride || run.nextBossTier || "mini";
      const key =
        tier === "mega" ? dungeon.megaBossEnemyKey : dungeon.bossEnemyKey;

      if (!key) return null;

      const enemy = resolveEnemy(key, regionKey, 1);
      enemy.isDungeonBoss = true;
      enemy.dungeonKey = run.dungeonKey;

      if (this.isEndless(run)) {
        this.applyEndlessScaling(enemy, run);
      } else if (run.enemyScaling && run.enemyScaling !== 1.0) {
        this.applyScaling(enemy, run.enemyScaling);
      }

      return enemy;
    }

    // Normal / labyrinth / great_dungeon boss
    if (!dungeon.boss) {
      // Some dungeons may rely on external boss logic; return null here.
      return null;
    }

    const enemy = resolveEnemy(
      dungeon.boss.enemyKey,
      regionKey,
      dungeon.boss.tier || 1
    );
    enemy.isDungeonBoss = true;
    enemy.dungeonKey = run.dungeonKey;

    if (run.enemyScaling && run.enemyScaling !== 1.0) {
      this.applyScaling(enemy, run.enemyScaling);
    }

    return enemy;
  },

  /************************************************************
   * FLOOR / DUNGEON PROGRESSION
   ************************************************************/
  completeFloor(run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    if (!dungeon) return;

    if (dungeon.type === "endless") {
      run.currentFloor++;
      this.updateEndlessScore(run);
      run.state = "exploring";
      return;
    }

    run.currentFloor++;

    // For normal / labyrinth / great_dungeon, floors is a number
    if (run.currentFloor > dungeon.floors) {
      // Move to boss phase if dungeon has a boss, otherwise mark completed
      if (dungeon.boss || dungeon.bossEvery) {
        run.state = "boss";
      } else {
        this.completeDungeon(run);
      }
    } else {
      run.state = "exploring";
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

  /************************************************************
   * SCALING HELPERS
   ************************************************************/
  applyEndlessScaling(enemy, run) {
    const dungeon = DUNGEONS[run.dungeonKey];
    if (!dungeon || !dungeon.scaling) return enemy;

    const floor = run.currentFloor;

    const hpMult = Math.pow(dungeon.scaling.enemyHP || 1, floor - 1);
    const atkMult = Math.pow(dungeon.scaling.enemyATK || 1, floor - 1);

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
    if (!mult || mult === 1) return enemy;

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

  /************************************************************
   * PERSISTENCE
   ************************************************************/
  saveRun(player, run, username) {
    player.activeDungeonRun = run;
    PlayerStorage.save(username, player);
  }
};

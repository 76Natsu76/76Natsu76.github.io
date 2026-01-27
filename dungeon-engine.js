/************************************************************
 * dungeon-engine.js — Full Version
 ************************************************************/

import { DUNGEONS } from './dungeons.json';
import { DUNGEON_EVENTS } from './dungeon-events.json';
import { LOOT_TABLES } from './dungeon-loot-tables.json';

import { generateEncounter } from './encounter-generator.js';
import { resolveEnemy } from './resolveEnemy.js';
import { rollLootTable } from './loot-tables.js';

export const DungeonEngine = {
  startDungeon(player, dungeonKey) {
    const dungeon = DUNGEONS[dungeonKey];

    return {
      dungeonKey,
      currentFloor: 1,
      state: "exploring",
      modifiers: { ...dungeon.dungeonModifiers },
      completed: false,
      progress: []
    };
  },

  getCurrentFloor(state) {
    const dungeon = DUNGEONS[state.dungeonKey];
    return dungeon.floors[state.currentFloor - 1];
  },

  generateRoom(state) {
    const floor = this.getCurrentFloor(state);
    const roll = Math.random();

    if (roll < 0.6) {
      return { type: "encounter", enemies: floor.encounterTable };
    }
    if (roll < 0.8) {
      return { type: "event", events: floor.events };
    }
    return { type: "treasure", lootTable: floor.lootTable };
  },

  resolveEvent(eventKey, player, state, logs) {
    const event = DUNGEON_EVENTS[eventKey];

    logs.push(`Event: ${event.name}`);

    for (const effect of event.effects) {
      this.applyEventEffect(effect, player, state, logs);
    }
  },

  applyEventEffect(effect, player, state, logs) {
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
        player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + effect.value);
        logs.push(`You recover ${effect.value} HP.`);
        break;

      case "damage":
        player.hpCurrent = Math.max(0, player.hpCurrent - effect.value);
        logs.push(`You take ${effect.value} damage.`);
        break;

      case "modifier":
        // Example: "enemyScaling+0.1"
        const [key, delta] = effect.value.split("+");
        state.modifiers[key] += parseFloat(delta);
        logs.push(`Dungeon shifts: ${key} increased.`);
        break;
    }
  },

  resolveTreasure(lootTableKey, player, logs) {
    const loot = rollLootTable(LOOT_TABLES[lootTableKey]);
    logs.push(`You found: ${JSON.stringify(loot)}`);
    return loot;
  },

  generateBoss(state) {
    const dungeon = DUNGEONS[state.dungeonKey];
    return resolveEnemy(dungeon.boss.enemyKey);
  },

  completeFloor(state) {
    state.currentFloor++;
    const dungeon = DUNGEONS[state.dungeonKey];

    if (state.currentFloor > dungeon.floors.length) {
      state.state = "boss";
    }
  },

  completeDungeon(state) {
    state.completed = true;
    state.state = "completed";
  }
};

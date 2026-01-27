/************************************************************
 * dungeon-engine.js
 ************************************************************/

import { DUNGEONS } from './dungeons.json';
import { generateEncounter } from './encounter-generator.js';
import { resolveEnemy } from './resolveEnemy.js';
import { rollLootTable } from './loot-tables.js';

export const DungeonEngine = {
  startDungeon(player, dungeonKey) {
    const dungeon = DUNGEONS[dungeonKey];
    return {
      dungeonKey,
      currentFloor: 1,
      progress: [],
      completed: false,
      state: "exploring"
    };
  },

  getCurrentFloor(dungeonState) {
    const dungeon = DUNGEONS[dungeonState.dungeonKey];
    return dungeon.floors[dungeonState.currentFloor - 1];
  },

  generateRoom(dungeonState) {
    const floor = this.getCurrentFloor(dungeonState);

    const roll = Math.random();
    if (roll < 0.6) return { type: "encounter", data: floor.encounterTable };
    if (roll < 0.8) return { type: "event", data: floor.events };
    return { type: "treasure", data: floor.lootTable };
  },

  completeFloor(dungeonState) {
    dungeonState.currentFloor++;
    const dungeon = DUNGEONS[dungeonState.dungeonKey];

    if (dungeonState.currentFloor > dungeon.floors.length) {
      dungeonState.state = "boss";
    }
  },

  generateBoss(dungeonState) {
    const dungeon = DUNGEONS[dungeonState.dungeonKey];
    return resolveEnemy(dungeon.boss.enemyKey);
  },

  completeDungeon(dungeonState) {
    dungeonState.completed = true;
    dungeonState.state = "completed";
  }
};

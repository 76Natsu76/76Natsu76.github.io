/************************************************************
 * world-boss-engine.js
 ************************************************************/

import { WorldSim } from "./world-simulation.js";
import { rollLootTable } from "./loot-tables.js";
import { GuildEngine } from "./guild-engine.js";
import { saveRegionUnlocks } from "./region-unlocks.js";

export const WorldBossEngine = {
  activeBoss: null,

  spawnBoss(bossKey) {
    const WORLD_BOSSES = WorldSim._getBossData();
    const template = WORLD_BOSSES[bossKey];
    if (!template) return null;

    this.activeBoss = {
      key: bossKey,
      name: template.name,
      maxHP: template.maxHP,
      hp: template.maxHP,
      phaseIndex: 0,
      turnCount: 0,
      contributions: {},
      template
    };

    return this.activeBoss;
  },

  damageBoss(playerId, amount) {
    if (!this.activeBoss) return;

    const boss = this.activeBoss;
    boss.hp = Math.max(0, boss.hp - amount);
    boss.turnCount++;

    boss.contributions[playerId] =
      (boss.contributions[playerId] || 0) + amount;

    this.checkPhaseTransition();
    this.checkEnrage();

    if (boss.hp <= 0) {
      return this.handleBossDeath();
    }

    return boss;
  },

  checkPhaseTransition() {
    const boss = this.activeBoss;
    const template = boss.template;

    const hpPercent = boss.hp / boss.maxHP;
    const nextPhase = template.phases[boss.phaseIndex + 1];
    if (!nextPhase) return;

    if (hpPercent <= nextPhase.threshold) {
      boss.phaseIndex++;
    }
  },

  checkEnrage() {
    const boss = this.activeBoss;
    const template = boss.template;

    if (boss.turnCount >= template.enrage.turnLimit) {
      boss.enraged = true;
    }
  },

  handleBossDeath() {
    const boss = this.activeBoss;
    const template = boss.template;

    const regionKey = template.spawnRules.region;

    // Unlock region globally
    const unlocks = WorldSim._getRegionUnlocks();
    unlocks.unlocks[regionKey] = true;
    saveRegionUnlocks(unlocks);

    const loot = rollLootTable(template.lootTable);
    const contributions = boss.contributions;

    const sorted = Object.entries(contributions)
      .sort((a, b) => b[1] - a[1]);

    const rewards = {
      loot,
      contributions: sorted,
      unlockedRegion: regionKey
    };

    this.activeBoss = null;
    return rewards;
  }
};

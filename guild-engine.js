/************************************************************
 * guild-engine.js
 ************************************************************/

import { GUILDS } from './guilds.json';

export const GuildEngine = {
  createGuild(guildId, name) {
    GUILDS[guildId] = {
      name,
      createdAt: Date.now(),
      members: [],
      bank: { gold: 0, items: [] },
      buffs: [],
      achievements: [],
      worldBossProgress: null,
      events: { activeEvents: [], completedEvents: [] },
      pvp: { rating: 1000, wins: 0, losses: 0 }
    };
  },

  joinGuild(guildId, playerId) {
    const guild = GUILDS[guildId];
    guild.members.push({
      playerId,
      rank: "member",
      joinedAt: Date.now()
    });
  },

  leaveGuild(guildId, playerId) {
    const guild = GUILDS[guildId];
    guild.members = guild.members.filter(m => m.playerId !== playerId);
  },

  addGuildGold(guildId, amount) {
    GUILDS[guildId].bank.gold += amount;
  },

  addGuildItem(guildId, itemKey) {
    GUILDS[guildId].bank.items.push(itemKey);
  },

  startWorldBoss(guildId, bossKey, hp) {
    GUILDS[guildId].worldBossProgress = {
      bossKey,
      hpRemaining: hp,
      phase: 1
    };
  },

  damageWorldBoss(guildId, amount) {
    const boss = GUILDS[guildId].worldBossProgress;
    boss.hpRemaining = Math.max(0, boss.hpRemaining - amount);
  }
};

/************************************************************
 * guild-engine.js — Full Guild System
 ************************************************************/

import { GUILDS } from "./guilds.json";
// If you later persist to storage, you’ll replace these
// in-memory mutations with save/load helpers.

export const GuildEngine = {
  /***********************
   * Basic accessors
   ***********************/
  getGuild(guildId) {
    return GUILDS[guildId] || null;
  },

  getAllGuilds() {
    return GUILDS;
  },

  saveGuild(guild) {
    // In a real backend, this would persist to storage.
    // Here, we assume GUILDS is the canonical in-memory map.
    GUILDS[guild.id] = guild;
  },

  /***********************
   * Creation / deletion
   ***********************/
  createGuild(guildId, name, creatorPlayerId) {
    if (GUILDS[guildId]) {
      throw new Error(`Guild ${guildId} already exists`);
    }

    const now = Date.now();

    GUILDS[guildId] = {
      id: guildId,
      name,
      createdAt: now,
      members: [
        {
          playerId: creatorPlayerId,
          rank: "leader",
          joinedAt: now
        }
      ],
      bank: {
        gold: 0,
        items: []
      },
      buffs: [],
      achievements: [],
      worldBossProgress: null,
      events: {
        activeEvents: [],
        completedEvents: []
      },
      pvp: {
        rating: 1000,
        wins: 0,
        losses: 0
      }
    };

    return GUILDS[guildId];
  },

  deleteGuild(guildId) {
    if (!GUILDS[guildId]) return false;
    delete GUILDS[guildId];
    return true;
  },

  /***********************
   * Membership
   ***********************/
  joinGuild(guildId, playerId) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    if (guild.members.some(m => m.playerId === playerId)) {
      return guild;
    }

    guild.members.push({
      playerId,
      rank: "member",
      joinedAt: Date.now()
    });

    return guild;
  },

  leaveGuild(guildId, playerId) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    guild.members = guild.members.filter(m => m.playerId !== playerId);
    return guild;
  },

  setMemberRank(guildId, playerId, rank) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    const member = guild.members.find(m => m.playerId === playerId);
    if (!member) throw new Error(`Player ${playerId} not in guild`);

    member.rank = rank;
    return guild;
  },

  /***********************
   * Bank
   ***********************/
  addGuildGold(guildId, amount) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    guild.bank.gold = (guild.bank.gold || 0) + amount;
    return guild.bank.gold;
  },

  spendGuildGold(guildId, amount) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    const current = guild.bank.gold || 0;
    if (current < amount) return false;

    guild.bank.gold = current - amount;
    return true;
  },

  addGuildItem(guildId, itemKey, quantity = 1) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    const existing = guild.bank.items.find(i => i.itemKey === itemKey);
    if (existing) {
      existing.quantity += quantity;
    } else {
      guild.bank.items.push({ itemKey, quantity });
    }
    return guild.bank.items;
  },

  removeGuildItem(guildId, itemKey, quantity = 1) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    const existing = guild.bank.items.find(i => i.itemKey === itemKey);
    if (!existing) return false;

    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      guild.bank.items = guild.bank.items.filter(i => i.itemKey !== itemKey);
    }
    return true;
  },

  /***********************
   * Buffs & Achievements
   ***********************/
  addBuff(guildId, buffKey) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    if (!guild.buffs.includes(buffKey)) {
      guild.buffs.push(buffKey);
    }
    return guild.buffs;
  },

  removeBuff(guildId, buffKey) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    guild.buffs = guild.buffs.filter(b => b !== buffKey);
    return guild.buffs;
  },

  addAchievement(guildId, achievementKey) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    if (!guild.achievements.includes(achievementKey)) {
      guild.achievements.push(achievementKey);
    }
    return guild.achievements;
  },

  /***********************
   * World Boss Progress
   ***********************/
  startWorldBoss(guildId, bossKey, totalHp) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    guild.worldBossProgress = {
      bossKey,
      hpRemaining: totalHp,
      phase: 1
    };
    return guild.worldBossProgress;
  },

  damageWorldBoss(guildId, amount) {
    const guild = this.getGuild(guildId);
    if (!guild || !guild.worldBossProgress) return null;

    const boss = guild.worldBossProgress;
    boss.hpRemaining = Math.max(0, boss.hpRemaining - amount);

    if (boss.hpRemaining === 0) {
      // Hook rewards / achievements here if desired
    }

    return boss;
  },

  setWorldBossPhase(guildId, phase) {
    const guild = this.getGuild(guildId);
    if (!guild || !guild.worldBossProgress) return null;

    guild.worldBossProgress.phase = phase;
    return guild.worldBossProgress;
  },

  clearWorldBoss(guildId) {
    const guild = this.getGuild(guildId);
    if (!guild) return null;

    guild.worldBossProgress = null;
    return guild;
  },

  /***********************
   * Events
   ***********************/
  addActiveEvent(guildId, eventKey) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    if (!guild.events.activeEvents.includes(eventKey)) {
      guild.events.activeEvents.push(eventKey);
    }
    return guild.events.activeEvents;
  },

  completeEvent(guildId, eventKey) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    guild.events.activeEvents = guild.events.activeEvents.filter(e => e !== eventKey);
    if (!guild.events.completedEvents.includes(eventKey)) {
      guild.events.completedEvents.push(eventKey);
    }
    return guild.events;
  },

  /***********************
   * PvP Rating Hooks
   ***********************/
  recordPvPResult(guildId, result) {
    const guild = this.getGuild(guildId);
    if (!guild) throw new Error(`Guild ${guildId} not found`);

    if (result === "win") guild.pvp.wins++;
    if (result === "loss") guild.pvp.losses++;
    // rating itself is updated by ArenaEngine
    return guild.pvp;
  }
};

/************************************************************
 * guild-raid-engine.js
 ************************************************************/

import { GUILD_RAIDS } from "./guild-raid-templates.json";

export const GuildRaidEngine = {
  getRaid(key) {
    return GUILD_RAIDS[key] || null;
  },

  getAllRaids() {
    return GUILD_RAIDS;
  },

  canEnterRaid(guild, raidKey) {
    const raid = this.getRaid(raidKey);
    if (!raid) return { ok: false, reason: "Unknown raid." };

    if ((guild.level || 1) < (raid.minGuildLevel || 1)) {
      return { ok: false, reason: `Requires guild level ${raid.minGuildLevel}.` };
    }

    const now = Date.now();
    const last = guild.raidLockouts?.[raidKey] || 0;
    const lockoutMs = (raid.lockoutHours || 0) * 60 * 60 * 1000;

    if (now - last < lockoutMs) {
      const remaining = Math.ceil((lockoutMs - (now - last)) / (60 * 60 * 1000));
      return { ok: false, reason: `Raid locked. Try again in ~${remaining}h.` };
    }

    return { ok: true, reason: "Raid available." };
  },

  startRaid(guild, raidKey) {
    const raid = this.getRaid(raidKey);
    if (!raid) return { ok: false, reason: "Unknown raid." };

    const check = this.canEnterRaid(guild, raidKey);
    if (!check.ok) return check;

    guild.activeRaid = {
      key: raidKey,
      bossIndex: 0,
      progress: []
    };

    return { ok: true, raid: guild.activeRaid };
  },

  getCurrentBoss(guild) {
    if (!guild.activeRaid) return null;
    const raid = this.getRaid(guild.activeRaid.key);
    if (!raid) return null;
    return raid.bosses[guild.activeRaid.bossIndex] || null;
  },

  markBossDefeated(guild) {
    if (!guild.activeRaid) return { ok: false, reason: "No active raid." };

    const raid = this.getRaid(guild.activeRaid.key);
    if (!raid) return { ok: false, reason: "Raid missing." };

    const idx = guild.activeRaid.bossIndex;
    guild.activeRaid.progress.push(raid.bosses[idx].key);
    guild.activeRaid.bossIndex++;

    if (guild.activeRaid.bossIndex >= raid.bosses.length) {
      // Raid complete
      const rewards = this._grantRaidRewards(guild, raid);
      const raidKey = guild.activeRaid.key;

      guild.raidLockouts = guild.raidLockouts || {};
      guild.raidLockouts[raidKey] = Date.now();

      guild.activeRaid = null;

      return { ok: true, complete: true, rewards };
    }

    return { ok: true, complete: false };
  },

  _grantRaidRewards(guild, raid) {
    guild.level = (guild.level || 1) + Math.floor((raid.rewards.guildXp || 0) / 500);
    guild.currency = (guild.currency || 0) + (raid.rewards.guildCurrency || 0);

    guild.raidHistory = guild.raidHistory || [];
    guild.raidHistory.push({
      key: raid.name,
      timestamp: Date.now()
    });

    return raid.rewards;
  }
};

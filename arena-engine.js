/************************************************************
 * arena-engine.js
 ************************************************************/

import { ARENA_CONFIG } from './arena.json';
import { GuildEngine } from './guild-engine.js';
import { getPlayerById, savePlayer } from './player-registry.js';
import { runPvPCombat } from './combat-engine.js'; // you’ll wire this
import { api } from "./api.js";

const queues = {}; // { modeKey: [ { playerId, guildId, joinedAt } ] }

export const ArenaEngine = {
  queuePlayer(modeKey, playerId, guildId = null) {
    if (!queues[modeKey]) queues[modeKey] = [];
    queues[modeKey].push({ playerId, guildId, joinedAt: Date.now() });
  },

  dequeuePlayer(modeKey, playerId) {
    if (!queues[modeKey]) return;
    queues[modeKey] = queues[modeKey].filter(q => q.playerId !== playerId);
  },

  tryMatchmake(modeKey, logs = []) {
    const mode = ARENA_CONFIG.modes[modeKey];
    if (!mode) return null;

    const queue = queues[modeKey] || [];
    const needed = mode.teamSize * 2;
    if (queue.length < needed) return null;

    const players = queue.splice(0, needed);
    const teamA = players.slice(0, mode.teamSize);
    const teamB = players.slice(mode.teamSize, needed);

    logs.push(`Arena match created: ${mode.name}`);

    return {
      modeKey,
      teamA,
      teamB,
      createdAt: Date.now()
    };
  },

  async runMatch(match, logs = []) {
    const mode = ARENA_CONFIG.modes[match.modeKey];

    const teamAPlayers = match.teamA.map(p => getPlayerById(p.playerId));
    const teamBPlayers = match.teamB.map(p => getPlayerById(p.playerId));

    const result = await runPvPCombat(teamAPlayers, teamBPlayers, { mode }, logs);
    // result: { winner: "A" | "B" | "draw" }

    this.applyResults(mode, match, result, logs);

    return result;
  },

  applyResults(mode, match, result, logs) {
    const isGuildMode = mode.ratingType === 'guild';

    const winners = result.winner === 'A' ? match.teamA
                  : result.winner === 'B' ? match.teamB
                  : [];
    const losers  = result.winner === 'A' ? match.teamB
                  : result.winner === 'B' ? match.teamA
                  : [];

    if (isGuildMode) {
      this.updateGuildRatings(winners, losers, result);
    } else {
      this.updateSoloRatings(winners, losers, result);
    }

    this.applyRewards(mode, winners, losers, result, logs);
  },

  updateSoloRatings(winners, losers, result) {
    const k = 24;

    const all = [...winners, ...losers];
    const players = all.map(p => getPlayerById(p.playerId));

    const avgWinnerRating = average(players.filter(p =>
      winners.some(w => w.playerId === p.id)
    ).map(p => p.arenaRating ?? 1000));

    const avgLoserRating = average(players.filter(p =>
      losers.some(l => l.playerId === p.id)
    ).map(p => p.arenaRating ?? 1000));

    const expectedWin = 1 / (1 + Math.pow(10, (avgLoserRating - avgWinnerRating) / 400));

    for (const p of players) {
      const isWinner = winners.some(w => w.playerId === p.id);
      const isLoser  = losers.some(l => l.playerId === p.id);

      const current = p.arenaRating ?? 1000;
      let score = 0.5;
      if (isWinner) score = 1;
      if (isLoser) score = 0;

      const newRating = Math.round(current + k * (score - expectedWin));
      p.arenaRating = newRating;
      api.savePlayer(player.id, player);
    }
  },

  updateGuildRatings(winners, losers, result) {
    const k = 32;

    const winnerGuildIds = [...new Set(winners.map(w => w.guildId).filter(Boolean))];
    const loserGuildIds  = [...new Set(losers.map(l => l.guildId).filter(Boolean))];

    if (winnerGuildIds.length === 0 || loserGuildIds.length === 0) return;

    const winnerGuild = GuildEngine.getGuild(winnerGuildIds[0]);
    const loserGuild  = GuildEngine.getGuild(loserGuildIds[0]);

    const rW = winnerGuild.pvp.rating ?? 1000;
    const rL = loserGuild.pvp.rating ?? 1000;

    const expectedWin = 1 / (1 + Math.pow(10, (rL - rW) / 400));

    const newWinnerRating = Math.round(rW + k * (1 - expectedWin));
    const newLoserRating  = Math.round(rL + k * (0 - (1 - expectedWin)));

    winnerGuild.pvp.rating = newWinnerRating;
    loserGuild.pvp.rating = newLoserRating;

    GuildEngine.saveGuild(winnerGuild);
    GuildEngine.saveGuild(loserGuild);
  },

  applyRewards(mode, winners, losers, result, logs) {
    const winReward = mode.rewards.win;
    const lossReward = mode.rewards.loss;

    const giveReward = (entry, reward) => {
      const player = getPlayerById(entry.playerId);
      if (!player) return;

      player.gold = (player.gold ?? 0) + (reward.gold ?? 0);
      player.xp = (player.xp ?? 0) + (reward.xp ?? 0);
      // items would be added via your inventory system

      api.savePlayer(player.id, player);
    };

    if (result.winner === 'A' || result.winner === 'B') {
      for (const w of winners) giveReward(w, winReward);
      for (const l of losers) giveReward(l, lossReward);
      logs.push(`Arena result: ${result.winner === 'A' ? 'Team A' : 'Team B'} wins.`);
    } else {
      // draw: both sides get lossReward (or a special draw reward if you want)
      for (const w of winners) giveReward(w, lossReward);
      for (const l of losers) giveReward(l, lossReward);
      logs.push(`Arena result: Draw.`);
    }
  }
};

resetSeason() {
  const season = ARENA_CONFIG.seasons.currentSeason;
  const cfg = ARENA_CONFIG.seasons.seasonConfig[season];

  const resetTo = cfg.ratingResetTo ?? 1000;

  // Reset all players
  for (const p of getAllPlayers()) {
    p.arenaRating = resetTo;
    api.savePlayer(player.id, player);
  }

  // Reset all guilds
  for (const g of Object.values(GUILDS)) {
    g.pvp.rating = resetTo;
    g.pvp.wins = 0;
    g.pvp.losses = 0;
  }

  // Advance season
  ARENA_CONFIG.seasons.currentSeason++;
}

/************************************************************
 * Helpers
 ************************************************************/

function average(arr) {
  if (!arr.length) return 1000;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

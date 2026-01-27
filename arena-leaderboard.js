/************************************************************
 * arena-leaderboard.js
 ************************************************************/

import { getAllPlayers } from './player-registry.js';
import { GUILDS } from './guilds.json';

export const ArenaLeaderboard = {
  getSoloTop(limit = 20) {
    return getAllPlayers()
      .sort((a, b) => (b.arenaRating ?? 1000) - (a.arenaRating ?? 1000))
      .slice(0, limit);
  },

  getGuildTop(limit = 20) {
    return Object.values(GUILDS)
      .sort((a, b) => (b.pvp.rating ?? 1000) - (a.pvp.rating ?? 1000))
      .slice(0, limit);
  }
};

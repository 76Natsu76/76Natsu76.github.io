/************************************************************
 * arena-history.js
 ************************************************************/

export const ArenaHistory = {
  matches: [],

  recordMatch(match) {
    this.matches.push({
      modeKey: match.modeKey,
      teamA: match.teamA.map(p => p.playerId),
      teamB: match.teamB.map(p => p.playerId),
      winner: match.result.winner,
      timestamp: Date.now()
    });
  },

  getRecentMatches(limit = 20) {
    return this.matches.slice(-limit).reverse();
  }
};

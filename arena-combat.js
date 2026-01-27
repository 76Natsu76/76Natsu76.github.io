/************************************************************
 * arena-combat.js — PvP Combat Wrapper
 ************************************************************/

import { runCombat } from './combat-engine.js';

export async function runPvPCombat(teamA, teamB, context, logs = []) {
  const pvpContext = {
    ...context,
    isPvP: true,
    worldModifiersDisabled: true,
    dungeonModifiersDisabled: true,
    weatherDisabled: true,
    biomeDisabled: true
  };

  const result = await runCombat(teamA, teamB, pvpContext, logs);

  // Normalize result
  if (result.winner === 'teamA') return { winner: 'A' };
  if (result.winner === 'teamB') return { winner: 'B' };
  return { winner: 'draw' };
}

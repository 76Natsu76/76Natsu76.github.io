// crime-system.js
import { PlayerStorage } from "./player-storage.js";
import { adjustReputation } from "./reputation-utils.js";
import { getWorldState } from "./world-state.js";
import { SETTLEMENTS } from "./settlement-definitions.js";

/* ---------------------------------------------------------
   CRIME TYPES
--------------------------------------------------------- */
export const CRIME_TYPES = {
  THEFT: "theft",
  ASSAULT: "assault",
  MURDER: "murder",
  FRAUD: "fraud",
  TRESPASS: "trespass"
};

/* ---------------------------------------------------------
   REPORT CRIME
--------------------------------------------------------- */
export function reportCrime(player, settlementKey, crimeType, severity = 1) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];

  if (!settlement) return;

  // Initialize bounty
  player.bounty = player.bounty || {};
  player.bounty[settlementKey] = player.bounty[settlementKey] || 0;

  // Reputation penalty
  const repPenalty = -10 * severity;
  adjustReputation(player, settlementKey, repPenalty);

  // Bounty increase
  const bountyIncrease = 25 * severity;
  player.bounty[settlementKey] += bountyIncrease;

  // Settlement hostility
  settlement.hostility = settlement.hostility || 0;
  settlement.hostility += severity * 0.1;

  // Crisis trigger (unrest)
  if (settlement.hostility > 1.0 && !settlement.crisis) {
    settlement.crisis = "unrest";
    settlement.crisisStage = 0;
    settlement.crisisStartedAt = Date.now();
  }

  // Log event
  settlement.history.push({
    timestamp: Date.now(),
    type: "crime",
    message: `${player.username} committed ${crimeType} (severity ${severity}).`
  });

  PlayerStorage.save(player.username, player);
}

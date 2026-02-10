// quest-complete.js
import { PlayerStorage } from "./player-storage.js";
import { QUEST_TEMPLATES } from "./quest-definitions.js";

export function completeQuest(player, questKey, settlementKey) {
  const q = QUEST_TEMPLATES[questKey];
  if (!q) return { ok: false, reason: "Unknown quest" };

  // Remove from active
  player.quests.active = player.quests.active.filter(k => k !== questKey);

  // Add to completed
  player.quests.completed.push(questKey);

  // Apply rewards
  if (q.rewards?.gold) player.gold += q.rewards.gold;
  if (q.rewards?.xp) player.xp += q.rewards.xp;

  // Reputation reward (with caps)
  applyReputationReward(player, settlementKey, q);

  PlayerStorage.save(player.username, player);
  return { ok: true };
}

/* ---------------------------------------------------------
   REPUTATION REWARD LOGIC
--------------------------------------------------------- */
function applyReputationReward(player, settlementKey, quest) {
  player.reputation = player.reputation || {};

  const current = player.reputation[settlementKey] || 0;
  const repGain = quest.rewards?.reputation || 0;

  // Reputation cap per quest tier
  const cap = quest.repCap || 100; // default cap

  if (current >= cap) return; // no more rep from this quest tier

  const newRep = Math.min(current + repGain, cap);
  player.reputation[settlementKey] = newRep;
}

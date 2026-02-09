// quest-accept.js

import { QUEST_TEMPLATES } from "./quest-definitions.js";

export function acceptQuest(player, npc, settlementKey, regionKey, templateKey) {
  const template = QUEST_TEMPLATES[templateKey];
  if (!template) return null;

  const quest = {
    id: crypto.randomUUID(),
    template: templateKey,
    npc: npc.id,
    settlement: settlementKey,
    region: regionKey,
    progress: {},
    status: "active",
    startedAt: Date.now()
  };

  player.quests.active.push(quest);
  return quest;
}

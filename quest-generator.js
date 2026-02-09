// quest-generator.js

import { QUEST_TEMPLATES } from "./quest-definitions.js";

export function generateQuestForNPC(npc, player, regionState) {
  const options = [];

  for (const key in QUEST_TEMPLATES) {
    const q = QUEST_TEMPLATES[key];

    // Level gating
    if (player.level < (q.minLevel ?? 1)) continue;
    if (player.level > (q.maxLevel ?? 999)) continue;

    // Crisis gating
    if (q.requiresCrisis && !regionState.crisis) continue;

    // Boss awakening gating
    if (q.requiresBossAwakening && !regionState.worldBossAwakening) continue;

    // Role-based weighting
    if (npc.role === "scout" && q.type === "hunt") options.push(key);
    else if (npc.role === "craftsman" && q.type === "gather") options.push(key);
    else if (npc.role === "civilian") options.push(key);
  }

  if (!options.length) return null;

  const chosen = options[Math.floor(Math.random() * options.length)];
  return chosen;
}

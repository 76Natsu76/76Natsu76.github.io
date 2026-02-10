// npc-dialogue.js
import { SETTLEMENTS } from "./settlement-definitions.js";
import { getWorldState } from "./world-state.js";
import { NPC_TEMPLATES } from "./npc-definitions.js";

/* ---------------------------------------------------------
   MAIN ENTRY POINT
--------------------------------------------------------- */
export function getNPCDialogue(npc, region, player = null) {
  const template = NPC_TEMPLATES[npc.template] || null;
  if (!template) return "…";

  // 1. Crisis dialogue
  if (region?.crisis) {
     const crisisLines = template.dialogue?.crisis;
     if (crisisLines?.length) return pick(crisisLines);
  }
   if (settlement?.crisis) {
      const crisisLines = template.dialogue?.crisis;
      if (crisisLines?.length) return pick(crisisLines);
   }

  // 2. Boss awakened
  if (region?.worldBossActive && region?.worldBossAwakening) {
    const bossLines = template.dialogue?.bossAwakened;
    if (bossLines?.length) return pick(bossLines);
  }

  // 3. Boss defeated
  if (region?.worldBossDefeated) {
    const bossDefeated = template.dialogue?.bossDefeated;
    if (bossDefeated?.length) return pick(bossDefeated);
  }

  // 4. Reputation-based flavor (Phase 3)
  if (player) {
    const rep = player.reputation?.[region.key] || 0;
    const repLine = reputationLine(rep, npc);
    if (repLine) return repLine;
  }

  // 5. Seasonal flavor
  const seasonLine = seasonalLine();
  if (seasonLine) return seasonLine;

  // 6. Idle dialogue
  const idle = template.dialogue?.idle;
  if (idle?.length) return pick(idle);

  return "…";
}

/* ---------------------------------------------------------
   REPUTATION FLAVOR (Phase 3 integration)
--------------------------------------------------------- */
function reputationLine(rep, npc) {
  if (player) {
     const rep = player.reputation?.[region.key] || 0;
     
     if (rep >= 2000) {
       return `${npc.name} looks with stars in their eyes. "It is an honor to meet you, Hero!"`;
     }
     if (rep >= 250) {
       return `${npc.name} smiles warmly. "You're a true friend to our people."`;
     }
     if (rep >= 100) {
       return `${npc.name} nods. "Good to see you again."`;
     }
     if (rep < 0) {
       return `${npc.name} eyes you suspiciously. "Watch yourself."`;
     }
     if (rep < -50) {
       return `${npc.name} glares at you. "You shouldn't be here."`;
     }
   }
  return null;
}

/* ---------------------------------------------------------
   SEASONAL FLAVOR
--------------------------------------------------------- */
function seasonalLine() {
  const world = getWorldState();
  const season = world.season;

  const lines = {
    spring: [
      "The air feels fresh today.",
      "Spring always brings hope."
    ],
    summer: [
      "Hot day, isn't it?",
      "Summer nights are the best."
    ],
    autumn: [
      "The leaves are turning again.",
      "Autumn winds carry strange whispers."
    ],
    winter: [
      "Cold enough to freeze your bones.",
      "Winter spirits roam these nights."
    ]
  };

  const arr = lines[season];
  if (!arr) return null;
  return pick(arr);
}

/* ---------------------------------------------------------
   UTILITY
--------------------------------------------------------- */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

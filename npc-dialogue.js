// npc-dialogue.js
import { SETTLEMENTS } from "./settlement-definitions.js";
import { getWorldState } from "./world-state.js";
import { NPC_TEMPLATES } from "./npc-definitions.js";
import { NPC_REACTIONS } from "./npc-reactions.js";
import { NPC_WORLDSTATE_REACTIONS } from "./npc-worldstate.js";

/* ---------------------------------------------------------
   MAIN ENTRY POINT
--------------------------------------------------------- */
export function getNPCDialogue(npc, region, player = null) {
  const template = NPC_TEMPLATES[npc.template] || null;
  if (!template) return "…";

  const world = getWorldState();
  const settlement = SETTLEMENTS[npc.settlementId] || null;

  const lines = [];

  /* ---------------------------------------------------------
     1. Crisis dialogue (region or settlement)
  --------------------------------------------------------- */
  if (region?.crisis || settlement?.crisis) {
    const crisisLines = template.dialogue?.crisis;
    if (crisisLines?.length) return pick(crisisLines);
  }

  /* ---------------------------------------------------------
     2. Boss awakened
  --------------------------------------------------------- */
  if (region?.worldBossActive && region?.worldBossAwakening) {
    const bossLines = template.dialogue?.bossAwakened;
    if (bossLines?.length) return pick(bossLines);
  }

  /* ---------------------------------------------------------
     3. Boss defeated
  --------------------------------------------------------- */
  if (region?.worldBossDefeated) {
    const bossDefeated = template.dialogue?.bossDefeated;
    if (bossDefeated?.length) return pick(bossDefeated);
  }

  /* ---------------------------------------------------------
     4. Identity-aware reactions (Phase F11)
  --------------------------------------------------------- */
  if (player?.lastIdentityKill) {
    const id = player.lastIdentityKill;
    const reactionPool = NPC_REACTIONS[id];
    if (reactionPool?.length) {
      const reaction = pick(reactionPool);
      lines.push(reaction);
    }
  }

  /* ---------------------------------------------------------
     5. World-state reactions (Phase F11)
  --------------------------------------------------------- */
  if (region?.crisis && NPC_WORLDSTATE_REACTIONS.crisis[region.crisis]) {
    lines.push(NPC_WORLDSTATE_REACTIONS.crisis[region.crisis]);
  }

  if (world.anomaly && NPC_WORLDSTATE_REACTIONS.anomaly[world.anomaly]) {
    lines.push(NPC_WORLDSTATE_REACTIONS.anomaly[world.anomaly]);
  }

  if (world.migration && NPC_WORLDSTATE_REACTIONS.migration[world.migration]) {
    lines.push(NPC_WORLDSTATE_REACTIONS.migration[world.migration]);
  }

  /* ---------------------------------------------------------
     6. Reputation-based flavor
  --------------------------------------------------------- */
  if (player) {
    const repLine = reputationLine(player, region, npc);
    if (repLine) return repLine;
  }

  /* ---------------------------------------------------------
     7. Bounty warning
  --------------------------------------------------------- */
  if (player?.bounty?.[region.key] > 0) {
    return `${npc.name} whispers: "The guards are looking for you."`;
  }

  /* ---------------------------------------------------------
     8. Seasonal flavor
  --------------------------------------------------------- */
  const seasonLine = seasonalLine();
  if (seasonLine) lines.push(seasonLine);

  /* ---------------------------------------------------------
     9. Royal Courtier special logic
  --------------------------------------------------------- */
  if (npc.template === "royal_courtier" && player) {
    const rep = player.reputation?.[region.key] || 0;

    if (rep >= 2000) {
      const high = template.dialogue?.highReputation;
      if (high?.length) return pick(high);
    }

    const active = player.quests?.active || [];

    if (active.includes("royal_intro")) {
      return pick(template.dialogue.royalQuestline.intro);
    }
    if (active.includes("royal_trial")) {
      return pick(template.dialogue.royalQuestline.trial);
    }
    if (active.includes("royal_oath")) {
      return pick(template.dialogue.royalQuestline.oath);
    }
  }

  /* ---------------------------------------------------------
     10. Idle dialogue fallback
  --------------------------------------------------------- */
  const idle = template.dialogue?.idle;
  if (idle?.length) lines.push(pick(idle));

  return lines.length ? pick(lines) : "…";
}

/* ---------------------------------------------------------
   REPUTATION FLAVOR
--------------------------------------------------------- */
function reputationLine(player, region, npc) {
  const rep = player.reputation?.[region.key] || 0;

  if (rep >= 2000) {
    return `${npc.name} looks at you with awe. "It is an honor to meet you, Hero."`;
  }
  if (rep >= 250) {
    return `${npc.name} smiles warmly. "You're a true friend to our people."`;
  }
  if (rep >= 100) {
    return `${npc.name} nods. "Good to see you again."`;
  }
  if (rep < -50) {
    return `${npc.name} glares. "You shouldn't be here."`;
  }
  if (rep < 0) {
    return `${npc.name} eyes you suspiciously. "Watch yourself."`;
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
      "Hot day, isn't it.",
      "Summer nights carry strange warmth."
    ],
    autumn: [
      "The leaves are turning again.",
      "Autumn winds carry whispers."
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

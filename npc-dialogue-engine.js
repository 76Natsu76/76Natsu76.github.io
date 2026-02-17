import { NPC_PROFILES } from "../data/npcs/npc-profiles.js";
import { NPC_REACTIONS } from "../data/npcs/npc-reactions.js";
import { NPC_DIALOGUE } from "../data/npcs/npc-dialogue.js";
import { NPC_WORLDSTATE_REACTIONS } from "../data/npcs/npc-worldstate.js";

export function getNPCDialogue(npcId, player, context) {
  const profile = NPC_PROFILES[npcId];
  const dialogue = NPC_DIALOGUE[npcId];

  const lines = [];

  // Greeting
  lines.push(random(dialogue.greeting));

  // Identity reaction
  const lastIdentity = player.lastIdentityKill || null;
  if (lastIdentity && profile.reactsTo.includes(lastIdentity)) {
    const reaction = random(NPC_REACTIONS[lastIdentity]);
    lines.push(dialogue.identityReaction.replace("{reaction}", reaction));
  }

  // World-state reaction
  if (context.crisis && NPC_WORLDSTATE_REACTIONS.crisis[context.crisis]) {
    lines.push(NPC_WORLDSTATE_REACTIONS.crisis[context.crisis]);
  }

  if (context.anomalyKey && NPC_WORLDSTATE_REACTIONS.anomaly[context.anomalyKey]) {
    lines.push(NPC_WORLDSTATE_REACTIONS.anomaly[context.anomalyKey]);
  }

  if (context.migrationKey && NPC_WORLDSTATE_REACTIONS.migration[context.migrationKey]) {
    lines.push(NPC_WORLDSTATE_REACTIONS.migration[context.migrationKey]);
  }

  return lines;
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

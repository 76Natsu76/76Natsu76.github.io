// npc-generator.js

import { NPC_TEMPLATES } from "./npc-definitions.js";

export function generateNPC(templateKey) {
  const def = NPC_TEMPLATES[templateKey];
  if (!def) return null;

  const name = pick(def.namePool);
  const personality = pick(def.personalityPool);

  return {
    id: crypto.randomUUID(),
    name,
    personality,
    template: templateKey,
    role: def.role,
    mood: 1.0,
    lastUpdated: Date.now()
  };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

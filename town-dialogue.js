// town-dialogue.js
import { getWorldState } from "./world-state.js";
import { SETTLEMENTS } from "./settlement-definitions.js";
import { getNPCDialogue } from "./npc-dialogue.js"; // must exist

/* ---------------------------------------------------------
   RENDER NPC LIST
--------------------------------------------------------- */
export function renderNPCList(settlementKey, player) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  if (!settlement) return;

  const out = settlement.npcs.map(npc => `
    <div class="npc-entry">
      <strong>${npc.name}</strong> (${npc.role})
      <button class="btn" data-npc-id="${npc.id}" data-town="${settlementKey}">
        Talk
      </button>
    </div>
  `).join("");

  const box = document.getElementById("npcList");
  if (box) box.innerHTML = out;

  // Attach handlers
  box.querySelectorAll("button[data-npc-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const npcId = btn.getAttribute("data-npc-id");
      openNPCDialogue(settlementKey, npcId, player);
    });
  });
}

/* ---------------------------------------------------------
   OPEN DIALOGUE PANEL
--------------------------------------------------------- */
export function openNPCDialogue(settlementKey, npcId, player) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  if (!settlement) return;

  const npc = settlement.npcs.find(n => n.id === npcId);
  if (!npc) return;

  const region = world.regions[SETTLEMENTS[settlementKey].region];
  const line = getNPCDialogue(npc, region, player);

  const panel = document.getElementById("npcDialoguePanel");
  if (!panel) return;

  panel.innerHTML = `
    <div class="npc-dialogue-box">
      <h3>${npc.name}</h3>
      <p>"${line}"</p>
    </div>
  `;
}

// interior-renderer.js
import { searchBuildingForLoot } from "./building-loot.js";

export function renderInterior(settlementKey, buildingDef, buildingState, player) {
  const panel = document.getElementById("npcDialoguePanel") || document.getElementById("townContent");
  if (!panel) return;

  panel.innerHTML = `
    <div class="section">
      <h2>${buildingDef.name}</h2>
      <p>Interior of ${buildingDef.name} (placeholder).</p>
      <button class="btn" id="searchBuildingBtn">Search</button>
      <button class="btn" id="exitBuildingBtn">Exit</button>
    </div>
  `;

  if (buildingDef.interiorId === "throne_room_interior") {
    return renderThroneRoom(panel, player);
  }

  // Default interior
  panel.innerHTML = `
    <div class="section">
      <h2>${buildingDef.name}</h2>
      <p>Interior of ${buildingDef.name} (placeholder).</p>
      <button class="btn" id="exitBuildingBtn">Exit</button>
    </div>
  `;

  document.getElementById("exitBuildingBtn").onclick = () => {
    panel.innerHTML = "";
  };

  const searchBtn = document.getElementById("searchBuildingBtn");
  const exitBtn = document.getElementById("exitBuildingBtn");

  if (searchBtn) {
    searchBtn.onclick = () => {
      const result = searchBuildingForLoot(player, settlementKey, buildingDef, buildingState);
    
      if (!result.ok) {
        alert(result.reason);
        return;
      }
    
      if (result.loot.length === 0) {
        alert("You found nothing.");
      } else {
        alert("You found: " + result.loot.map(i => i.name).join(", "));
      }
    };
  }

  if (exitBtn) {
    exitBtn.onclick = () => {
      // For now just clear interior
      panel.innerHTML = "";
    };
  }

  function renderThroneRoom(panel, player) {
  panel.innerHTML = `
    <div class="section">
      <h2>Throne Room</h2>
      <p>The air is heavy with authority. Guards stand at attention.</p>

      <div class="royal-npc">
        <strong>King Aldren IV</strong>
        <p>"Welcome, ${player.username}. The Crown has been expecting you."</p>
      </div>

      <div class="royal-npc">
        <strong>Royal Advisor</strong>
        <p>"Your reputation precedes you."</p>
      </div>

      <button class="btn" id="speakKingBtn">Speak to the King</button>
      <button class="btn" id="exitBuildingBtn">Exit</button>
    </div>
  `;

  document.getElementById("speakKingBtn").onclick = () => {
    alert("The King discusses matters of the realm with you.");
  };

  document.getElementById("exitBuildingBtn").onclick = () => {
    panel.innerHTML = "";
  };
}

}

// interior-renderer.js

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

  const searchBtn = document.getElementById("searchBuildingBtn");
  const exitBtn = document.getElementById("exitBuildingBtn");

  if (searchBtn) {
    searchBtn.onclick = () => {
      // You’ll wire this to searchBuilding() later
      alert("You search the room (placeholder).");
    };
  }

  if (exitBtn) {
    exitBtn.onclick = () => {
      // For now just clear interior
      panel.innerHTML = "";
    };
  }
}

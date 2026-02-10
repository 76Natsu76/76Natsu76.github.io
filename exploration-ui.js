// exploration-ui.js
import { moveToNode, getNode } from "./exploration-engine.js";

export function renderExplorationUI(player) {
  const panel = document.getElementById("explorationPanel");
  const node = getNode(player.location);

  panel.innerHTML = `
    <div class="section">
      <h2>${node.name}</h2>
      <p>${node.description}</p>

      <h3>Exits</h3>
      ${Object.entries(node.exits).map(([dir, dest]) => `
        <button class="btn" data-move="${dest}">${dir}</button>
      `).join("")}
    </div>
  `;

  panel.querySelectorAll("button[data-move]").forEach(btn => {
    btn.onclick = () => {
      const dest = btn.getAttribute("data-move");
      moveToNode(player, dest);
      renderExplorationUI(player);
    };
  });
}

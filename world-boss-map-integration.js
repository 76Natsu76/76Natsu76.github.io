/************************************************************
 * world-boss-map-integration.js
 * ----------------------------------------------------------
 * Integrates world boss state into world-map.html
 ************************************************************/

import { WorldSim } from "./world-simulation.js";
import { WORLD_BOSSES } from "./world-boss-templates.json";

export const WorldBossMap = {
  init() {
    this.renderBossMarkers();
  },

  renderBossMarkers() {
    const state = WorldSim.getState();

    for (const regionKey in state) {
      const regionState = state[regionKey];
      const boss = regionState.worldBoss;

      const marker = document.getElementById(`region-${regionKey}-marker`);
      if (!marker) continue;

      if (boss && boss.active) {
        const template = WORLD_BOSSES[boss.key];

        marker.classList.add("worldboss-active");
        marker.setAttribute("data-boss", template.name);
        marker.setAttribute("data-hp", `${boss.hp}/${boss.maxHP}`);

        marker.onclick = () => {
          this.showBossPopup(regionKey, boss, template);
        };
      } else {
        marker.classList.remove("worldboss-active");
        marker.removeAttribute("data-boss");
        marker.removeAttribute("data-hp");
        marker.onclick = null;
      }
    }
  },

  showBossPopup(regionKey, boss, template) {
    const popup = document.getElementById("worldboss-popup");
    popup.innerHTML = `
      <h2>${template.name}</h2>
      <p><strong>Region:</strong> ${regionKey}</p>
      <p><strong>HP:</strong> ${boss.hp} / ${boss.maxHP}</p>
      <p><strong>Phase:</strong> ${boss.phase + 1}</p>
      <button onclick="window.location.href='world-boss.html'">
        Fight Boss
      </button>
    `;
    popup.style.display = "block";
  }
};

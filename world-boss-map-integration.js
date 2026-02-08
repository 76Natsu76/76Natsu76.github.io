/************************************************************
 * world-boss-map-integration.js
 * ----------------------------------------------------------
 * Integrates world boss state into world-map.html
 ************************************************************/

import { WORLD_BOSSES } from "./boss-definitions.js";
import { getWorldState } from "./world-state.js";

export const WorldBossMap = {
  init() {
    this.renderBossMarkers();
  },

  renderBossMarkers() {
    const world = getWorldState();
    const now = Date.now();

    for (const regionKey in world.regions) {
      const regionState = world.regions[regionKey];
      const marker = document.getElementById(`region-${regionKey}-marker`);
      if (!marker) continue;

      const boss = findBossForRegion(regionKey);
      if (!boss) {
        marker.classList.remove("worldboss-active", "worldboss-awakening");
        marker.removeAttribute("data-boss");
        marker.removeAttribute("data-status");
        marker.onclick = null;
        continue;
      }

      // ACTIVE BOSS
      if (regionState.worldBossActive) {
        marker.classList.add("worldboss-active");
        marker.classList.remove("worldboss-awakening");

        marker.setAttribute("data-boss", boss.name);
        marker.setAttribute("data-status", "active");

        marker.onclick = () => {
          this.showBossPopup(regionKey, boss, "active");
        };
        continue;
      }

      // AWAKENING SOON
      if (regionState.worldBossAwakening) {
        const timeLeft = regionState.worldBossAwakening - now;

        marker.classList.add("worldboss-awakening");
        marker.classList.remove("worldboss-active");

        marker.setAttribute("data-boss", boss.name);
        marker.setAttribute("data-status", `awakening:${timeLeft}`);

        marker.onclick = () => {
          this.showBossPopup(regionKey, boss, "awakening", timeLeft);
        };
        continue;
      }

      // NO BOSS CURRENTLY
      marker.classList.remove("worldboss-active", "worldboss-awakening");
      marker.removeAttribute("data-boss");
      marker.removeAttribute("data-status");
      marker.onclick = null;
    }
  },

  showBossPopup(regionKey, boss, state, timeLeft = null) {
    const popup = document.getElementById("worldboss-popup");

    let statusHTML = "";
    if (state === "active") {
      statusHTML = `<p><strong>Status:</strong> Active</p>
                    <button onclick="window.location.href='world-boss.html?region=${regionKey}'">
                      Fight Boss
                    </button>`;
    } else if (state === "awakening") {
      const minutes = Math.ceil(timeLeft / 60000);
      statusHTML = `<p><strong>Status:</strong> Awakening in ${minutes} min</p>`;
    }

    popup.innerHTML = `
      <h2>${boss.name}</h2>
      <p><strong>Region:</strong> ${regionKey}</p>
      <p><strong>Element:</strong> ${boss.element}</p>
      ${statusHTML}
    `;

    popup.style.display = "block";
  }
};

// ------------------------------------------------------------
// Helper: find boss assigned to region
// ------------------------------------------------------------
function findBossForRegion(regionKey) {
  for (const key in WORLD_BOSSES) {
    const boss = WORLD_BOSSES[key];
    if (boss.region === regionKey) return boss;
  }
  return null;
}

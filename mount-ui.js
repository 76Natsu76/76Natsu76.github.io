/************************************************************
 * mount-ui.js
 * Stable UI inside town.html
 ************************************************************/

import { MOUNTS } from "./mounts.js";
import { MountEngine } from "./mount-engine.js";
import { PlayerStorage } from "./player-storage.js";

export function renderMountStable(player) {
  const panel = document.getElementById("mountPanel");
  if (!panel) return;

  const owned = MountEngine.getPlayerMounts(player);
  const all = MountEngine.getAllMounts();
  const active = MountEngine.getActiveMount(player);

  panel.innerHTML = `
    <div class="section">
      <h2>Stable</h2>
      <p>Your Mounts:</p>
      ${
        owned.length === 0
          ? "<p>You own no mounts.</p>"
          : owned
              .map(id => {
                const m = all[id];
                if (!m) return "";
                const equipped = active && active.id === id;
                return `
                  <div class="mount-entry">
                    <strong>${m.name}</strong>
                    <span> (Speed: ${m.speed})</span>
                    <span> [${capitalize(m.rarity)}]</span>
                    ${equipped ? "<span> [Equipped]</span>" : ""}
                    <button class="btn" data-equip="${id}">
                      ${equipped ? "Re-equip" : "Equip"}
                    </button>
                  </div>
                `;
              })
              .join("")
      }
      <button class="btn" id="unequipMountBtn">Unequip Mount</button>
    </div>
  `;

  panel.querySelectorAll("button[data-equip]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-equip");
      const result = MountEngine.equipMount(player, id);
      if (!result.ok) {
        alert(result.reason);
        return;
      }
      // refresh player from storage to keep in sync
      const fresh = PlayerStorage.load(player.username);
      Object.assign(player, fresh);
      renderMountStable(player);
    };
  });

  const unequipBtn = document.getElementById("unequipMountBtn");
  if (unequipBtn) {
    unequipBtn.onclick = () => {
      MountEngine.unequipMount(player);
      const fresh = PlayerStorage.load(player.username);
      Object.assign(player, fresh);
      renderMountStable(player);
    };
  }
}

function capitalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/************************************************************
 * mount-ui.js
 ************************************************************/

import { MountEngine } from "./mount-engine.js";

let player = JSON.parse(sessionStorage.getItem("player_data") || "{}");

const listEl = document.getElementById("mount-list");
const detailEl = document.getElementById("mount-detail");
const username = sessionStorage.getItem("twitch_username");

document.getElementById("usernameDisplay").textContent =
  username ? "Logged in as: " + username : "No user logged in";

init();

function init() {
  renderMountList();
}

function renderMountList() {
  const mounts = MountEngine.getPlayerMounts(player);
  const all = MountEngine.getAllMounts();

  const out = mounts.map(key => {
    const m = all[key];
    return `
      <div class="mount-row">
        <button onclick="selectMount('${key}')">${m.name}</button>
        <span class="mount-meta">${m.rarity}</span>
      </div>
    `;
  });

  listEl.innerHTML = out.join("") || "<p>You have no mounts.</p>";
}

window.selectMount = function(mountKey) {
  const mount = MountEngine.getMount(mountKey);
  if (!mount) return;

  const isActive = player.activeMount === mountKey;

  const tags = (mount.tags || []).map(t => `<span class="tag">${format(t)}</span>`).join(" ");

  detailEl.innerHTML = `
    <h2>${mount.name}</h2>
    <p>${mount.description}</p>

    <p><strong>Rarity:</strong> ${format(mount.rarity)}</p>
    <p><strong>Speed Bonus:</strong> +${mount.speedBonus || 0}</p>
    <p><strong>Travel Cost Reduction:</strong> ${mount.travelCostReduction || 0}%</p>

    <p><strong>Tags:</strong> ${tags || "None"}</p>

    <button class="btn" onclick="toggleMount('${mountKey}')">
      ${isActive ? "Unequip Mount" : "Equip Mount"}
    </button>
  `;
};

window.toggleMount = function(mountKey) {
  if (player.activeMount === mountKey) {
    MountEngine.unequipMount(player);
  } else {
    const result = MountEngine.equipMount(player, mountKey);
    if (!result.ok) {
      alert(result.reason);
      return;
    }
  }

  sessionStorage.setItem("player_data", JSON.stringify(player));
  selectMount(mountKey);
  renderMountList();
};

function format(str) {
  return String(str)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

window.goToWorldMap = () => (window.location.href = "world-map.html");
window.goToInventory = () => (window.location.href = "inventory.html");

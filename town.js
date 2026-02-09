<script type="module">
  import { requireSession } from "./session-guard.js";
  import { PlayerStorage } from "./player-storage.js";
  import { getRegenRates } from "./regen.js";
  import { getSafeRespawnRemaining } from "./death-handler.js";
  import { applyOfflineRegen } from "./offline-regen.js";
  import { getWorldState } from "./world-state.js";
  import { SETTLEMENTS } from "./settlement-definitions.js";
  import { generateQuestForNPC } from "./quest-generator.js";
  import { acceptQuest } from "./quest-accept.js";
  import { BUILDINGS } from "./settlement-buildings.js";
  import { canUpgradeBuilding, upgradeBuilding } from "./settlement-upgrade.js";
  import { generateShopInventory } from "./settlement-shops.js";
  
  function renderSettlementUpgrades(settlementKey, player) {
    const world = getWorldState();
    const settlement = world.settlements[settlementKey];
  
    const out = Object.keys(BUILDINGS).map(bKey => {
      const def = BUILDINGS[bKey];
      const level = settlement.buildings[bKey].level;
      const nextTier = def.tiers.find(t => t.level === level + 1);
  
      if (!nextTier) {
        return `
          <div class="upgrade-entry">
            <strong>${def.name}</strong> — Level ${level} (MAX)
          </div>
        `;
      }
  
      const req = nextTier.requirements;
      const check = canUpgradeBuilding(settlementKey, bKey, player);
  
      return `
        <div class="upgrade-entry">
          <strong>${def.name}</strong> — Level ${level}
          <div class="upgrade-reqs">
            ${Object.entries(req).map(([k, v]) => `<div>${k}: ${v}</div>`).join("")}
          </div>
          <button onclick="upgradeBuildingUI('${settlementKey}', '${bKey}')"
            ${check.ok ? "" : "disabled"}>
            Upgrade to Level ${nextTier.level}
          </button>
          ${!check.ok ? `<div class="upgrade-error">${check.reason}</div>` : ""}
        </div>
      `;
    }).join("");
  
    document.getElementById("settlementUpgrades").innerHTML = out;
  }
  
  window.upgradeBuildingUI = (settlementKey, buildingKey) => {
    const world = getWorldState();
    const settlement = world.settlements[settlementKey];
    const player = PlayerStorage.load(currentUsername);
  
    const ok = upgradeBuilding(settlementKey, buildingKey, player);
    if (!ok) {
      alert("Upgrade failed.");
      return;
    }
  
    PlayerStorage.save(currentUsername, player);
    alert("Upgrade successful!");
  
    renderSettlementUpgrades(settlementKey, player);
  };
  
  function renderNPCQuests(settlementKey, player) {
    const world = getWorldState();
    const settlement = world.settlements[settlementKey];
    const region = world.regions[SETTLEMENTS[settlementKey].region];
  
    const out = settlement.npcs.map(npc => {
      const questKey = generateQuestForNPC(npc, player, region);
      if (!questKey) return "";
  
      const q = QUEST_TEMPLATES[questKey];
  
      return `
        <div class="npc-quest-entry">
          <strong>${npc.name}</strong> offers:
          <div class="quest-name">${q.name}</div>
          <button onclick="acceptQuestUI('${npc.id}', '${questKey}', '${settlementKey}')">
            Accept Quest
          </button>
        </div>
      `;
    }).join("");
  
    document.getElementById("npcQuests").innerHTML = out;
  }
  
  window.acceptQuestUI = (npcId, questKey, settlementKey) => {
    const world = getWorldState();
    const settlement = world.settlements[settlementKey];
    const npc = settlement.npcs.find(n => n.id === npcId);
  
    const quest = acceptQuest(currentPlayer, npc, settlementKey, settlement.region, questKey);
    PlayerStorage.save(currentUsername, currentPlayer);
  
    alert(`Quest accepted: ${QUEST_TEMPLATES[questKey].name}`);
  };


  /* ---------------------------------------------------------
     SESSION + LOAD PLAYER
  --------------------------------------------------------- */
  await requireSession();
  const { username } = window.syncState || {};

  const content = document.getElementById("townContent");

  if (!username) {
    content.innerHTML = "<div>No active session.</div>";
    throw new Error("No username in syncState");
  }

  let player = PlayerStorage.load(username);

  if (!player) {
    content.innerHTML = "<div>Failed to load player.</div>";
    throw new Error("Player not found");
  }
  
  function initTown() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("town");
    const def = SETTLEMENTS[key];
    const world = getWorldState();
    const state = world.settlements[key];
  
    if (!def || !state) {
      document.getElementById("settlementContainer").innerHTML = "Unknown settlement.";
      return;
    }
  
    document.getElementById("settlementContainer").innerHTML = `
      <h1>${def.name}</h1>
      <p>${def.description}</p>
  
      <h3>Morale: ${state.morale.toFixed(2)}</h3>
      <h3>Prosperity: ${state.prosperity.toFixed(2)}</h3>
      <h3>Population: ${state.population}</h3>
  
      <h2>Recent Events</h2>
      <div class="settlement-history">
        ${state.history.slice(-20).reverse().map(h => `
          <div class="history-entry">
            <span>${new Date(h.timestamp).toLocaleString()}</span>
            <span>${h.message}</span>
          </div>
        `).join("")}
      </div>
    `;
  }
  
  initTown();

  /* ---------------------------------------------------------
     OFFLINE REGEN (Phase 4)
  --------------------------------------------------------- */
  player = applyOfflineRegen(player);
  PlayerStorage.save(username, player);

  /* ---------------------------------------------------------
     AMBIENT TOWN REGEN
  --------------------------------------------------------- */
  const { hpPerMinute, mpPerMinute } = getRegenRates(player);

  player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + hpPerMinute);
  player.mana = Math.min(player.manaMax, player.mana + mpPerMinute);

  PlayerStorage.save(username, player);

  /* ---------------------------------------------------------
     RESPWAN FLAVOR + LOCK UI
  --------------------------------------------------------- */
  let flavor = "";
  let lockUI = "";

  if (player.justRespawned) {
    flavor = `
      <div class="section">
        <p>You awaken in town, restored but drained. Your MP is completely depleted.</p>
      </div>
    `;
    delete player.justRespawned;
    PlayerStorage.save(username, player);
  }

  const remaining = getSafeRespawnRemaining(player);
  if (remaining > 0) {
    const minutes = Math.ceil(remaining / 60000);
    lockUI = `
      <div class="section" id="respawnLockBox">
        <p><strong>Safe Respawn Lock:</strong> ${minutes} minutes remaining.</p>
      </div>
    `;
  } else if (player.safeRespawnLockUntil) {
    delete player.safeRespawnLockUntil;
    PlayerStorage.save(username, player);
  }

  /* ---------------------------------------------------------
     RENDER TOWN UI
  --------------------------------------------------------- */
  renderTown(player);

  if (flavor) content.insertAdjacentHTML("beforeend", flavor);
  if (lockUI) content.insertAdjacentHTML("beforeend", lockUI);

  if (player.safeRespawnLockUntil) {
    startRespawnLockCountdown(player);
  }

  /* ---------------------------------------------------------
     RENDER FUNCTION
  --------------------------------------------------------- */
  function renderTown(p) {
    content.innerHTML = `
      <div id="settlementContainer"></div>
      <div id="npcQuests"></div>
      <div id="settlementUpgrades"></div>
      <div id="settlementEconomy"></div>
      <div id="settlementShop"></div>

      <div class="section center">
        <div class="portrait-frame">
          <img class="portrait-img"
               src="${p.portrait || "/assets/portraits/default.png"}"
               onerror="this.src='/assets/portraits/default.png'">
        </div>
        <h2>${p.username}</h2>
        <div>Level ${p.level}</div>
        <div>${p.profession ? p.profession.toUpperCase() : "Adventurer"}</div>
      </div>

      <div class="section">
        <h2>Vitals</h2>
        <div class="stat-row"><span>HP</span><span>${p.hpCurrent} / ${p.hpMax}</span></div>
        <div class="stat-row"><span>MP</span><span>${p.mana} / ${p.manaMax}</span></div>
        <div class="stat-row"><span>Gold</span><span>${p.gold || 0}</span></div>
      </div>

      <div class="section center">
        <button class="btn" id="restBtn">Rest at Inn</button>
        <button class="btn" id="shopBtn">Visit Shop</button>
        <button class="btn" id="charBtn">Character Sheet</button>
        <button class="btn" id="mapBtn">Return to World Map</button>
      </div>
    `;

    document.getElementById("restBtn").onclick = restAtInn;
    document.getElementById("shopBtn").onclick = () => window.location.href = "shop.html";
    document.getElementById("charBtn").onclick = () => window.location.href = "character.html";
    document.getElementById("mapBtn").onclick = () => window.location.href = "world-map.html";
  }

  /* ---------------------------------------------------------
     REST AT INN
  --------------------------------------------------------- */
  function restAtInn() {
    const p = PlayerStorage.load(username);
    if (!p) return;

    p.hpCurrent = p.hpMax;
    p.mana = p.manaMax;

    PlayerStorage.save(username, p);
    renderTown(p);
  }

  /* ---------------------------------------------------------
     RESPAWN LOCK COUNTDOWN
  --------------------------------------------------------- */
  function startRespawnLockCountdown(player) {
    const box = document.getElementById("respawnLockBox");
    if (!box) return;

    const interval = setInterval(() => {
      const remaining = getSafeRespawnRemaining(player);

      if (remaining <= 0) {
        box.innerHTML = "<p><strong>Safe Respawn Lock:</strong> Ready.</p>";
        delete player.safeRespawnLockUntil;
        PlayerStorage.save(username, player);
        clearInterval(interval);
        return;
      }

      const minutes = Math.ceil(remaining / 60000);
      box.innerHTML = `<p><strong>Safe Respawn Lock:</strong> ${minutes} minutes remaining.</p>`;
    }, 10000);
  }

  /* ----------------------------------------------------------
     RENDER SETTLEMENT ECONOMY
  ----------------------------------------------------------- */
  
  function renderSettlementEconomy(settlementKey) {
    const world = getWorldState();
    const settlement = world.settlements[settlementKey];
  
    const res = settlement.economy.resources;
  
    const out = Object.keys(res).map(r => `
      <div>${r}: ${res[r].toFixed(1)}</div>
    `).join("");
  
    document.getElementById("settlementEconomy").innerHTML = out;
  
    const shop = generateShopInventory(settlement);
    const shopOut = shop.map(item => `
      <div>${item.item} — ${item.price}g (Stock: ${item.stock})</div>
    `).join("");
  
    document.getElementById("settlementShop").innerHTML = shopOut;
  }

</script>

// town.js
import { requireSession } from "./session-guard.js";
import { PlayerStorage } from "./player-storage.js";
import { getRegenRates } from "./regen.js";
import { getSafeRespawnRemaining } from "./death-handler.js";
import { applyOfflineRegen } from "./offline-regen.js";
import { getWorldState } from "./world-state.js";
import { SETTLEMENTS } from "./settlement-definitions.js";
import { BUILDINGS } from "./settlement-buildings.js";
import { canUpgradeBuilding, upgradeBuilding } from "./settlement-upgrade.js";
import { generateQuestForNPC } from "./quest-generator.js";
import { QUEST_TEMPLATES } from "./quest-definitions.js";
import { acceptQuest } from "./quest-accept.js";
import { renderNPCList } from "./town-dialogue.js";
import { renderSettlementEconomyAndShop } from "./town-economy.js";
import { listEnterableBuildings, enterBuilding } from "./building-interaction.js";
import { evaluateGuardResponse } from "./guard-system.js";
import { createGuardInstance } from "./guard-definitions.js";
import { calculateTravelTime } from "./travel-time.js";
import { startTravel } from "./travel-lockout.js";
import { PlayerStorage } from "./player-storage.js";

function wireTownButtons(settlementKey, player) {
  const travelBtn = document.getElementById("startTravelBtn");
  if (travelBtn) {
    travelBtn.onclick = () => {
      const from = player.position || { x: 0, y: 0 };
      const to = { x: 1350, y: 350 }; // example destination
      const mountSpeed = player.mount?.speed ?? 1;

      const travelTime = calculateTravelTime(from, to, mountSpeed);

      startTravel(player, to, travelTime, mountSpeed);
      PlayerStorage.save(player.username, player);

      alert("Travel started.");
    };
  }
}

document.getElementById("startTravelBtn").onclick = () => {
  const from = player.position || { x: 0, y: 0 };
  const to = { x: 1350, y: 350 }; // Example: capital city throne room
  const mountSpeed = player.mount?.speed ?? 1;

  const travelTime = calculateTravelTime(from, to, mountSpeed);

  startTravel(player, to, travelTime, mountSpeed);
  PlayerStorage.save(player.username, player);

  alert("Travel started.");
};

function checkGuardAggro(settlementKey, player) {
  const response = evaluateGuardResponse(player, settlementKey);

  if (response === "warn") {
    alert("A guard warns you to behave.");
  }

  if (response === "chase") {
    alert("Guards are chasing you!");
  }

  if (response === "attack" || response === "execute") {
    const guard = createGuardInstance();
    startCombatWithGuard(guard);
  }
}

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

/* ---------------------------------------------------------
   OFFLINE REGEN
--------------------------------------------------------- */
player = applyOfflineRegen(player);
PlayerStorage.save(username, player);

/* ---------------------------------------------------------
   AMBIENT TOWN REGEN
--------------------------------------------------------- */
{
  const { hpPerMinute, mpPerMinute } = getRegenRates(player);
  player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + hpPerMinute);
  player.mana = Math.min(player.manaMax, player.mana + mpPerMinute);
  PlayerStorage.save(username, player);
}

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
   MAIN INIT
--------------------------------------------------------- */
initTown();

if (flavor) content.insertAdjacentHTML("beforeend", flavor);
if (lockUI) content.insertAdjacentHTML("beforeend", lockUI);

if (player.safeRespawnLockUntil) {
  startRespawnLockCountdown(player);
}

/* ---------------------------------------------------------
   INIT TOWN
--------------------------------------------------------- */
function initTown() {
   const params = new URLSearchParams(window.location.search);
   const settlementKey = params.get("town");
   const def = SETTLEMENTS[settlementKey];
   const world = getWorldState();
   const state = world.settlements[settlementKey];
   if (!def || !state) {
     content.innerHTML = "<div>Unknown settlement.</div>";
     return;
   }

   renderPlayerPanel(player);
   renderSettlementHeader(settlementKey);
   renderBuildingList(settlementKey, player);
   renderHousingReputationPanel(settlementKey, player);
   renderNPCList(settlementKey, player);
   renderNPCQuests(settlementKey, player);
   renderSettlementUpgrades(settlementKey, player);
   renderSettlementEconomyAndShop(settlementKey, username);
   renderSettlementStatus(settlementKey);
   wireGlobalButtons(settlementKey);
  wireTownButtons(settlementKey, player);
}

/* ---------------------------------------------------------
   PLAYER PANEL
--------------------------------------------------------- */
function renderPlayerPanel(p) {
  const box = document.getElementById("playerPanel");
  if (!box) return;

  box.innerHTML = `
    <h2>${p.username}</h2>
    <div>Level ${p.level}</div>
    <div>${p.profession ? p.profession.toUpperCase() : "Adventurer"}</div>
    <div>HP: ${p.hpCurrent} / ${p.hpMax}</div>
    <div>MP: ${p.mana} / ${p.manaMax}</div>
    <div>Gold: ${p.gold || 0}</div>
  `;
}

/* ---------------------------------------------------------
   SETTLEMENT HEADER
--------------------------------------------------------- */
function renderSettlementHeader(settlementKey) {
  const world = getWorldState();
  const def = SETTLEMENTS[settlementKey];
  const state = world.settlements[settlementKey];

  const box = document.getElementById("settlementHeader");
  if (!box) return;

  box.innerHTML = `
    <h2>${def.name}</h2>
    <p>${def.description}</p>
    <div>Morale: ${state.morale.toFixed(2)}</div>
    <div>Prosperity: ${state.prosperity.toFixed(2)}</div>
    <div>Population: ${state.population}</div>
  `;
}

/* ---------------------------------------------------------
   HOUSING + REPUTATION
--------------------------------------------------------- */
function renderHousingReputationPanel(settlementKey, p) {
  const box = document.getElementById("housingReputationPanel");
  if (!box) return;

  const rep = p.reputation?.[settlementKey] || 0;
   
   let housingTier = 1;
   if (rep >= 200) housingTier = 2;
   if (rep >= 1000) housingTier = 3;
   if (rep >= 2000) housingTier = 4;
   
   box.innerHTML += `<div>Eligible Housing Tier: ${housingTier}</div>`;
   
  const isHome = p.housing?.homeSettlement === settlementKey;

  box.innerHTML = `
    <h2>Housing & Reputation</h2>
    <div>Reputation here: ${rep}</div>
    <div>Home here: ${isHome ? "Yes" : "No"}</div>
    ${isHome ? "" : `<button class="btn" id="setHomeBtn">Set Home Here</button>`}
  `;

  const btn = document.getElementById("setHomeBtn");
  if (btn) {
    btn.onclick = () => {
      p.housing = p.housing || {};
      p.housing.homeSettlement = settlementKey;
      p.housing.homeTier = 1;
      PlayerStorage.save(username, p);
      renderHousingReputationPanel(settlementKey, p);
    };
  }
}

/* ---------------------------------------------------------
   NPC QUESTS
--------------------------------------------------------- */
function renderNPCQuests(settlementKey, p) {
   const world = getWorldState();
   const settlement = world.settlements[settlementKey];
   const region = world.regions[SETTLEMENTS[settlementKey].region];

   const rep = player.reputation?.[settlementKey] || 0;
   if (rep < 0) {
     document.getElementById("npcQuests").innerHTML =
       "<div class='npc-quest-entry'>The townsfolk refuse to work with you.</div>";
     return;
   }
   
   const out = settlement.npcs.map(npc => {
      const questKey = generateQuestForNPC(npc, p, region);
      if (!questKey) return "";
      
      const q = QUEST_TEMPLATES[questKey];

    return `
      <div class="npc-quest-entry">
        <strong>${npc.name}</strong> offers:
        <div class="quest-name">${q.name}</div>
        <button class="btn" data-npc-id="${npc.id}" data-quest-key="${questKey}">
          Accept Quest
        </button>
      </div>
    `;
  }).join("");

  const box = document.getElementById("npcQuests");
  if (!box) return;
  box.innerHTML = out;

  box.querySelectorAll("button[data-npc-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const npcId = btn.getAttribute("data-npc-id");
      const questKey = btn.getAttribute("data-quest-key");
      acceptQuestUI(settlementKey, npcId, questKey);
    });
  });
}

function acceptQuestUI(settlementKey, npcId, questKey) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  const npc = settlement.npcs.find(n => n.id === npcId);
  if (!npc) return;

  const quest = acceptQuest(player, npc, settlementKey, SETTLEMENTS[settlementKey].region, questKey);
  if (!quest) {
    alert("Failed to accept quest.");
    return;
  }

  // Reputation: small bump for taking work here
  player.reputation = player.reputation || {};
  const current = player.reputation[settlementKey] || 0;
  player.reputation[settlementKey] = current + 1;

  PlayerStorage.save(username, player);
  alert(`Quest accepted: ${QUEST_TEMPLATES[questKey].name}`);
  renderHousingReputationPanel(settlementKey, player);
}

/* ---------------------------------------------------------
   SETTLEMENT UPGRADES
--------------------------------------------------------- */
function renderSettlementUpgrades(settlementKey, p) {
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
    const check = canUpgradeBuilding(settlementKey, bKey, p);

    return `
      <div class="upgrade-entry">
        <strong>${def.name}</strong> — Level ${level}
        <div class="upgrade-reqs">
          ${Object.entries(req).map(([k, v]) => `<div>${k}: ${v}</div>`).join("")}
        </div>
        <button class="btn" data-upgrade-building="${bKey}" ${check.ok ? "" : "disabled"}>
          Upgrade to Level ${nextTier.level}
        </button>
        ${!check.ok ? `<div class="upgrade-error">${check.reason}</div>` : ""}
      </div>
    `;
  }).join("");

  const box = document.getElementById("settlementUpgrades");
  if (!box) return;
  box.innerHTML = out;

  box.querySelectorAll("button[data-upgrade-building]").forEach(btn => {
    btn.addEventListener("click", () => {
      const bKey = btn.getAttribute("data-upgrade-building");
      upgradeBuildingUI(settlementKey, bKey);
    });
  });
}

function upgradeBuildingUI(settlementKey, buildingKey) {
  const p = PlayerStorage.load(username);
  const ok = upgradeBuilding(settlementKey, buildingKey, p);
  if (!ok) {
    alert("Upgrade failed.");
    return;
  }

  PlayerStorage.save(username, p);
  alert("Upgrade successful!");
  renderSettlementUpgrades(settlementKey, p);
}

function renderBuildingList(settlementKey, player) {
  const buildings = listEnterableBuildings(settlementKey, player);
  const box = document.getElementById("buildingList");

  box.innerHTML = buildings.map(b => `
    <div class="building-entry">
      <strong>${b.name}</strong>
      ${b.locked ? "<span style='color:red'> (Locked)</span>" : ""}
      <button class="btn" data-building-id="${b.id}">
        Enter
      </button>
    </div>
  `).join("");

  box.querySelectorAll("button[data-building-id]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-building-id");
      const result = enterBuilding(settlementKey, id, player);

      if (!result.ok) {
        alert(result.reason);
        return;
      }
    };
  });
}

/* ---------------------------------------------------------
   SETTLEMENT STATUS (CRISIS / DESTRUCTION)
--------------------------------------------------------- */
function renderSettlementStatus(settlementKey) {
  const world = getWorldState();
  const settlement = world.settlements[settlementKey];
  const box = document.getElementById("settlementCrisisPanel");
  if (!box || !settlement) return;

  if (settlement.destroyed) {
    box.innerHTML = `
      <div class="section">
        <strong>Status:</strong> Destroyed
        <div>Rebuild progress: ${(settlement.rebuildProgress * 100).toFixed(0)}%</div>
      </div>
    `;
    return;
  }

  if (settlement.crisis) {
    box.innerHTML = `
      <div class="section">
        <strong>Crisis:</strong> ${settlement.crisis}
        <div>Stage: ${settlement.crisisStage + 1} / 3</div>
      </div>
    `;
    return;
  }

  box.innerHTML = `
    <div class="section">
      <strong>Status:</strong> Stable
    </div>
  `;
   
   if (player.bounty?.[settlementKey] > 0) {
     box.innerHTML += `
       <div class="section">
         <strong>Bounty:</strong> ${player.bounty[settlementKey]}g
       </div>
     `;
   }

  const alliancesBox = document.getElementById("settlementAlliancesPanel");
  if (alliancesBox) {
    alliancesBox.innerHTML = `<div>Alliances UI not implemented yet.</div>`;
  }
}

/* ---------------------------------------------------------
   GLOBAL BUTTONS (REST / NAV)
--------------------------------------------------------- */
function wireGlobalButtons(settlementKey) {
   const clearBtn = document.getElementById("clearBountyBtn");
   if (clearBtn) {
     clearBtn.onclick = () => {
       if (clearBounty(player, settlementKey)) {
         alert("Your bounty has been cleared.");
         renderSettlementStatus(settlementKey);
       } else {
         alert("Not enough gold.");
       }
     };
   }
   const restBtn = document.getElementById("restBtn");
   if (restBtn) {
      restBtn.onclick = restAtInn;
   }
}

function restAtInn() {
  const p = PlayerStorage.load(username);
  if (!p) return;

  p.hpCurrent = p.hpMax;
  p.mana = p.manaMax;

  PlayerStorage.save(username, p);
  renderPlayerPanel(p);
}

/* ---------------------------------------------------------
   RESPAWN LOCK COUNTDOWN
--------------------------------------------------------- */
function startRespawnLockCountdown(p) {
  const box = document.getElementById("respawnLockBox");
  if (!box) return;

  const interval = setInterval(() => {
    const remaining = getSafeRespawnRemaining(p);

    if (remaining <= 0) {
      box.innerHTML = "<p><strong>Safe Respawn Lock:</strong> Ready.</p>";
      delete p.safeRespawnLockUntil;
      PlayerStorage.save(username, p);
      clearInterval(interval);
      return;
    }

    const minutes = Math.ceil(remaining / 60000);
    box.innerHTML = `<p><strong>Safe Respawn Lock:</strong> ${minutes} minutes remaining.</p>`;
  }, 10000);
}

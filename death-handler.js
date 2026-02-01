// death-handler.js

import { PlayerStorage } from "./player-storage.js";
import { api } from "./api.js";

/* ============================
   RARITY WEIGHTS
============================ */
const RARITY_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
  mythic: 0.2,
  artifact: 0.05
};

/* ============================
   HELPERS
============================ */
function buildEligibleLossPool(player) {
  const equippedIds = Object.values(player.equipment || {})
    .filter(eq => eq)
    .map(eq => eq.id);

  return (player.inventory || []).filter(item => {
    if (!item) return false;

    // Exclude equipped
    if (equippedIds.includes(item.id)) return false;

    // Exclude critical quest items
    if (item.isQuestCritical) return false;

    return true;
  });
}

function pickWeightedRandomItem(items) {
  const pool = items.map(item => ({
    item,
    weight: RARITY_WEIGHTS[item.rarity || "common"] ?? 1
  }));

  const total = pool.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;

  for (const p of pool) {
    if (roll < p.weight) return p.item;
    roll -= p.weight;
  }

  return pool[pool.length - 1].item;
}

function applyItemLoss(player) {
  const level = player.level || 1;
  const itemsToLose = Math.floor(level / 10);

  if (itemsToLose <= 0) return player;

  let eligible = buildEligibleLossPool(player);
  if (!eligible.length) return player;

  for (let i = 0; i < itemsToLose; i++) {
    if (!eligible.length) break;

    const chosen = pickWeightedRandomItem(eligible);

    // Remove from inventory
    const idx = player.inventory.findIndex(it => it.id === chosen.id);
    if (idx !== -1) player.inventory.splice(idx, 1);

    // Remove from eligible pool
    eligible = eligible.filter(it => it.id !== chosen.id);
  }

  return player;
}

function applyLevelLoss(player) {
  const currentLevel = player.level || 1;
  if (currentLevel <= 1) return player;

  player.level = currentLevel - 1;
  player.xp = 0;
  return player;
}

/* ============================
   RESPAWN STATE
============================ */
function applyRespawnState(player) {
  player.hpCurrent = player.hpMax;
  player.mana = 0;
  player.currentRegion = "town";
  player.justRespawned = true;
  return player;
}

/* ============================
   PUBLIC API
============================ */

export async function handleSafeRespawn(username) {
  const player = PlayerStorage.load(username);
  if (!player) return;

  applyItemLoss(player);
  applyRespawnState(player);

  // 1-hour lock timestamp
  player.safeRespawnLockUntil = Date.now() + (60 * 60 * 1000);

  PlayerStorage.save(username, player);
  await api.savePlayer(username, player);

  window.location.href = "town.html";
}


export async function handleRiskyRespawn(username) {
  const player = PlayerStorage.load(username);
  if (!player) return;

  applyLevelLoss(player);
  applyRespawnState(player);

  PlayerStorage.save(username, player);
  await api.savePlayer(username, player);

  window.location.href = "town.html";
}

export function getSafeRespawnRemaining(player) {
  if (!player.safeRespawnLockUntil) return 0;

  const now = Date.now();
  const diff = player.safeRespawnLockUntil - now;

  return diff > 0 ? diff : 0;
}

// api.js (GitHub-native)

import { PlayerStorage } from "./player-storage.js";

export const api = {
  getPlayer,
  savePlayer,
  updateField,
  useItem,
  equipItem,
  unequipItem
};


// player-serialize.js (or inside api.js)

export function sanitizePlayerForSave(player) {
  if (!player) return null;

  return {
    username: player.username || player.id || player.name, // depending on how you store it
    level: player.level ?? 1,
    race: player.race || null,
    subrace: player.subrace || null,
    profession: player.profession || null,

    xp: player.xp ?? 0,
    xpRequired: player.xpRequired ?? 0,

    elementAffinity: player.elementAffinity || {},
    element: player.element || null,
    family: player.family || null,

    equipment: player.equipment || { weapon: null, armor: null, accessory: null },
    inventory: Array.isArray(player.inventory) ? player.inventory : [],
    inventoryEquipment: Array.isArray(player.inventoryEquipment)
      ? player.inventoryEquipment
      : [],

    abilities: Array.isArray(player.abilities) ? player.abilities : [],
    ultimate: player.ultimate || null,

    statusEffects: Array.isArray(player.statusEffects) ? player.statusEffects : [],
    playerStatusEffects: Array.isArray(player.playerStatusEffects)
      ? player.playerStatusEffects
      : [],

    regionProgress: player.regionProgress || {},
    talentTreeDefinition: player.talentTreeDefinition || {},
    talentTree: Array.isArray(player.talentTree) ? player.talentTree : [],
    talentPoints: player.talentPoints ?? 0,

    hpMax: player.hpMax ?? (player.stats?.hp ?? 1),
    hpCurrent: player.hpCurrent ?? (player.stats?.hp ?? 1),
    atk: player.atk ?? (player.stats?.atk ?? 1),
    def: player.def ?? (player.stats?.def ?? 0),
    speed: player.speed ?? (player.stats?.speed ?? 1),

    manaMax: player.manaMax ?? 0,
    mana: player.mana ?? 0,

    crit: player.crit ?? (player.stats?.crit ?? 0),
    critDmg: player.critDmg ?? (player.stats?.critDmg ?? 1.5),
    evade: player.evade ?? (player.derived?.evade ?? 0),

    stats: player.stats || {
      hp: player.hpMax ?? 1,
      atk: player.atk ?? 1,
      def: player.def ?? 0,
      speed: player.speed ?? 1,
      crit: player.crit ?? 0,
      critDmg: player.critDmg ?? 1.5
    },

    derived: player.derived || {
      evade: player.evade ?? 0,
      block: 0,
      critChance: player.crit ?? 0,
      critDamage: player.critDmg ?? 1.5,
      powerScore: 0
    },

    adaptiveProfile: player.adaptiveProfile || {
      playerHeals: 0,
      playerBuffs: 0,
      playerShields: 0,
      playerDOTsApplied: 0,
      playerCCsApplied: 0
    },

    gold: player.gold ?? 0,
    hardcore: !!player.hardcore,
    transcension: !!player.transcension
  };
}

export async function autoSync(username) {
  const p = PlayerStorage.load(username);
  if (!p) return;

  // Fire-and-forget KV push
  savePlayerToKV(username, p).catch(() => {});
}

/* ============================================================
   LOCAL OPERATIONS
============================================================ */

async function getPlayer(username) {
  return PlayerStorage.load(username);
}

async function savePlayer(username, data) {
  PlayerStorage.save("player:" + username, data);
  autoSync(username);
  return { ok: true };
}

async function updateField(username, field, value) {
  PlayerStorage.updateField(username, field, value);
  autoSync(username);
  return { ok: true };
}

async function useItem(username, itemId) {
  const p = PlayerStorage.load(username);
  const item = p.inventory.find(i => i.id === itemId);
  if (!item) return { ok: false, error: "Item not found" };

  if (item.type !== "consumable")
    return { ok: false, error: "Item is not consumable" };

  if (item.restoreHP) {
    p.hp = Math.min(p.hpMax, p.hp + item.restoreHP);
  }

  item.quantity -= 1;
  if (item.quantity <= 0) {
    p.inventory = p.inventory.filter(i => i.id !== itemId);
  }

  PlayerStorage.save("player:" + username, p);
  autoSync(username);
  return { ok: true, message: "Item used." };
}

async function equipItem(username, itemId) {
  const p = PlayerStorage.load(username);
  const item = p.inventory.find(i => i.id === itemId);
  if (!item || !item.slot) return { ok: false, error: "Cannot equip" };

  const slot = item.slot;

  if (p.equipment[slot]) {
    p.inventory.push(p.equipment[slot]);
  }

  p.equipment[slot] = item;
  p.inventory = p.inventory.filter(i => i.id !== itemId);

  PlayerStorage.save("player:" + username, p);
  autoSync(username);
  return { ok: true, message: "Equipped " + item.name };
}

async function unequipItem(username, slot) {
  const p = PlayerStorage.load(username);
  const item = p.equipment[slot];
  if (!item) return { ok: false, error: "Nothing equipped" };

  p.inventory.push(item);
  delete p.equipment[slot];

  PlayerStorage.save("player:" + username, p);
  autoSync(username);
  return { ok: true, message: "Unequipped " + item.name };
}

/* ============================================================
   KV OPERATIONS
============================================================ */

export async function getPlayerFromKV(username) {
  const res = await fetch(
    `https://auth-worker.godeaterspersona.workers.dev/player/${username}`
  );
  return res.json();
}

export async function loadPlayerFromKV(username) {
  return getPlayerFromKV(username);
}

export async function savePlayerToKV(username, player) {
  const clean = sanitizePlayerForSave(player);

  const body = JSON.stringify({ username, data: clean });

  const res = await fetch("https://auth-worker.godeaterspersona.workers.dev/player/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("KV save failed", res.status, text);
    throw new Error(`KV save failed: ${res.status}`);
  }

  return await res.json().catch(() => ({}));
}


/* ============================================================
   LOAD + CONFLICT DETECTION
============================================================ */

export async function loadFromKVAndLocal(username) {
  const local = PlayerStorage.load(username);

  let remote = null;
  try {
    remote = await getPlayerFromKV(username);
    if (remote?.error) remote = null;
  } catch {
    remote = null;
  }

  return { local, remote };
}

export function detectConflict(local, remote) {
  if (!remote && local) return "local-only";
  if (!local && remote) return "remote-only";
  if (!local && !remote) return "none";

  if (local.exp !== remote.exp || local.level !== remote.level) {
    return "conflict";
  }

  return "match";
}

const BASE_URL = "https://auth-worker.godeaterspersona.workers.dev";

async function fetchJSON(url) {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getLeaderboardGlobalKV() {
  return fetchJSON(`${BASE_URL}/leaderboards/global`);
}

export async function getLeaderboardHardcoreKV() {
  return fetchJSON(`${BASE_URL}/leaderboards/hardcore`);
}

export async function getLeaderboardFriendsKV(username) {
  return fetchJSON(`${BASE_URL}/leaderboards/friends/${encodeURIComponent(username)}`);
}

export async function getLeaderboardDungeonsKV() {
  return fetchJSON(`${BASE_URL}/leaderboards/dungeons`);
}

export async function getLeaderboardEndlessKV() {
  return fetchJSON(`${BASE_URL}/leaderboards/endless`);
}

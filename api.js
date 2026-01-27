// api.js (GitHub-native)
// Replaces Apps Script calls with local PlayerStorage operations.

import { PlayerStorage } from "./player-storage.js";

export const api = {
  getPlayer,
  savePlayer,
  updateField,
  useItem,
  equipItem,
  unequipItem
};

async function getPlayer(username) {
  return PlayerStorage.load(username);
}

async function savePlayer(username, data) {
  PlayerStorage.save(username, data);
  return { ok: true };
}

async function updateField(username, field, value) {
  PlayerStorage.updateField(username, field, value);
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

  PlayerStorage.save(username, p);
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

  PlayerStorage.save(username, p);
  return { ok: true, message: "Equipped " + item.name };
}

async function unequipItem(username, slot) {
  const p = PlayerStorage.load(username);
  const item = p.equipment[slot];
  if (!item) return { ok: false, error: "Nothing equipped" };

  p.inventory.push(item);
  delete p.equipment[slot];

  PlayerStorage.save(username, p);
  return { ok: true, message: "Unequipped " + item.name };
}

export async function getPlayerFromKV(username) {
  const res = await fetch(`https://<your-worker-url>/player/${username}`);
  return res.json();
}

export async function savePlayerToKV(username, data) {
  const res = await fetch(`https://<your-worker-url>/player/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, data })
  });

  return res.json();
}



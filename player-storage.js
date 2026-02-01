// player-storage.js
// GitHub-native replacement for Code.gs backend.
// Stores all player data in localStorage.

export const PlayerStorage = {
  load,
  save,
  updateField,
  appendLog,
  clearDungeonRun
};

// ---- INTERNAL: ensure vital fields & migrate legacy names ----
function ensureVitals(p) {
  if (!p) return p;

  if (typeof p.hpMax !== "number") p.hpMax = 20;

  if (p.hpCurrent === undefined || p.hpCurrent === null) {
    p.hpCurrent = p.hpMax;
  } else {
    p.hpCurrent = Math.min(p.hpCurrent, p.hpMax);
  }

  if (typeof p.manaMax !== "number") p.manaMax = 10;

  if (p.mana === undefined || p.mana === null) {
    p.mana = p.manaMax;
  } else {
    p.mana = Math.min(p.mana, p.manaMax);
  }

  // Remove legacy fields so they never overwrite again
  delete p.mp;
  delete p.maxmp;

  // Dungeon run persistence
  if (p.activeDungeonRun && typeof p.activeDungeonRun !== "object") {
    delete p.activeDungeonRun;
  }

  if (!p.flags || typeof p.flags !== "object") p.flags = {};
  if (!p.lastEndlessRun) p.lastEndlessRun = null;
  if (!p.endlessRecord) p.endlessRecord = null;
  if (!p.lastCompletedDungeonRun) p.lastCompletedDungeonRun = null;
  
  return p;
}

// Load player from localStorage or create new
function load(userId) {
  const key = "player_" + userId;
  const raw = localStorage.getItem(key);

  if (!raw || raw === "undefined") {
    console.warn("PlayerStorage.load: No valid data found for", key, "→ creating new player.");
    return createNewPlayer(userId);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      console.warn("PlayerStorage.load: Parsed data invalid for", key, parsed);
      return createNewPlayer(userId);
    }

    const normalized = ensureVitals(parsed);
    save(userId, normalized); // persist migration
    return normalized;
  } catch (e) {
    console.error("PlayerStorage.load: JSON parse failed for", key, raw, e);
    return createNewPlayer(userId);
  }
}

// Create a brand-new player object (canonical fields)
function createNewPlayer(userId) {
  const newPlayer = ensureVitals({
    id: userId,
    name: userId,
    level: 1,
    hpMax: 20,
    hpCurrent: 20,
    manaMax: 10,
    mana: 10,
    gold: 0,
    inventory: [],
    equipment: {},
    logs: [],
    activeDungeonRun: null,
    lastCompletedDungeonRun: null,
    flags: {},
    lastEndlessRun: null,
    endlessRecord: null
  });

  save(userId, newPlayer);
  return newPlayer;
}

// Save full player object
function save(userId, data) {
  const key = "player_" + userId;

  if (!data || typeof data !== "object") {
    console.error("PlayerStorage.save: Attempted to save invalid data for", key, data);
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("PlayerStorage.save: Failed to save data for", key, e);
  }
}

// Update a single field
function updateField(userId, field, value) {
  const p = load(userId);
  p[field] = value;
  save(userId, p);
}

// Append to player log
function appendLog(userId, message) {
  const p = load(userId);
  p.logs = p.logs || [];
  p.logs.push({
    message,
    time: Date.now()
  });
  save(userId, p);
}

// Clear dungeon run safely
function clearDungeonRun(userId) {
  const p = load(userId);
  p.activeDungeonRun = null;
  save(userId, p);
}


// player-storage.js
// GitHub-native replacement for Code.gs backend.
// Stores all player data in sessionStorage or localStorage.

export const PlayerStorage = {
  load,
  save,
  updateField,
  appendLog
};

// Load player from localStorage or create new
function load(userId) {
  const key = "player_" + userId;
  const raw = localStorage.getItem(key);

  // --- SAFETY GUARD: prevent crashes from "undefined" or invalid JSON ---
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
    return parsed;
  } catch (e) {
    console.error("PlayerStorage.load: JSON parse failed for", key, raw, e);
    return createNewPlayer(userId);
  }
}

// Create a brand-new player object
function createNewPlayer(userId) {
  const newPlayer = {
    id: userId,
    name: userId,
    level: 1,
    hp: 20,
    hpMax: 20,
    mp: 10,
    maxmp: 10,
    gold: 0,
    inventory: [],
    equipment: {},
    logs: []
  };

  save(userId, newPlayer);
  return newPlayer;
}

// Save full player object
function save(userId, data) {
  const key = "player_" + userId;

  // --- SAFETY GUARD: never save undefined/null ---
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

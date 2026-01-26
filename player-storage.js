// player-storage.js
// GitHub-native replacement for Code.gs backend.
// Stores all player data in sessionStorage or localStorage.

export const PlayerStorage = {
  load,
  save,
  updateField,
  appendLog
};

// Load player from sessionStorage or create new
function load(userId) {
  const raw = localStorage.getItem("player_" + userId);
  if (raw) {
    return JSON.parse(raw);
  }

  // Create new player
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
  localStorage.setItem("player_" + userId, JSON.stringify(data));
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

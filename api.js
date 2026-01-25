// api.js
// Unified API wrapper for your Google Apps Script backend
// Fully compatible with combat engine, inventory, character, and use-item pages

const API_URL =
  "https://script.google.com/macros/s/AKfycbyqqCpcGmg_k3d4Zo6bmkiYZ3AzMWhjgaKEqYrGz-Ii/exec";

async function apiRequest(payload) {
  const res = await fetch(
    `${API_URL}?origin=${encodeURIComponent(location.origin)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Invalid JSON response from server");
  }

  if (json.error) {
    throw new Error(json.error);
  }

  return json;
}

export const api = {
  /* ============================================================
     PLAYER LOADING
     ============================================================ */

  async getPlayer(userId) {
    const url =
      `${API_URL}?cmd=getPlayer&userId=${encodeURIComponent(userId)}&origin=${encodeURIComponent(location.origin)}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.error) throw new Error(json.error);
    return json.player || json;
  },

  /* ============================================================
     ITEM USAGE (OUT OF COMBAT)
     ============================================================ */

  async useItem(userId, itemId) {
    return await apiRequest({
      cmd: "useItem",
      userId,
      itemId
    });
  },

  /* ============================================================
     ITEM USAGE (IN COMBAT)
     ============================================================ */

  async useItemInCombat(userId, itemId) {
    return await apiRequest({
      cmd: "useItemInCombat",
      userId,
      itemId
    });
  },

  /* ============================================================
     EQUIPMENT MANAGEMENT
     ============================================================ */

  async equipItem(userId, itemId) {
    return await apiRequest({
      cmd: "equipItem",
      userId,
      itemId
    });
  },

  async unequipItem(userId, slot) {
    return await apiRequest({
      cmd: "unequipItem",
      userId,
      slot
    });
  },

  /* ============================================================
     SAVE / UPDATE PLAYER
     ============================================================ */

  async savePlayer(userId, data) {
    return await apiRequest({
      cmd: "savePlayer",
      userId,
      data
    });
  },

  async updateField(userId, field, value) {
    return await apiRequest({
      cmd: "updateField",
      userId,
      field,
      value
    });
  },

  /* ============================================================
     LOGGING
     ============================================================ */

  async appendLog(userId, message) {
    return await apiRequest({
      cmd: "appendLog",
      userId,
      message
    });
  }
};

// Expose globally for browser pages
window.api = api;

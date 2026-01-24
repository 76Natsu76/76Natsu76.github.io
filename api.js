// api.js
// Wrapper for your Google Apps Script JSON API

const API_URL =
  "https://script.google.com/macros/s/AKfycbyqqCpcGmg_k3d4Zo6bmkiYZ3AzMWhjgaKEqYrGz-Ii/exec";

const api = {
  async loadPlayer(userId) {
    const url =
      `${API_URL}?cmd=loadPlayer&userId=${encodeURIComponent(userId)}&origin=${encodeURIComponent(location.origin)}`;

    const res = await fetch(url);
    const json = await res.json();
    return json;
  },

  async savePlayer(userId, data) {
    const res = await fetch(
      `${API_URL}?origin=${encodeURIComponent(location.origin)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmd: "savePlayer",
          userId,
          data
        })
      }
    );

    const json = await res.json();
    return json;
  },

  async updateField(userId, field, value) {
    const res = await fetch(
      `${API_URL}?origin=${encodeURIComponent(location.origin)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmd: "updateField",
          userId,
          field,
          value
        })
      }
    );

    return await res.json();
  },

  async appendLog(userId, message) {
    const res = await fetch(
      `${API_URL}?origin=${encodeURIComponent(location.origin)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmd: "appendLog",
          userId,
          message
        })
      }
    );

    return await res.json();
  }
};

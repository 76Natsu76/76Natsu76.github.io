// session-manager.js
export const SessionManager = {
  saveSession(username, token) {
    localStorage.setItem("rpg_username", username);
    localStorage.setItem("rpg_session", token);
  },

  clearSession() {
    localStorage.removeItem("rpg_username");
    localStorage.removeItem("rpg_session");
  },

  getSession() {
    const username = localStorage.getItem("rpg_username");
    const token = localStorage.getItem("rpg_session");
    if (!username || !token) return null;
    return { username, token };
  }
};

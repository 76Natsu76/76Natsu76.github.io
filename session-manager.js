export const SessionManager = {
  saveSession(username, token) {
    const session = { username, token };
    localStorage.setItem("session", JSON.stringify(session));
  },

  loadSession() {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  },

  clearSession() {
    localStorage.removeItem("session");
  }
};

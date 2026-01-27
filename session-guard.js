// session-guard.js
import { SessionManager } from "./session-manager.js";
import { loadFromKVAndLocal, detectConflict } from "./api.js";
import { PlayerStorage } from "./player-storage.js";

export async function requireSession() {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session || !session.username) {
    window.location.href = "login.html";
    return;
  }

  const username = session.username;

  // Load both versions
  const { local, remote } = await loadFromKVAndLocal(username);
  const conflict = detectConflict(local, remote);

  window.syncState = { local, remote, conflict, username };
}

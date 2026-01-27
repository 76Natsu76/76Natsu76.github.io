// session-guard.js
import { SessionManager } from "./session-manager.js";

export function requireSession() {
  const session = SessionManager.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

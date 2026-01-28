// session-guard.js
export async function requireSession() {
  const raw = localStorage.getItem("session");
  if (!raw) {
    window.location.href = "login.html";
    return;
  }

  let session;
  try {
    session = JSON.parse(raw);
  } catch {
    // corrupted session → force logout
    localStorage.removeItem("session");
    window.location.href = "login.html";
    return;
  }

  if (!session || !session.username) {
    window.location.href = "login.html";
    return;
  }

  // Only store username — do NOT load player here
  window.syncState = { username: session.username };
}

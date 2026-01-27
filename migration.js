export async function getPlayerFromKV(username) {
  const res = await fetch(`https://auth-worker.godeaterspersona.workers.dev/${username}`);
  return res.json();
}

export async function savePlayerToKV(username, data) {
  const res = await fetch(`https://auth-worker.godeaterspersona.workers.dev/player/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, data })
  });

  return res.json();
}

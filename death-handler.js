function pickWeightedRandomItem(items) {
  const weights = {
    common: 60,
    uncommon: 25,
    rare: 10,
    epic: 4,
    legendary: 1,
    mythic: 0.2,
    artifact: 0.05
  };

  const pool = items.map(item => ({
    item,
    weight: weights[item.rarity || "common"] ?? 1
  }));

  const total = pool.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;

  for (const p of pool) {
    if (roll < p.weight) return p.item;
    roll -= p.weight;
  }

  return pool[pool.length - 1].item;
}

function applyItemLoss(player) {
  const level = player.level || 1;
  const itemsToLose = Math.floor(level / 10);

  if (itemsToLose <= 0) return player;

  let eligible = buildEligibleLossPool(player);
  if (eligible.length === 0) return player;

  for (let i = 0; i < itemsToLose; i++) {
    if (eligible.length === 0) break;

    const chosen = pickWeightedRandomItem(eligible);

    // Remove from inventory
    const idx = player.inventory.findIndex(it => it.id === chosen.id);
    if (idx !== -1) player.inventory.splice(idx, 1);

    // Remove from eligible pool
    eligible = eligible.filter(it => it.id !== chosen.id);
  }

  return player;
}

function buildEligibleLossPool(player) {
  const equippedIds = Object.values(player.equipment || {})
    .filter(eq => eq)
    .map(eq => eq.id);

  return player.inventory.filter(item => {
    // Exclude equipped items
    if (equippedIds.includes(item.id)) return false;

    // Exclude critical quest items
    if (item.isQuestCritical) return false;

    // Everything else is eligible
    return true;
  });
}

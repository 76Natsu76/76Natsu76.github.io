// weighted.js

export function pickWeighted(list) {
  const total = list.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of list) {
    if (roll < entry.weight) return entry.id;
    roll -= entry.weight;
  }
  return list[0].id;
}

// NEW — matches merchant-inventory.js expectations
export function weightedRandom(list, weightFn) {
  const weightedList = list.map(item => ({
    id: item,
    weight: weightFn(item)
  }));
  return pickWeighted(weightedList);
}

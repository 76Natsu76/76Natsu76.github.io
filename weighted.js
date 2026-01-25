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

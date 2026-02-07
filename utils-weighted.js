// utils-weighted.js

export function weightedPick(weightMap) {
  // weightMap: { key: { weight, ... } } OR { key: number }
  const entries = Object.entries(weightMap);
  if (!entries.length) return null;

  let total = 0;
  const expanded = entries.map(([key, val]) => {
    const w = typeof val === "number" ? val : (val.weight ?? 0);
    total += w;
    return { key, weight: w };
  });

  if (total <= 0) return expanded[0].key;

  let roll = Math.random() * total;
  for (const e of expanded) {
    if (roll < e.weight) return e.key;
    roll -= e.weight;
  }
  return expanded[expanded.length - 1].key;
}

export function pickFromArray(arr) {
  if (!arr || !arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

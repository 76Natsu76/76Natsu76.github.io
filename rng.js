// rng.js
export function seededRNG(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return function () {
    h = (h * 1664525 + 1013904223) >>> 0;
    return (h >>> 0) / 0xFFFFFFFF;
  };
}

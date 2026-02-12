export const SEED_TYPES = {
  blessed: {
    name: "Blessed Seed",
    description: "Positive modifiers and safer layouts.",
    modifiers: ["double_loot", "empowered_ultimate"]
  },
  cursed: {
    name: "Cursed Seed",
    description: "Harsh modifiers and dangerous layouts.",
    modifiers: ["no_healing", "enemy_frenzy", "thick_fog"]
  },
  loot: {
    name: "Loot Seed",
    description: "Treasure density increased.",
    modifiers: ["double_loot"]
  },
  chaos: {
    name: "Chaotic Seed",
    description: "Random mutator every room.",
    modifiers: ["unstable_magic"]
  },
  bossrush: {
    name: "Boss Rush Seed",
    description: "Boss rooms appear earlier and more often.",
    modifiers: []
  }
};

export function detectSeedType(seed) {
  const s = seed.toUpperCase();

  if (s.startsWith("BLES-")) return "blessed";
  if (s.startsWith("CURS-")) return "cursed";
  if (s.includes("LOOT")) return "loot";
  if (s.endsWith("-X")) return "chaos";
  if (s.includes("BOSS")) return "bossrush";

  return "unknown";
}

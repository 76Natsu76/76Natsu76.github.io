export const SEED_LOOT = {
  blessed: {
    goldMult: 1.2,
    xpMult: 1.15,
    extraItems: ["blessed_fragment"]
  },
  cursed: {
    goldMult: 1.0,
    xpMult: 1.0,
    extraItems: ["cursed_shard"],
    curseChance: 0.25
  },
  loot: {
    goldMult: 1.5,
    xpMult: 1.2,
    extraItems: ["loot_cache"]
  },
  chaos: {
    goldMult: 1.1,
    xpMult: 1.1,
    chaosItemChance: 0.15,
    chaosItems: ["chaos_spark", "chaos_dust"]
  },
  bossrush: {
    goldMult: 1.3,
    xpMult: 1.4,
    extraItems: ["boss_essence"]
  }
};

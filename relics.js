export const RELICS = {
  chaos_orb: {
    name: "Chaos Orb",
    description: "Each room has a 10% chance to apply a random mutator.",
    apply(run) {
      run.chaosChance = (run.chaosChance || 0) + 0.10;
    }
  },

  bossheart: {
    name: "Bossheart",
    description: "Bosses drop +20% more loot.",
    apply(run) {
      run.bossLootMult = (run.bossLootMult || 1) * 1.2;
    }
  },

  blessed_feather: {
    name: "Blessed Feather",
    description: "Healing effects are 15% stronger.",
    apply(run) {
      run.healBonus = (run.healBonus || 1) * 1.15;
    }
  }
};

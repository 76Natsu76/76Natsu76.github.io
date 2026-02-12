export const DUNGEON_MODIFIERS = {
  // --- CURSES ---
  no_healing: {
    key: "no_healing",
    name: "Curse of Withering",
    description: "Healing effects are disabled.",
    applyToRun(run) {
      run.noHealing = true;
    }
  },

  enemy_frenzy: {
    key: "enemy_frenzy",
    name: "Frenzy",
    description: "Enemies gain +25% ATK.",
    applyToEnemy(enemy) {
      enemy.atk = Math.floor(enemy.atk * 1.25);
    }
  },

  brittle_defense: {
    key: "brittle_defense",
    name: "Brittle Defense",
    description: "Player DEF reduced by 20%.",
    applyToPlayer(player) {
      player.def = Math.floor(player.def * 0.8);
    }
  },

  // --- BLESSINGS ---
  double_loot: {
    key: "double_loot",
    name: "Blessing of Plenty",
    description: "Treasure rooms drop double loot.",
    applyToRun(run) {
      run.doubleLoot = true;
    }
  },

  empowered_ultimate: {
    key: "empowered_ultimate",
    name: "Empowered Ultimate",
    description: "Ultimate charge builds 30% faster.",
    applyToPlayer(player) {
      player.ultimateChargeRequired = Math.floor(player.ultimateChargeRequired * 0.7);
    }
  },

  // --- MUTATORS ---
  unstable_magic: {
    key: "unstable_magic",
    name: "Unstable Magic",
    description: "All elemental damage is doubled.",
    applyToContext(context) {
      context.elementalDamageMult = 2.0;
    }
  },

  thick_fog: {
    key: "thick_fog",
    name: "Thick Fog",
    description: "Player accuracy reduced by 15%.",
    applyToPlayer(player) {
      player.accuracy = (player.accuracy || 1) * 0.85;
    }
  }
};

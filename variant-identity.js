export const VARIANT_IDENTITY = {

  /* ============================================================
     BASELINE
  ============================================================ */

  "normal": {
    statMults: { hp: 1.0, atk: 1.0, def: 1.0, spd: 1.0 },
    effects: [],
    tags: [],
    flavor: "A standard creature with no unusual traits."
  },

  /* ============================================================
     ELITE / RARE
  ============================================================ */

  "elite": {
    statMults: { hp: 1.4, atk: 1.3, def: 1.2, spd: 1.1 },
    effects: ["elite_presence"],
    tags: ["elite"],
    flavor: "A powerful, hardened foe with superior strength."
  },

  "champion": {
    statMults: { hp: 1.6, atk: 1.4, def: 1.3, spd: 1.1 },
    effects: ["battle_aura"],
    tags: ["champion"],
    flavor: "A seasoned warrior radiating battlefield dominance."
  },

  "mythic": {
    statMults: { hp: 2.0, atk: 1.8, def: 1.6, spd: 1.2 },
    effects: ["mythic_power"],
    tags: ["mythic"],
    flavor: "A legendary foe infused with ancient might."
  },

  /* ============================================================
     ELEMENTAL VARIANTS
  ============================================================ */

  "frostbitten": {
    statMults: { hp: 1.1, atk: 1.0, def: 1.1, spd: 0.9 },
    effects: ["ice_attacks", "slow_on_hit"],
    tags: ["ice"],
    flavor: "Chilled by unnatural frost, its strikes slow the blood."
  },

  "flame-touched": {
    statMults: { hp: 1.0, atk: 1.2, def: 0.9, spd: 1.0 },
    effects: ["fire_attacks", "burn_on_hit"],
    tags: ["fire"],
    flavor: "Wreathed in flame, its attacks ignite the battlefield."
  },

  "stormcharged": {
    statMults: { hp: 1.0, atk: 1.1, def: 1.0, spd: 1.2 },
    effects: ["electric_attacks", "shock_on_hit"],
    tags: ["electric"],
    flavor: "Crackling with lightning, it moves with blinding speed."
  },

  "earthforged": {
    statMults: { hp: 1.3, atk: 1.0, def: 1.3, spd: 0.8 },
    effects: ["earth_attacks", "fortify"],
    tags: ["earth"],
    flavor: "Hardened by stone, its body is nearly unbreakable."
  },

  "radiant": {
    statMults: { hp: 1.1, atk: 1.1, def: 1.1, spd: 1.0 },
    effects: ["holy_attacks", "cleanse_on_hit"],
    tags: ["holy"],
    flavor: "Blessed with divine light, it burns away corruption."
  },

  "shadowed": {
    statMults: { hp: 0.9, atk: 1.2, def: 0.9, spd: 1.3 },
    effects: ["dark_attacks", "evasion_up"],
    tags: ["dark"],
    flavor: "Shrouded in darkness, it strikes from unseen angles."
  },

  /* ============================================================
     CORRUPTED / VOID / CHAOS
  ============================================================ */

  "corrupted": {
    statMults: { hp: 1.2, atk: 1.2, def: 1.0, sp

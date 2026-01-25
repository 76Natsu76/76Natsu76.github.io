// biome-presets.js
// Canonical biome stat presets for world simulation.

export const BIOME_PRESETS = {
  forest: {
    key: "forest",
    hpMult: 1.05,
    atkMult: 1.0,
    defMult: 1.0,
    speedMult: 1.0,
    elementAffinity: { nature: 0.10 }
  },
  plains: {
    key: "plains",
    hpMult: 1.0,
    atkMult: 1.05,
    defMult: 1.0,
    speedMult: 1.05,
    elementAffinity: {}
  },
  swamp: {
    key: "swamp",
    hpMult: 1.10,
    atkMult: 0.95,
    defMult: 1.05,
    speedMult: 0.9,
    elementAffinity: { poison: 0.10 }
  },
  desert: {
    key: "desert",
    hpMult: 1.0,
    atkMult: 1.10,
    defMult: 0.95,
    speedMult: 1.05,
    elementAffinity: { fire: 0.05 }
  },
  tundra: {
    key: "tundra",
    hpMult: 1.10,
    atkMult: 1.0,
    defMult: 1.05,
    speedMult: 0.9,
    elementAffinity: { ice: 0.10 }
  },
  mountains: {
    key: "mountains",
    hpMult: 1.10,
    atkMult: 1.05,
    defMult: 1.10,
    speedMult: 0.9,
    elementAffinity: { earth: 0.10 }
  },
  cavern: {
    key: "cavern",
    hpMult: 1.05,
    atkMult: 1.0,
    defMult: 1.10,
    speedMult: 0.95,
    elementAffinity: { earth: 0.05, shadow: 0.05 }
  },
  ruins: {
    key: "ruins",
    hpMult: 1.0,
    atkMult: 1.05,
    defMult: 1.0,
    speedMult: 1.0,
    elementAffinity: { arcane: 0.05 }
  },
  coastal: {
    key: "coastal",
    hpMult: 1.0,
    atkMult: 1.0,
    defMult: 1.0,
    speedMult: 1.05,
    elementAffinity: { water: 0.10 }
  },

  volcanic: {
    key: "volcanic",
    hpMult: 1.0,
    atkMult: 1.15,
    defMult: 1.0,
    speedMult: 1.0,
    elementAffinity: { fire: 0.15 }
  },
  arcane: {
    key: "arcane",
    hpMult: 0.95,
    atkMult: 1.15,
    defMult: 0.95,
    speedMult: 1.05,
    elementAffinity: { arcane: 0.15 }
  },
  celestial: {
    key: "celestial",
    hpMult: 1.05,
    atkMult: 1.05,
    defMult: 1.05,
    speedMult: 1.0,
    elementAffinity: { light: 0.15 }
  },
  void: {
    key: "void",
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 0.95,
    speedMult: 1.0,
    elementAffinity: { shadow: 0.15, void: 0.10 }
  },
  primeval: {
    key: "primeval",
    hpMult: 1.15,
    atkMult: 1.05,
    defMult: 1.05,
    speedMult: 0.95,
    elementAffinity: { nature: 0.15 }
  },

  storm: {
    key: "storm",
    hpMult: 1.0,
    atkMult: 1.10,
    defMult: 1.0,
    speedMult: 1.10,
    elementAffinity: { lightning: 0.15 }
  },
  abyssal: {
    key: "abyssal",
    hpMult: 1.10,
    atkMult: 1.10,
    defMult: 1.0,
    speedMult: 1.0,
    elementAffinity: { shadow: 0.10, fire: 0.05 }
  },
  astral: {
    key: "astral",
    hpMult: 1.05,
    atkMult: 1.10,
    defMult: 1.0,
    speedMult: 1.05,
    elementAffinity: { arcane: 0.10, light: 0.10 }
  }
};

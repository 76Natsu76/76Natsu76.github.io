export const ELEMENT_IDENTITY = {

  /* ============================================================
     FIRE
  ============================================================ */
  "fire": {
    offense: {
      vsIce: 1.25,
      vsNature: 1.20,
      vsPoison: 1.10,
      vsMetal: 1.15,
      vsWater: 0.75,
      vsFire: 0.80
    },
    defense: {
      fromWater: 1.25,
      fromIce: 1.15,
      fromFire: 0.80
    },
    status: "burn",
    statusEffect: {
      type: "dot",
      damagePct: 0.05,
      duration: 3
    },
    synergies: ["chaos", "lightning"],
    flavor: "Fire consumes, spreads, and overwhelms with raw destructive force."
  },

  /* ============================================================
     ICE
  ============================================================ */
  "ice": {
    offense: {
      vsFire: 0.75,
      vsWater: 0.80,
      vsNature: 1.10,
      vsEarth: 1.15,
      vsWind: 1.20
    },
    defense: {
      fromFire: 1.25,
      fromLightning: 1.10,
      fromIce: 0.80
    },
    status: "freeze",
    statusEffect: {
      type: "slow",
      spdMult: 0.70,
      duration: 2
    },
    synergies: ["arcane", "water"],
    flavor: "Ice restrains, slows, and freezes the flow of battle."
  },

  /* ============================================================
     LIGHTNING / ELECTRIC
  ============================================================ */
  "electric": {
    offense: {
      vsWater: 1.30,
      vsMetal: 1.25,
      vsWind: 1.10,
      vsEarth: 0.80
    },
    defense: {
      fromEarth: 1.20,
      fromWater: 1.10
    },
    status: "shock",
    statusEffect: {
      type: "stun",
      chance: 0.20,
      duration: 1
    },
    synergies: ["wind", "fire"],
    flavor: "Lightning strikes fast, chaining between targets with volatile energy."
  },

  /* ============================================================
     WATER
  ============================================================ */
  "water": {
    offense: {
      vsFire: 1.25,
      vsEarth: 1.10,
      vsPoison: 1.15,
      vsIce: 0.80
    },
    defense: {
      fromElectric: 1.30,
      fromPoison: 0.80
    },
    status: "soak",
    statusEffect: {
      type: "vulnerability",
      electricMult: 1.25,
      duration: 2
    },
    synergies: ["ice", "nature"],
    flavor: "Water adapts, flows, and reshapes the battlefield."
  },

  /* ============================================================
     EARTH
  ============================================================ */
  "earth": {
    offense: {
      vsLightning: 1.25,
      vsFire: 1.10,
      vsMetal: 1.20,
      vsWind: 0.80
    },
    defense: {
      fromWind: 1.15,
      fromWater: 1.10,
      fromEarth: 0.85
    },
    status: "crush",
    statusEffect: {
      type: "defDown",
      defMult: 0.85,
      duration: 2
    },
    synergies: ["nature", "metal"],
    flavor: "Earth stabilizes, fortifies, and crushes with overwhelming force."
  },

  /* ============================================================
     WIND
  ============================================================ */
  "wind": {
    offense: {
      vsEarth: 1.20,
      vsFire: 1.10,
      vsPoison: 1.10,
      vsLightning: 0.90
    },
    defense: {
      fromEarth: 1.20,
      fromIce: 1.10
    },
    status: "disrupt",
    statusEffect: {
      type: "accuracyDown",
      accMult: 0.85,
      duration: 2
    },
    synergies: ["lightning", "nature"],
    flavor: "Wind cuts, disrupts, and dances unpredictably through combat."
  },

  /* ============================================================
     NATURE
  ============================================================ */
  "nature": {
    offense: {
      vsWater: 1.10,
      vsEarth: 1.10,
      vsPoison: 0.80,
      vsFire: 0.75
    },
    defense: {
      fromFire: 1.30,
      fromPoison: 1.20
    },
    status: "bleed",
    statusEffect: {
      type: "dot",
      damagePct: 0.03,
      duration: 4
    },
    synergies: ["earth", "water"],
    flavor: "Nature grows, entangles, and overwhelms with relentless life."
  },

  /* ============================================================
     POISON
  ============================================================ */
  "poison": {
    offense: {
      vsNature: 1.25,
      vsWater: 1.10,
      vsHoly: 0.75
    },
    defense: {
      fromFire: 1.10,
      fromHoly: 1.25
    },
    status: "toxin",
    statusEffect: {
      type: "dot",
      damagePct: 0.04,
      duration: 4
    },
    synergies: ["dark", "nature"],
    flavor: "Poison corrupts, weakens, and spreads through vulnerable foes."
  },

  /* ============================================================
     HOLY / LIGHT
  ============================================================ */
  "holy": {
    offense: {
      vsDark: 1.30,
      vsVoid: 1.25,
      vsUndead: 1.40,
      vsChaos: 1.10
    },
    defense: {
      fromDark: 0.75,
      fromVoid: 0.80
    },
    status: "purify",
    statusEffect: {
      type: "cleanse",
      removeDebuffs: true
    },
    synergies: ["light", "cosmic"],
    flavor: "Holy light purifies corruption and smites evil with radiant force."
  },

  /* ============================================================
     DARK
  ============================================================ */
  "dark": {
    offense: {
      vsHoly: 1.20,
      vsLight: 1.10,
      vsSpirit: 1.25
    },
    defense: {
      fromHoly: 1.30,
      fromLight: 1.20
    },
    status: "curse",
    statusEffect: {
      type: "atkDown",
      atkMult: 0.85,
      duration: 3
    },
    synergies: ["void", "poison"],
    flavor: "Darkness weakens, corrupts, and drains the life of its victims."
  },

  /* ============================================================
     VOID
  ============================================================ */
  "void": {
    offense: {
      vsHoly: 1.25,
      vsLight: 1.20,
      vsArcane: 1.15,
      vsCosmic: 1.10
    },
    defense: {
      fromHoly: 1.25,
      fromCosmic: 1.20
    },
    status: "entropy",
    statusEffect: {
      type: "maxHpDown",
      hpMult: 0.90,
      duration: 3
    },
    synergies: ["dark", "chaos"],
    flavor: "Void unravels matter, mind, and magic with entropic force."
  },

  /* ============================================================
     ARCANE
  ============================================================ */
  "arcane": {
    offense: {
      vsChaos: 1.20,
      vsVoid: 1.10,
      vsNature: 1.10
    },
    defense: {
      fromVoid: 1.15,
      fromCosmic: 1.10
    },
    status: "arcane-burn",
    statusEffect: {
      type: "manaBurn",
      manaPct: 0.10
    },
    synergies: ["cosmic", "light"],
    flavor: "Arcane magic is pure, volatile energy shaped by intellect."
  },

  /* ============================================================
     CHAOS
  ============================================================ */
  "chaos": {
    offense: {
      vsEverything: 1.10,
      vsHoly: 0.80
    },
    defense: {
      fromHoly: 1.25
    },
    status: "chaos-surge",
    statusEffect: {
      type: "random",
      effects: ["burn", "bleed", "shock", "curse"],
      chance: 0.50
    },
    synergies: ["fire", "void"],
    flavor: "Chaos mutates, destabilizes, and warps the rules of combat."
  },

  /* ============================================================
     COSMIC
  ============================================================ */
  "cosmic": {
    offense: {
      vsVoid: 1.20,
      vsArcane: 1.15,
      vsDark: 1.10
    },
    defense: {
      fromVoid: 1.20,
      fromArcane: 1.10
    },
    status: "gravity-well",
    statusEffect: {
      type: "pull",
      spdMult: 0.80,
      duration: 2
    },
    synergies: ["arcane", "holy"],
    flavor: "Cosmic energy bends gravity, space, and probability itself."
  },

  /* ============================================================
     METAL
  ============================================================ */
  "metal": {
    offense: {
      vsEarth: 1.10,
      vsWind: 1.10,
      vsLightning: 0.75
    },
    defense: {
      fromLightning: 1.25,
      fromFire: 1.10
    },
    status: "armor-break",
    statusEffect: {
      type: "defDown",
      defMult: 0.80,
      duration: 2
    },
    synergies: ["earth", "fire"],
    flavor: "Metal strikes hard, withstands blows, and resists deformation."
  },

  /* ============================================================
     SPIRIT
  ============================================================ */
  "spirit": {
    offense: {
      vsDark: 1.20,
      vsVoid: 1.10,
      vsUndead: 1.25
    },
    defense: {
      fromDark: 1.20,
      fromVoid: 1.15
    },
    status: "soul-burn",
    statusEffect: {
      type: "dot",
      damagePct: 0.04,
      duration: 3
    },
    synergies: ["holy", "nature"],
    flavor: "Spirit magic channels ancestral echoes and ethereal force."
  }

}; // END ELEMENT_IDENTITY

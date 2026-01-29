// ============================================================
// WEATHER TABLE
// ============================================================
//
// Defines all possible weather types and their gameplay effects.
// Regions reference these keys to determine their weather pools.
// ============================================================

export const weatherTable = {
  clear: {
    key: "clear",
    name: "Clear Skies",
    encounterRateMult: 1.0,
    lootMultiplier: 1.0,
    message: "The weather is calm and peaceful.",
    combatModifiers: {
      playerATKMult: 1.0,
      playerDEFMult: 1.0,
      enemyATKMult: 1.0,
      enemyDEFMult: 1.0,
      notes: "Calm, neutral weather with no environmental influence."
    }
  },

  fog: {
    key: "fog",
    name: "Fog",
    evadeBonus: 0.05,
    accuracyPenalty: 0.05,
    encounterRateMult: 1.1,
    message: "A thick fog blankets the area.",
    combatModifiers: {
      playerATKMult: 1.0,
      playerDEFMult: 1.0,
      enemyATKMult: 1.0,
      enemyDEFMult: 1.0,
      accuracyMult: 0.85,
      critChanceAdd: -0.02,
      notes: "Thick fog obscures vision, heavily reducing accuracy and suppressing crits."
    }
  },

  storm: {
    key: "storm",
    name: "Storm",
    lightningChance: 0.10,
    encounterRateMult: 1.2,
    lootMultiplier: 1.1,
    message: "A violent storm rages overhead.",
    combatModifiers: {
      playerATKMult: 1.0,
      playerDEFMult: 0.95,
      enemyATKMult: 1.10,
      enemyDEFMult: 1.0,
      elementBias: { lightning: +0.20, wind: +0.10 },
      critChanceAdd: +0.02,
      notes: "Violent winds and lightning empower storm‑aligned attacks and destabilize defenses."
    }
  },

  rain: {
    key: "rain",
    name: "Rain",
    fireDamagePenalty: 0.10,
    encounterRateMult: 1.05,
    message: "Rain pours steadily from the sky.",
    combatModifiers: {
      playerATKMult: 1.0,
      playerDEFMult: 1.0,
      enemyATKMult: 1.0,
      enemyDEFMult: 1.0,
      elementBias: { water: +0.10, fire: -0.10 },
      accuracyMult: 0.95,
      notes: "Steady rainfall dampens fire, empowers water, and slightly reduces accuracy."
    }
  },

  heatwave: {
    key: "heatwave",
    name: "Heatwave",
    fireBonus: 0.15,
    waterPenalty: 0.10,
    message: "Scorching heat radiates across the land.",
    combatModifiers: {
      playerATKMult: 1.05,
      playerDEFMult: 0.90,
      enemyATKMult: 1.05,
      enemyDEFMult: 1.0,
      elementBias: { fire: +0.20, ice: -0.15 },
      specialRules: { reducedHealing: true },
      notes: "Extreme heat boosts fire damage, weakens endurance, and reduces healing."
    }
  },

  arcane_winds: {
    key: "arcane_winds",
    name: "Arcane Winds",
    arcaneBonus: 0.15,
    encounterRateMult: 1.15,
    message: "Arcane winds swirl unpredictably.",
    combatModifiers: {
      playerATKMult: 1.0,
      playerDEFMult: 0.95,
      enemyATKMult: 1.05,
      enemyDEFMult: 1.0,
      elementBias: { arcane: +0.20, lightning: +0.10 },
      critChanceAdd: +0.05,
      critDamageMult: 1.15,
      notes: "Arcane turbulence increases crits and empowers magic, but destabilizes defenses."
    }
  },

  void_storm: {
    key: "void_storm",
    name: "Void Storm",
    voidBonus: 0.20,
    hazardChanceMult: 1.3,
    message: "A storm of void energy distorts reality.",
    combatModifiers: {
      playerATKMult: 0.95,
      playerDEFMult: 0.85,
      enemyATKMult: 1.10,
      enemyDEFMult: 1.10,
      elementBias: { void: +0.25, shadow: +0.10 },
      accuracyMult: 0.90,
      specialRules: { voidPressure: true },
      notes: "Reality warps under void pressure, crushing defenses and empowering void energy."
    }
  }
};


export const WEATHER_COMBAT_FLAVOR = {
  clear: [
    "The air is calm — perfect conditions for battle."
  ],
  rain: [
    "Rain pours down, slickening the ground beneath you."
  ],
  fog: [
    "A thick fog obscures your vision."
  ],
  storm: [
    "Lightning cracks overhead as combat begins."
  ],
  heatwave: [
    "The oppressive heat drains your stamina."
  ],
  arcane_winds: [
    "Arcane winds swirl unpredictably around you."
  ],
  void_storm: [
    "Void energy lashes out violently as the fight begins."
  ]
};

export const WEATHER_COMBAT_LOGS = {
  rain: {
    firePenalty: "The rain dampens the flames!",
    lightningBoost: "Lightning crackles with amplified power!",
    waterBoost: "Water surges with the storm’s momentum!"
  },
  fog: {
    accuracyPenalty: "The fog obscures your vision."
  },
  storm: {
    lightningBoost: "The storm supercharges your lightning attack!",
    shockBoost: "Electricity dances wildly in the storm!"
  },
  heatwave: {
    fireBoost: "The heatwave intensifies the flames!",
    icePenalty: "The scorching heat weakens your frost attack."
  },
  arcane_winds: {
    arcaneBoost: "Arcane winds amplify your spell!"
  },
  void_storm: {
    voidBoost: "Void energy lashes out violently!",
    accuracyPenalty: "Chaotic void winds disrupt your aim."
  }
};

export const WEATHER_DAMAGE_EFFECTS = {
  clear: {},

  rain: {
    damageBoost: { lightning: 0.15, water: 0.10 },
    damagePenalty: { fire: 0.15 },
    critPenalty: 0.05
  },

  fog: {
    accuracyPenalty: 0.10,
    critPenalty: 0.10
  },

  storm: {
    damageBoost: { lightning: 0.25 },
    statusBoost: { shock: 0.20 },
    critBoost: 0.05
  },

  heatwave: {
    damageBoost: { fire: 0.15 },
    damagePenalty: { ice: 0.20 }
  },

  arcane_winds: {
    damageBoost: { arcane: 0.20 }
  },

  void_storm: {
    damageBoost: { void: 0.25 },
    accuracyPenalty: 0.05
  }
};

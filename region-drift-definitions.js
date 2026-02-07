// region-drift-definitions.js
// 3F-7: Region Drift Definitions

export const REGION_DRIFT = {
  baseDecay: {
    danger: -0.001,      // regions slowly calm down
    stability: +0.002,   // stability slowly recovers
    elemental: -0.0005   // elemental charge dissipates
  },

  crisisPressure: {
    danger: +0.01,       // per crisis stage tick
    stability: -0.015
  },

  seasonBias: {
    spring:  { danger: -0.005, stability: +0.01,  elemental: { nature: +0.02 } },
    summer:  { danger: +0.01,  stability: -0.005, elemental: { fire: +0.03 } },
    autumn:  { danger: +0.005, stability: -0.01,  elemental: { shadow: +0.02 } },
    winter:  { danger: +0.015, stability: -0.015, elemental: { frost: +0.03 } }
  },

  factionPressure: {
    // Example: undead faction increases danger
    undead: { danger: +0.02, stability: -0.02 },
    beast:  { danger: +0.015, stability: -0.01 },
    arcane: { danger: +0.01, stability: +0.005 }
  }
};

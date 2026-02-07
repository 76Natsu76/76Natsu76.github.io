// crisis-definitions.js

export const CRISIS_DEFINITIONS = {
  undead: {
    stages: [
      { id: "undeadRising", danger: 1.1, familyMult: { undead: 1.3 } },
      { id: "undeadSurge", danger: 1.3, familyMult: { undead: 1.6 } },
      { id: "necropolisBloom", danger: 1.6, familyMult: { undead: 2.0 } },
      { id: "collapse", danger: 1.2 },
      { id: "recovery", danger: 0.9 }
    ],
    duration: 3 * 60 * 60 * 1000 // 3 hours per stage
  }
};

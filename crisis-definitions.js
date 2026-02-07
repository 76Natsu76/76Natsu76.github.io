// crisis-definitions.js
// 3F-7: Canonical crisis arcs and stage data

export const CRISIS_DEFINITIONS = {
  undead: {
    id: "undead",
    stages: [
      { id: "undeadRising",   dangerMult: 1.1, familyMult: { undead: 1.3 } },
      { id: "undeadSurge",    dangerMult: 1.3, familyMult: { undead: 1.6 } },
      { id: "necropolisBloom",dangerMult: 1.6, familyMult: { undead: 2.0 } },
      { id: "collapse",       dangerMult: 1.2 },
      { id: "recovery",       dangerMult: 0.9 }
    ],
    stageDurationMs: 3 * 60 * 60 * 1000 // 3 hours per stage
  },

  beast: {
    id: "beast",
    stages: [
      { id: "beastStirrings", dangerMult: 1.1, familyMult: { beast: 1.3 } },
      { id: "beastUprising",  dangerMult: 1.3, familyMult: { beast: 1.6 } },
      { id: "beastRampage",   dangerMult: 1.6, familyMult: { beast: 2.0 } },
      { id: "exhaustion",     dangerMult: 1.1 },
      { id: "recovery",       dangerMult: 0.95 }
    ],
    stageDurationMs: 2 * 60 * 60 * 1000
  }
};

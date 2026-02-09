// settlement-buildings.js

export const BUILDINGS = {
  town_center: {
    name: "Town Center",
    description: "The heart of the settlement.",
    tiers: [
      {
        level: 1,
        requirements: {},
        effects: {
          moraleMult: 1.0,
          prosperityMult: 1.0
        }
      },
      {
        level: 2,
        requirements: {
          gold: 200,
          bossDefeated: true
        },
        effects: {
          moraleMult: 1.1,
          prosperityMult: 1.1
        }
      }
    ]
  },

  blacksmith: {
    name: "Blacksmith",
    description: "Allows forging and repairs.",
    tiers: [
      {
        level: 0,
        requirements: {},
        effects: {}
      },
      {
        level: 1,
        requirements: {
          gold: 150,
          prosperity: 1.0
        },
        effects: {
          unlocksCrafting: true
        }
      },
      {
        level: 2,
        requirements: {
          gold: 300,
          prosperity: 1.2,
          bossDefeated: true
        },
        effects: {
          unlocksAdvancedCrafting: true
        }
      }
    ]
  },

  watchtower: {
    name: "Watchtower",
    description: "Improves regional safety.",
    tiers: [
      {
        level: 0,
        requirements: {},
        effects: {}
      },
      {
        level: 1,
        requirements: {
          gold: 100,
          crisisResolved: true
        },
        effects: {
          dangerReduction: 0.1
        }
      }
    ]
  }
};

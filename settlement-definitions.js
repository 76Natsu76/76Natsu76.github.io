// settlement-definitions.js

export const SETTLEMENTS = {
  greenhaven: {
    name: "Greenhaven",
    region: "forest",
    type: "village",
    population: 120,
    description: "A peaceful woodland village known for herbalists and hunters.",
    startingMorale: 1.0,
    startingProsperity: 1.0,
    npcTemplates: ["villager", "hunter", "herbalist"]
  },

  emberfall: {
    name: "Emberfall",
    region: "firelands",
    type: "town",
    population: 300,
    description: "A hardy settlement built near volcanic vents.",
    startingMorale: 0.9,
    startingProsperity: 1.2,
    npcTemplates: ["miner", "blacksmith", "scout"]
  },

  frostwatch: {
    name: "Frostwatch",
    region: "frostlands",
    type: "outpost",
    population: 80,
    description: "A frontier outpost guarding against frost beasts.",
    startingMorale: 1.1,
    startingProsperity: 0.8,
    npcTemplates: ["soldier", "scout", "trapper"]
  }
};

// quest-definitions.js

export const QUEST_TEMPLATES = {
  gather_basic: {
    name: "Gather Materials",
    type: "gather",
    minLevel: 1,
    maxLevel: 20,
    repCap: 100, // low-tier quests
    objectives: [
      { item: "herb", amount: 5 }
    ],
    rewards: {
      gold: 20,
      exp: 50
    }
  },

  hunt_beasts: {
    name: "Cull the Beasts",
    type: "hunt",
    minLevel: 5,
    maxLevel: 40,
    repCap: 500,
    objectives: [
      { enemyTag: "beast", amount: 3 }
    ],
    rewards: {
      gold: 40,
      exp: 120
    }
  },

  crisis_support: {
    name: "Support the Region",
    type: "crisis",
    minLevel: 25,
    maxLevel: 500,
    repCap: 1000,
    requiresCrisis: true,
    objectives: [
      { action: "assist_settlement", amount: 1 }
    ],
    rewards: {
      gold: 60,
      exp: 200
    }
  },

  boss_scouting: {
    name: "Scout the Threat",
    type: "boss",
    minLevel: 10,
    repCap: 1000,
    requiresBossAwakening: true,
    objectives: [
      { action: "scout_boss_area" }
    ],
    rewards: {
      gold: 80,
      exp: 250
    }
  }
};

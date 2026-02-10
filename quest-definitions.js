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
  },

  "royal_intro": {
    id: "royal_intro",
    name: "An Audience with the Crown",
    tier: "royal",
    minReputation: 2000,
    maxReputation: 999999,
    repCap: 2500,
    settlementKey: "capital_city",
    objectives: [
      { action: "travel_to_capital", amount: 1 }
    ],
    rewards: {
      gold: 500,
      xp: 5000,
      reputation: 100
    },
    nextQuest: "royal_trial"
  },

  "royal_trial": {
    id: "royal_trial",
    name: "Trial of the Crown",
    tier: "royal",
    minReputation: 2100,
    maxReputation: 999999,
    repCap: 3000,
    settlementKey: "capital_city",
    objectives: [
      { enemyTag: "royal_guard_traitor", amount: 3 }
    ],
    rewards: {
      gold: 1000,
      xp: 10000,
      reputation: 150
    },
    nextQuest: "royal_oath"
  },

  "royal_oath": {
    id: "royal_oath",
    name: "Oath of the Crown",
    tier: "royal",
    minReputation: 2300,
    maxReputation: 999999,
    repCap: 4000,
    settlementKey: "capital_city",
    objectives: [
      { action: "swear_oath", amount: 1 }
    ],
    rewards: {
      gold: 2000,
      xp: 20000,
      reputation: 200
    },
    finalRoyal: true
  }
};

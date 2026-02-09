// npc-jobs.js

export const NPC_JOBS = {
  villager: {
    produces: { herbs: 0.2 },
    consumes: { food: 0.1 }
  },
  hunter: {
    produces: { leather: 0.3 },
    consumes: { food: 0.2 }
  },
  blacksmith: {
    produces: {},
    consumes: { ore: 0.1 },
    requiresBuilding: "blacksmith"
  },
  miner: {
    produces: { ore: 0.4 },
    consumes: { food: 0.2 }
  }
};

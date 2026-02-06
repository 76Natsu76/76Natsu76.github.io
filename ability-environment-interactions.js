// ability-environment-interactions.js
export const ABILITY_ENVIRONMENT_INTERACTIONS = {
  lightning: {
    tags: ["storm-kissed", "stormbreaker", "tempest-forged"],
    damageMult: 1.25,
    chainChance: 0.25,
    extraStatus: { type: "stun", duration: 1 }
  },
  fire: {
    tags: ["rainy", "storm", "oceanic"],
    damageMult: 0.8
  },
  ice: {
    tags: ["frostbitten", "winterborn", "blizzard"],
    damageMult: 1.20,
    extraStatus: { type: "slow", duration: 1 }
  },
  nature: {
    tags: ["deepwild", "overgrown", "primeval"],
    healingBoostMult: 1.15
  },
  shadow: { 
    tags: ["void-touched", "unmaking", "paradox-charged"], 
    damageMult: 1.20, 
    extraStatus: { type: "corruption", duration: 1 } 
  }
};

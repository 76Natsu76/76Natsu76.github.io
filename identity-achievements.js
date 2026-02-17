export const IDENTITY_ACHIEVEMENTS = {
  "slayer_of_flame": {
    name: "Slayer of Flame",
    condition: (enemy) => enemy.element === "fire",
    progress: 0,
    goal: 10,
    reward: { gold: 100, item: "fire_essence" }
  },

  "void_hunter": {
    name: "Void Hunter",
    condition: (enemy) => enemy.element === "void",
    progress: 0,
    goal: 5,
    reward: { item: "void_essence", quantity: 3 }
  },

  "beast_master": {
    name: "Beast Master",
    condition: (enemy) => enemy.subrace === "beast",
    progress: 0,
    goal: 20,
    reward: { title: "Beast Master" }
  }
};

export function updateIdentityAchievements(enemy) {
  for (const key in IDENTITY_ACHIEVEMENTS) {
    const ach = IDENTITY_ACHIEVEMENTS[key];
    if (ach.condition(enemy)) {
      ach.progress++;
    }
  }
}


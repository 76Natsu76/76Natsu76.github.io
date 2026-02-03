export const ENEMY_GROUP_RULES = {
  // Small packs
  wolf: { min: 2, max: 4 },
  dire_wolf: { min: 2, max: 3 },
  howling_warg: { min: 2, max: 3 },

  // Goblin tribes
  goblin: { min: 2, max: 5 },
  hobgoblin: { min: 1, max: 3 },
  bandit: { min: 1, max: 3 },

  // Swarms / Hiveminds
  hornet_swarm: { min: 3, max: 6 },
  tiny_slime: { min: 2, max: 5 },
  sticky_slime: { min: 2, max: 4 },

  // Undead clusters
  skeleton: { min: 1, max: 3 },
  skeleton_archer: { min: 1, max: 2 },
  zombie: { min: 1, max: 3 },
  ghoul: { min: 1, max: 2 },

  // Default fallback
  default: { min: 1, max: 1 }
};

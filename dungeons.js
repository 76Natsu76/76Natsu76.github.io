export const DUNGEONS = {
  caverns_first_echo: {
    name: "Caverns of the First Echo",
    recommendedLevel: 5,
    entryRequirements: {
      minLevel: 1,
      requiredItems: [],
      requiredFlags: []
    },
    floors: [
      {
        floorIndex: 1,
        type: "normal",
        encounterTable: ["cave_miner", "tunnel_delver", "sticky_slime"],
        events: ["echo_shrine"],
        lootTable: "cavern_floor_1",
        modifiers: {
          biome: "cave",
          weather: "none",
          globalBuffs: [],
          globalDebuffs: []
        }
      },
      {
        floorIndex: 2,
        type: "elite",
        encounterTable: ["deepstone_foreman", "orebreaker"],
        events: ["collapsed_passage"],
        lootTable: "cavern_floor_2",
        modifiers: {
          biome: "cave",
          weather: "none",
          globalBuffs: [],
          globalDebuffs: ["darkness"]
        }
      }
    ],
    boss: {
      enemyKey: "Obsidian World‑Breaker",
      lootTable: "cavern_boss"
    },
    dungeonModifiers: {
      noHealing: false,
      doubleLoot: false,
      enemyScaling: 1.15
    },
    rewards: {
      xp: 300,
      gold: 120,
      items: ["obsidian_fragment"]
    }
  },

  stormspire_ascent: {
    name: "Stormspire Ascent",
    recommendedLevel: 15,
    entryRequirements: {
      minLevel: 10,
      requiredItems: [],
      requiredFlags: ["forest_boss_defeated"]
    },
    floors: [
      {
        floorIndex: 1,
        type: "normal",
        encounterTable: ["storm_drake", "wind_elemental"],
        events: ["tempest_shrine"],
        lootTable: "storm_floor_1",
        modifiers: {
          biome: "mountain",
          weather: "storm",
          globalBuffs: ["lightning_damage_up"],
          globalDebuffs: []
        }
      },
      {
        floorIndex: 2,
        type: "elite",
        encounterTable: [
          "Storm-Crowned Tempestling",
          "Storm-Crowned Tempestling_Rare"
        ],
        events: ["broken_conduit"],
        lootTable: "storm_floor_2",
        modifiers: {
          biome: "mountain",
          weather: "storm",
          globalBuffs: [],
          globalDebuffs: ["reduced_accuracy"]
        }
      }
    ],
    boss: {
      enemyKey: "Storm Sovereign",
      lootTable: "storm_boss"
    },
    dungeonModifiers: {
      noHealing: true,
      doubleLoot: false,
      enemyScaling: 1.25
    },
    rewards: {
      xp: 600,
      gold: 300,
      items: ["stormcore"]
    }
  },

  astral_rift_labyrinth: {
    name: "Astral Rift Labyrinth",
    recommendedLevel: 25,
    entryRequirements: {
      minLevel: 20,
      requiredItems: ["astral_key"],
      requiredFlags: ["stormspire_boss_defeated"]
    },
    floors: [
      {
        floorIndex: 1,
        type: "normal",
        encounterTable: ["astral_chimera", "astral_veined_oracle"],
        events: ["rift_anomaly"],
        lootTable: "astral_floor_1",
        modifiers: {
          biome: "astral",
          weather: "none",
          globalBuffs: ["mana_regen_up"],
          globalDebuffs: []
        }
      },
      {
        floorIndex: 2,
        type: "elite",
        encounterTable: ["Mana-Crested Riftlord", "Nullborn Ravager"],
        events: ["unstable_reality"],
        lootTable: "astral_floor_2",
        modifiers: {
          biome: "astral",
          weather: "none",
          globalBuffs: [],
          globalDebuffs: ["void_bleed"]
        }
      }
    ],
    boss: {
      enemyKey: "Astral Sovereign",
      lootTable: "astral_boss"
    },
    dungeonModifiers: {
      noHealing: false,
      doubleLoot: true,
      enemyScaling: 1.35
    },
    rewards: {
      xp: 1200,
      gold: 500,
      items: ["astral_shard"]
    }
  },

  endless_abyss: {
    name: "Endless Abyss",
    type: "endless",
    recommendedLevel: 10,
    entryRequirements: {
      minLevel: 10,
      requiredItems: [],
      requiredFlags: []
    },
    // Used for normal floors
    baseEncounterTable: ["abyss_shade", "voidling", "hollow_stalker"],
    baseLootTable: "endless_base",
    // Boss cadence
    bossEvery: 10,
    megaBossEvery: 50,
    // Endless scaling
    scaling: {
      enemyHP: 1.05,
      enemyATK: 1.05,
      lootMult: 1.02
    },
    // Optional: used by DungeonEngine.generateBoss for boss floors
    bossEnemyKey: "Abyssal Warden",
    megaBossEnemyKey: "Depth‑Crowned Cataclysm",
    dungeonModifiers: {
      noHealing: false,
      doubleLoot: false,
      enemyScaling: 1.0
    },
    // No fixed rewards; score is the reward
    rewards: null
  },
  
  greenhaven_catacombs: {
    id: "greenhaven_catacombs",
    name: "Greenhaven Catacombs",
    type: "normal",
    minLevel: 5,
    maxLevel: 15,
    floors: 3,
    roomsPerFloor: 4,
    baseTier: 1,
    maxTier: 3,
    chestRoomsPerFloor: 1, // 1 room per floor has a chest (treasure or mimic)
    bossFloor: 3,
    bossChest: true
  },

  twisted_labyrinth: {
    id: "twisted_labyrinth",
    name: "Twisted Labyrinth",
    type: "labyrinth",
    minLevel: 20,
    maxLevel: 40,
    floors: 1,              // one huge floor
    roomsPerFloor: 20,      // labyrinth graph
    baseTier: 3,
    maxTier: 5,
    chestRoomsPerFloor: 2,
    bossRoomId: "center_chamber",
    bossChest: true
  },

  great_dungeon_100: {
    id: "great_dungeon_100",
    name: "Great Dungeon of 100 Floors",
    type: "great_dungeon",
    minLevel: 1,
    maxLevel: 1000,
    floors: 100,
    roomsPerFloor: 3,       // small floors, focused on progression
    chestRoomsPerFloor: 1,
    bossEvery: 10,          // boss on floors 10, 20, ..., 100
    bossChest: true
  }
};

export function getGreatDungeonLevelRange(floor) {
  if (floor <= 10) return { min: 1, max: 10 };
  if (floor <= 20) return { min: 10, max: 20 };
  if (floor <= 30) return { min: 20, max: 40 };
  if (floor <= 40) return { min: 40, max: 80 };
  if (floor <= 50) return { min: 80, max: 160 };
  if (floor <= 60) return { min: 160, max: 240 };
  if (floor <= 70) return { min: 240, max: 360 };
  if (floor <= 80) return { min: 360, max: 540 };
  if (floor <= 90) return { min: 540, max: 800 };
  return { min: 800, max: 1000 };
}

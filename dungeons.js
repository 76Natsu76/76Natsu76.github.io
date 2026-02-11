/************************************************************
 * dungeons.js — Canonical Unified Dungeon Definitions
 ************************************************************/

export const DUNGEONS = {

  /************************************************************
   * 1. Caverns of the First Echo (Normal Dungeon)
   ************************************************************/
  caverns_first_echo: {
    id: "caverns_first_echo",
    name: "Caverns of the First Echo",
    type: "normal",

    minLevel: 1,
    maxLevel: 15,
    recommendedLevel: 5,

    floors: 2,
    roomsPerFloor: 4,
    chestRoomsPerFloor: 1,

    baseTier: 1,
    maxTier: 3,

    floorsConfig: {
      1: {
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
      2: {
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
    },

    boss: {
      enemyKey: "obsidian_world_breaker",
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

  /************************************************************
   * 2. Stormspire Ascent (Normal Dungeon)
   ************************************************************/
  stormspire_ascent: {
    id: "stormspire_ascent",
    name: "Stormspire Ascent",
    type: "normal",

    minLevel: 10,
    maxLevel: 25,
    recommendedLevel: 15,

    floors: 2,
    roomsPerFloor: 4,
    chestRoomsPerFloor: 1,

    baseTier: 2,
    maxTier: 4,

    floorsConfig: {
      1: {
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
      2: {
        encounterTable: [
          "storm_crowned_tempestling",
          "storm_crowned_tempestling_rare"
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
    },

    boss: {
      enemyKey: "storm_sovereign",
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

  /************************************************************
   * 3. Astral Rift Labyrinth (Labyrinth Dungeon)
   ************************************************************/
  astral_rift_labyrinth: {
    id: "astral_rift_labyrinth",
    name: "Astral Rift Labyrinth",
    type: "labyrinth",

    minLevel: 20,
    maxLevel: 40,
    recommendedLevel: 25,

    floors: 1,
    roomsPerFloor: 20,
    chestRoomsPerFloor: 2,

    baseTier: 4,
    maxTier: 6,

    floorsConfig: {
      1: {
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
      2: {
        encounterTable: ["mana_crest_riftlord", "nullborn_ravager"],
        events: ["unstable_reality"],
        lootTable: "astral_floor_2",
        modifiers: {
          biome: "astral",
          weather: "none",
          globalBuffs: [],
          globalDebuffs: ["void_bleed"]
        }
      }
    },

    bossRoomId: "center_chamber",

    boss: {
      enemyKey: "astral_sovereign",
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

  /************************************************************
   * 4. Endless Abyss (Endless Dungeon)
   ************************************************************/
  endless_abyss: {
    id: "endless_abyss",
    name: "Endless Abyss",
    type: "endless",

    minLevel: 10,
    maxLevel: 9999,
    recommendedLevel: 10,

    baseEncounterTable: ["abyss_shade", "voidling", "hollow_stalker"],
    baseLootTable: "endless_base",

    bossEvery: 10,
    megaBossEvery: 50,

    scaling: {
      enemyHP: 1.05,
      enemyATK: 1.05,
      lootMult: 1.02
    },

    bossEnemyKey: "abyssal_warden",
    megaBossEnemyKey: "depth_crowned_cataclysm",

    dungeonModifiers: {
      noHealing: false,
      doubleLoot: false,
      enemyScaling: 1.0
    },

    rewards: null // score-based
  },

  /************************************************************
   * 5. Greenhaven Catacombs (Normal Dungeon)
   ************************************************************/
  greenhaven_catacombs: {
    id: "greenhaven_catacombs",
    name: "Greenhaven Catacombs",
    type: "normal",

    minLevel: 5,
    maxLevel: 15,

    floors: 3,
    roomsPerFloor: 4,
    chestRoomsPerFloor: 1,

    baseTier: 1,
    maxTier: 3,

    bossFloor: 3,
    bossChest: true
  },

  /************************************************************
   * 6. Twisted Labyrinth (Labyrinth Dungeon)
   ************************************************************/
  twisted_labyrinth: {
    id: "twisted_labyrinth",
    name: "Twisted Labyrinth",
    type: "labyrinth",

    minLevel: 20,
    maxLevel: 40,

    floors: 1,
    roomsPerFloor: 20,
    chestRoomsPerFloor: 2,

    baseTier: 3,
    maxTier: 5,

    bossRoomId: "center_chamber",
    bossChest: true
  },

  /************************************************************
   * 7. Great Dungeon of 100 Floors (Mega Dungeon)
   ************************************************************/
  great_dungeon_100: {
    id: "great_dungeon_100",
    name: "Great Dungeon of 100 Floors",
    type: "great_dungeon",

    minLevel: 1,
    maxLevel: 1000,

    floors: 100,
    roomsPerFloor: 3,
    chestRoomsPerFloor: 1,

    bossEvery: 10,
    bossChest: true
  }
};

/************************************************************
 * Great Dungeon Level Scaling
 ************************************************************/
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

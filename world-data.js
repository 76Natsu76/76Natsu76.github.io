// world-data.js
// Static world + region definitions for the GitHub‑only RPG

const WORLD_DATA = {
  regions: [
    {
      key: "forest",
      name: "Whispering Forest",
      biome: "forest",
      weather: "rain",
      danger: 1,
      blessing: 0,
      minLevel: 1,
      maxLevel: 10,
      worldBoss: { alive: true, name: "Elder Treant" },
      events: ["mushroom_bloom", "lost_traveler"]
    },

    {
      key: "plains",
      name: "Golden Plains",
      biome: "plains",
      weather: "clear",
      danger: 1,
      blessing: 1,
      minLevel: 1,
      maxLevel: 12,
      worldBoss: { alive: true, name: "Stampede Titan" },
      events: ["wandering_merchant"]
    },

    {
      key: "cavern",
      name: "Shattered Cavern",
      biome: "cavern",
      weather: "still",
      danger: 2,
      blessing: 0,
      minLevel: 5,
      maxLevel: 20,
      worldBoss: { alive: true, name: "Crystal Devourer" },
      events: ["echoing_whispers", "unstable_crystals"]
    },

    {
      key: "ruins",
      name: "Ancient Ruins",
      biome: "ruins",
      weather: "fog",
      danger: 3,
      blessing: 0,
      minLevel: 10,
      maxLevel: 25,
      worldBoss: { alive: true, name: "Forgotten Sentinel" },
      events: ["arcane_resonance"]
    },

    {
      key: "swamp",
      name: "Murkmire Swamp",
      biome: "swamp",
      weather: "humid",
      danger: 3,
      blessing: -1,
      minLevel: 12,
      maxLevel: 28,
      worldBoss: { alive: true, name: "Bog Hydra" },
      events: ["toxic_fumes", "witchfire"]
    },

    {
      key: "desert",
      name: "Scorched Expanse",
      biome: "desert",
      weather: "heatwave",
      danger: 4,
      blessing: 0,
      minLevel: 15,
      maxLevel: 35,
      worldBoss: { alive: true, name: "Sand Wyrm" },
      events: ["mirage", "sunflare"]
    },

    {
      key: "tundra",
      name: "Frozen Tundra",
      biome: "tundra",
      weather: "blizzard",
      danger: 4,
      blessing: 0,
      minLevel: 20,
      maxLevel: 40,
      worldBoss: { alive: true, name: "Frostborn Colossus" },
      events: ["whiteout", "ancient_ice"]
    },

    {
      key: "mountains",
      name: "Titanpeak Mountains",
      biome: "mountains",
      weather: "windstorm",
      danger: 5,
      blessing: 1,
      minLevel: 25,
      maxLevel: 50,
      worldBoss: { alive: true, name: "Skybreaker Roc" },
      events: ["rockslide", "thin_air"]
    },

    {
      key: "void",
      name: "The Voidreach",
      biome: "void",
      weather: "voidpulse",
      danger: 6,
      blessing: -2,
      minLevel: 40,
      maxLevel: 70,
      worldBoss: { alive: true, name: "The Nameless Maw" },
      events: ["reality_fracture", "whispers"]
    },

    {
      key: "celestial",
      name: "Celestial Steppe",
      biome: "celestial",
      weather: "starlight",
      danger: 6,
      blessing: 3,
      minLevel: 45,
      maxLevel: 75,
      worldBoss: { alive: true, name: "Astral Warden" },
      events: ["meteor_shower", "cosmic_alignment"]
    },

    {
      key: "abyssal_scar",
      name: "Abyssal Scar",
      biome: "abyss",
      weather: "blood_mist",
      danger: 7,
      blessing: -3,
      minLevel: 55,
      maxLevel: 85,
      worldBoss: { alive: true, name: "Harbinger of Ruin" },
      events: ["abyssal_surge", "screaming_earth"]
    },

    {
      key: "arcane_rift",
      name: "Arcane Rift",
      biome: "arcane",
      weather: "mana_storm",
      danger: 7,
      blessing: 2,
      minLevel: 60,
      maxLevel: 90,
      worldBoss: { alive: true, name: "Riftborn Archmage" },
      events: ["wild_magic", "mana_overload"]
    },

    {
      key: "primordial_grove",
      name: "Primordial Grove",
      biome: "primordial",
      weather: "ancient_winds",
      danger: 8,
      blessing: 2,
      minLevel: 70,
      maxLevel: 100,
      worldBoss: { alive: true, name: "Worldroot Titan" },
      events: ["awakening", "nature_surge"]
    },

    {
      key: "void_frontier",
      name: "Void Frontier",
      biome: "void",
      weather: "entropy",
      danger: 9,
      blessing: -4,
      minLevel: 80,
      maxLevel: 120,
      worldBoss: { alive: true, name: "Entropy Sovereign" },
      events: ["void_storm", "collapse"]
    },

    {
      key: "eternal_citadel",
      name: "Eternal Citadel",
      biome: "citadel",
      weather: "radiance",
      danger: 9,
      blessing: 4,
      minLevel: 90,
      maxLevel: 130,
      worldBoss: { alive: true, name: "The Eternal King" },
      events: ["holy_convergence", "radiant_trial"]
    },

    {
      key: "worldbreaker_horizon",
      name: "Worldbreaker Horizon",
      biome: "apocalypse",
      weather: "cataclysm",
      danger: 10,
      blessing: -5,
      minLevel: 100,
      maxLevel: 150,
      worldBoss: { alive: true, name: "The Worldbreaker" },
      events: ["skyfall", "earthrend"]
    },

    {
      key: "astral_nexus",
      name: "Astral Nexus",
      biome: "astral",
      weather: "cosmic_flux",
      danger: 10,
      blessing: 5,
      minLevel: 120,
      maxLevel: 200,
      worldBoss: { alive: true, name: "The Starforged" },
      events: ["supernova", "astral_convergence"]
    }
  ]
};

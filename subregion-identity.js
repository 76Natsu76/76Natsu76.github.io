export const SUBREGION_IDENTITY = {

  "forest-edge": {
    "mosslight-grove": {
      tier: 1,
      type: "grove",
      biome: "deep_forest",
      quirk: "Soft moss dampens footsteps, increasing ambush chance.",
      encounterBias: { beast: +10, plant: +5 },
      lootBias: ["herbs", "moss"]
    },
    "whisperbark-thicket": {
      tier: 2,
      type: "thicket",
      biome: "wildwood",
      quirk: "Dense brush reduces accuracy.",
      encounterBias: { beast: +5, dark: +5 },
      lootBias: ["wood", "spores"]
    },
    "sunleaf-clearing": {
      tier: 1,
      type: "clearing",
      biome: "deep_forest",
      quirk: "Healing herbs grow abundantly.",
      encounterBias: { plant: +10 },
      lootBias: ["herbs", "light_essence"]
    }
  },

  "verdant-woods": {
    "greenveil-path": {
      tier: 2,
      type: "path",
      biome: "wildwood",
      quirk: "Wildlife density increased.",
      encounterBias: { beast: +10 },
      lootBias: ["fur", "herbs"]
    },
    "bloomroot-hollow": {
      tier: 3,
      type: "hollow",
      biome: "overgrowth",
      quirk: "Roots occasionally snare enemies.",
      encounterBias: { plant: +10 },
      lootBias: ["roots", "fungal_spores"]
    },
    "eldermoss-rise": {
      tier: 4,
      type: "rise",
      biome: "wildwood",
      quirk: "Ancient spores cause random buffs or debuffs.",
      encounterBias: { plant: +5, arcane: +5 },
      lootBias: ["spores", "arcane_residue"]
    }
  },

  "primordial-grove": {
    "ancient-heartwood": {
      tier: 5,
      type: "grove",
      biome: "overgrowth",
      quirk: "Nature magic intensifies healing.",
      encounterBias: { plant: +10, spirit: +5 },
      lootBias: ["ancient_bark", "life_essence"]
    },
    "thornbind-crossing": {
      tier: 4,
      type: "crossing",
      biome: "deep_forest",
      quirk: "Thorn traps deal minor bleed.",
      encounterBias: { beast: +5, plant: +5 },
      lootBias: ["thorns", "beast_blood"]
    },
    "verdant-altar": {
      tier: 6,
      type: "altar",
      biome: "grove",
      quirk: "Elemental nature damage increased.",
      encounterBias: { nature: +10 },
      lootBias: ["nature_essence", "ancient_relic"]
    }
  },

  "verdant-wildwood": {
    "shadowfern-basin": {
      tier: 3,
      type: "basin",
      biome: "wildwood",
      quirk: "Fog reduces visibility.",
      encounterBias: { dark: +5, beast: +5 },
      lootBias: ["spores", "shadow_leaf"]
    },
    "rootspire-ridge": {
      tier: 4,
      type: "ridge",
      biome: "deep_forest",
      quirk: "Elevated terrain boosts ranged attacks.",
      encounterBias: { beast: +5 },
      lootBias: ["wood", "feathers"]
    },
    "glimmerleaf-run": {
      tier: 2,
      type: "run",
      biome: "wildwood",
      quirk: "Rare herbs spawn more often.",
      encounterBias: { plant: +10 },
      lootBias: ["rare_herbs"]
    }
  },

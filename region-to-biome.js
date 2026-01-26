// region-to-biome.js
// Canonical mapping of region IDs → biome keys
// Uses world-data.js as source of truth when available,
// and name-based inference otherwise.

export const REGION_TO_BIOME = {

  // --- Core canonical regions from world-data.js ---
  "forest": "forest",
  "plains": "plains",
  "cavern": "cave",
  "ruins": "ruins",
  "swamp": "swamp",
  "desert": "desert",
  "tundra": "tundra",
  "mountains": "mountain",
  "void": "void",
  "celestial": "astral-plane",
  "arcane_rift": "arcane-rift",
  "abyssal_scar": "void-wastes",
  "primordial_grove": "primeval-overgrowth",
  "void_frontier": "void-realm",
  "eternal_citadel": "astral-nexus",
  "worldbreaker_horizon": "magma",
  "astral_nexus": "astral-nexus",
  "celestial_expanse": "astral-plane",

  // --- Regions.json extended regions (mapped by inference) ---

  // Forest family
  "forest-edge": "forest",
  "deep-forest": "deep-forest",
  "verdant-woods": "forest",
  "elderwood-heart": "elderwood-heart",
  "primeval-overgrowth": "primeval-overgrowth",
  "verdant-wildwood": "wild-forest",

  // Plains / Grasslands
  "plains-field": "plains",
  "open-steppe": "open-steppe",
  "sunspire-highlands": "highlands", // plains → highlands transition

  // Swamp / Marsh
  "swamp-marsh": "swamp",
  "drowned-marsh": "drowned-marsh",
  "whispering-marsh": "whispering-marsh",

  // Desert family
  "desert-dunes": "desert",
  "sunscorched-dunes": "sunscorched-dunes",
  "shattered-desert": "shattered-desert",

  // Void / Corrupted
  "void-realm": "void-realm",
  "void-spire": "void-wastes",
  "abyss-gate": "void-wastes",
  "abyssal-deep": "void-wastes",
  "corrupted": "corrupted",

  // Tundra / Ice
  "tundra-wastes": "tundra",
  "frostlands": "frozen-expanse",
  "crystalline-tundra": "crystalline-tundra",

  // Highlands / Mountains
  "highland-cliffs": "highlands",
  "mountain-peak": "mountain-peak",
  "highlands-of-thorne": "storm-highlands",

  // Volcanic / Magma
  "volcano-rim": "volcano",
  "volcanic-wastes": "magma",
  "emberforge-depths": "molten-crest",
  "emberfang-ridge": "molten-crest",
  "molten-underdeep": "magma",

  // Caves / Subterranean
  "cave-entrance": "cave",
  "crystal-pass": "crystal-cave",
  "crystal-caverns": "crystal-cave",
  "deep-caverns": "deep-caverns",
  "underdeep": "underdeep",
  "subterranean": "subterranean",

  // Ruins / Ancient Civilizations
  "ruins-outskirts": "ruins",
  "ruined-kingdom": "ruined-kingdom",
  "forgotten-ruins": "forgotten-ruins",

  // Coastal / Ocean-adjacent
  "azure-coast": "coastal",
  "stormbreaker-coast": "coastal",
  "outcast-island": "coastal",

  // Arcane / Magical
  "arcane-riftlands": "arcane-rift",
  "arcstone-enclave": "arcane",
  "stormforge-sanctum": "arcane",

  // Astral / Celestial
  "astral-plane": "astral-plane",
  "radiant-ascension-spire": "astral-plane",
  "seraphic-crucible": "astral-plane",
  "celestial-horizon": "astral-plane",
  "worlds-end-expanse": "astral-nexus",

  // Spirit / Fae / Magical Forest
  "spirit-kingdom": "ancient-forest",
  "eldergrove-depths": "eldergrove-depths",

  // Misc / Unique
  "trainers-city": "plateau", // closest neutral biome
  "titanfall": "magma",       // titanfall → volcanic destruction theme
  "whispering-marsh": "whispering-marsh"
};

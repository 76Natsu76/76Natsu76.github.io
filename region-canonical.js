// region-canonical.js
// Maps any subregion / extended region key to a canonical WORLD_DATA region key.
// You can freely tweak this table without touching Bestiary / world-map logic.

import { WORLD_DATA } from "./world-data.js";

const CANONICAL_REGIONS = new Set(Object.keys(WORLD_DATA.regions));

/**
 * Explicit mapping from extended/subregion keys → canonical region keys.
 * Tune these as you like; the logic below will use this first.
 */
export const REGION_CANONICAL_MAP = {
  // Core 1:1 (identity) mappings are implicit via WORLD_DATA.regions

  // Forest family
  "forest-edge": "forest",
  "deep-forest": "forest",
  "verdant-woods": "forest",
  "verdant-wildwood": "forest",

  // Primordial / ancient forest
  "elderwood-heart": "primordial_grove",
  "primeval-overgrowth": "primordial_grove",

  // Plains / city / coast-ish training hub
  "plains-field": "plains",
  "trainers-city": "plains",
  "outcast-island": "plains",
  "azure-coast": "plains",
  "stormbreaker-coast": "plains",

  // Swamp / marsh
  "swamp-marsh": "swamp",
  "whispering-marsh": "swamp",

  // Caverns / subterranean
  "crystal-pass": "cavern",
  "cave-entrance": "cavern",
  "crystal-caverns": "cavern",
  "deep-caverns": "cavern",

  // Ruins / ancient civ
  "ruins-outskirts": "ruins",
  "ruined-kingdom": "ruins",

  // Desert
  "desert-dunes": "desert",
  "shattered-desert": "desert",

  // Tundra / ice
  "tundra-wastes": "tundra",
  "frostlands": "tundra",
  "crystalline-tundra": "tundra",

  // Highlands / mountains
  "highland-cliffs": "mountains",
  "sunspire-highlands": "mountains",
  "highlands-of-thorne": "mountains",

  // Volcanic / magma / titanfall
  "volcano-rim": "worldbreaker_horizon",
  "volcanic-wastes": "worldbreaker_horizon",
  "emberforge-depths": "worldbreaker_horizon",
  "emberfang-ridge": "worldbreaker_horizon",
  "molten-underdeep": "worldbreaker_horizon",
  "titanfall": "worldbreaker_horizon",

  // Void / abyss / corrupted
  "void-realm": "void",
  "void-spire": "void",
  "abyss-gate": "abyssal_scar",
  "abyssal-deep": "abyssal_scar",
  "abyssal-scar": "abyssal_scar",
  "shadow-labyrinth": "void",
  "worlds-end-expanse": "void_frontier",

  // Astral / celestial
  "astral-plane": "celestial",
  "spirit-kingdom": "celestial",
  "celestial-expanse": "celestial_expanse",
  "eternal-citadel": "eternal_citadel",
  "astral-nexus": "astral_nexus",
  "radiant-ascension-spire": "celestial_expanse",
  "seraphic-crucible": "celestial_expanse",
  "celestial-horizon": "celestial_expanse",

  // Arcane / rift
  "arcane-riftlands": "arcane_rift",
  "arcstone-enclave": "arcane_rift",
  "stormforge-sanctum": "arcane_rift",

  // Misc unique
  "spirit_kingdom": "celestial",
  "arcstone_enclave": "arcane_rift",
  "abyssal_scar": "abyssal_scar",
  "void_frontier": "void_frontier",
  "celestial_expanse": "celestial_expanse",
  "eternal_citadel": "eternal_citadel",
  "worldbreaker_horizon": "worldbreaker_horizon",
  "astral_nexus": "astral_nexus"
};

/**
 * Resolve any region key to its canonical WORLD_DATA region key.
 */
export function getCanonicalRegionKey(regionKey) {
  if (!regionKey) return null;

  // 1) If it's already canonical, return as-is
  if (CANONICAL_REGIONS.has(regionKey)) return regionKey;

  // 2) If we have an explicit mapping, use it
  if (REGION_CANONICAL_MAP[regionKey]) {
    return REGION_CANONICAL_MAP[regionKey];
  }

  // 3) Heuristic fallback: try to infer by substring
  const k = String(regionKey).toLowerCase();

  if (k.includes("forest")) return "forest";
  if (k.includes("plain")) return "plains";
  if (k.includes("swamp") || k.includes("marsh")) return "swamp";
  if (k.includes("cave") || k.includes("cavern")) return "cavern";
  if (k.includes("ruin")) return "ruins";
  if (k.includes("desert") || k.includes("dune")) return "desert";
  if (k.includes("tundra") || k.includes("frost") || k.includes("ice")) return "tundra";
  if (k.includes("mountain") || k.includes("highland")) return "mountains";
  if (k.includes("void")) return "void";
  if (k.includes("abyss")) return "abyssal_scar";
  if (k.includes("celestial") || k.includes("astral")) return "celestial";
  if (k.includes("rift") || k.includes("arcane")) return "arcane_rift";
  if (k.includes("primordial") || k.includes("primeval") || k.includes("elderwood")) {
    return "primordial_grove";
  }

  // 4) Last resort: if nothing matches, just return the original key
  return regionKey;
}

/**
 * Given a list of region keys for an enemy, group them into:
 * - canonicalRegions: unique canonical region keys
 * - subregions: original region keys that are not canonical themselves
 */
export function groupEnemyRegions(regionKeys = []) {
  const canonicalSet = new Set();
  const subregions = new Set();

  for (const r of regionKeys) {
    const canonical = getCanonicalRegionKey(r);
    if (canonical) canonicalSet.add(canonical);
  }

  for (const r of regionKeys) {
    const canonical = getCanonicalRegionKey(r);
    // If this region is not itself a canonical region key, treat as subregion
    if (!CANONICAL_REGIONS.has(r) && canonical !== r) {
      subregions.add(r);
    }
  }

  return {
    canonicalRegions: Array.from(canonicalSet),
    subregions: Array.from(subregions)
  };
}

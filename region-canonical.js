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
  /* =========================
   * FOREST
   * ========================= */
  forest_edge: "forest",
  forest_entry: "forest",
  deep_forest: "forest",
  verdant_woods: "forest",
  verdant_wildwood: "forest",

  /* =========================
   * PLAINS
   * ========================= */
  plains_field: "plains",
  open_steppe: "plains",
  sunspire_highlands: "plains",

  /* =========================
   * CITY
   * ========================= */
  trainers_city: "city",

  /* =========================
   * SWAMP
   * ========================= */
  swamp_marsh: "swamp",
  drowned_marsh: "swamp",
  whispering_marsh: "swamp",

  /* =========================
   * DESERT
   * ========================= */
  desert_dunes: "desert",
  sunscorched_dunes: "desert",
  shattered_desert: "desert",

  /* =========================
   * TUNDRA
   * ========================= */
  tundra_wastes: "tundra",
  frostlands: "tundra",
  crystalline_tundra: "tundra",

  /* =========================
   * MOUNTAINS
   * ========================= */
  highland_cliffs: "mountains",
  highlands_of_thorne: "mountains",
  mountain_peak: "mountains",

  /* =========================
   * CAVERN
   * ========================= */
  cave_entrance: "cavern",
  crystal_pass: "cavern",
  crystal_caverns: "cavern",
  deep_caverns: "cavern",
  underdeep: "cavern",
  subterranean: "cavern",

  /* =========================
   * RUINS
   * ========================= */
  ruins_outskirts: "ruins",
  ruined_kingdom: "ruins",
  forgotten_ruins: "ruins",

  /* =========================
   * PRIMORDIAL GROVE
   * ========================= */
  elderwood_heart: "primordial_grove",
  primeval_overgrowth: "primordial_grove",

  /* =========================
   * VOID
   * ========================= */
  void_realm: "void",
  void_spire: "void",
  shadow_labyrinth: "void",
  corrupted: "void",

  /* =========================
   * ABYSSAL SCAR
   * ========================= */
  abyss_gate: "abyssal_scar",
  abyssal_deep: "abyssal_scar",
  abyssal_scar: "abyssal_scar",

  /* =========================
   * VOID FRONTIER
   * ========================= */
  worlds_end_expanse: "void_frontier",

  /* =========================
   * CELESTIAL
   * ========================= */
  astral_plane: "celestial",
  spirit_kingdom: "celestial",

  /* =========================
   * CELESTIAL EXPANSE
   * ========================= */
  celestial_expanse: "celestial_expanse",
  radiant_ascension_spire: "celestial_expanse",
  seraphic_crucible: "celestial_expanse",
  celestial_horizon: "celestial_expanse",

  /* =========================
   * ETERNAL CITADEL
   * ========================= */
  eternal_citadel: "eternal_citadel",

  /* =========================
   * ASTRAL NEXUS
   * ========================= */
  astral_nexus: "astral_nexus",

  /* =========================
   * ARCANE RIFT
   * ========================= */
  arcane_riftlands: "arcane_rift",
  arcstone_enclave: "arcane_rift",
  stormforge_sanctum: "arcane_rift",

  /* =========================
   * WORLDBREAKER HORIZON
   * ========================= */
  volcano_rim: "worldbreaker_horizon",
  volcanic_wastes: "worldbreaker_horizon",
  emberforge_depths: "worldbreaker_horizon",
  emberfang_ridge: "worldbreaker_horizon",
  molten_underdeep: "worldbreaker_horizon",
  titanfall: "worldbreaker_horizon", // updated to Tier 6 in hierarchy

  /* =========================
   * OCEAN
   * ========================= */
  western_coast: "ocean",
  azure_coast: "ocean",
  stormbreaker_coast: "ocean",
  outcast_island: "ocean",
  elusive_reef: "ocean",
  point_nemo: "ocean",
  deep_abyss: "ocean",
  leviathan_trench: "ocean",
  abyssal_rift: "ocean"
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

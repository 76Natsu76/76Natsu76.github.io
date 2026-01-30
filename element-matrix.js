// ============================================================
// ELEMENT MATRIX
// ============================================================
//
// Defines elemental strengths and weaknesses.
// Positive values = target takes MORE damage
// Negative values = target takes LESS damage
//
// Example:
// elementMatrix[attackerElement][defenderElement] = damage modifier
// ============================================================

export const ELEMENT_MATRIX = {
  // ============================================================
  // TIER 1 — BASIC
  // ============================================================
  physical: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0, ice: 0.0, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  neutral: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0, ice: 0.0, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  // ============================================================
  // TIER 2 — CLASSICAL NATURAL
  // ============================================================
  fire: {
    physical: 0.0, neutral: 0.0,
    fire: -0.20, water: -0.10, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: +0.10, nature: +0.10,
    poison: 0.0, rot: +0.10,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  water: {
    physical: 0.0, neutral: 0.0,
    fire: +0.10, water: -0.20, earth: 0.0, wind: 0.0, lightning: -0.10,
    ice: 0.0, nature: -0.10,
    poison: 0.0, rot: 0.0,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  earth: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: -0.20, wind: -0.10, lightning: +0.10,
    ice: 0.0, nature: +0.10,
    poison: 0.0, rot: 0.0,
    arcane: -0.10, astral: -0.10,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  wind: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: +0.10, wind: -0.20, lightning: -0.10,
    ice: -0.10, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  lightning: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: +0.10, earth: -0.10, wind: +0.10, lightning: -0.20,
    ice: +0.10, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  ice: {
    physical: 0.0, neutral: 0.0,
    fire: -0.10, water: 0.0, earth: 0.0, wind: +0.10, lightning: -0.10,
    ice: -0.20, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: 0.0, astral: 0.0,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  nature: {
    physical: 0.0, neutral: 0.0,
    fire: -0.10, water: +0.10, earth: -0.10, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: -0.20,
    poison: -0.10, rot: -0.10,
    arcane: -0.10, astral: -0.10,
    holy: 0.0, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: 0.0
  },

  // ============================================================
  // TIER 3 — CORRUPTION
  // ============================================================
  poison: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: +0.10,
    poison: -0.20, rot: +0.10,
    arcane: 0.0, astral: 0.0,
    holy: -0.10, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: +0.10
  },

  rot: {
    physical: 0.0, neutral: 0.0,
    fire: -0.10, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: +0.10,
    poison: +0.10, rot: -0.20,
    arcane: 0.0, astral: 0.0,
    holy: -0.20, dark: 0.0,
    void: 0.0, cosmic: 0.0, abyssal: +0.20
  },

  // ============================================================
  // TIER 4 — MAGIC
  // ============================================================
  arcane: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: +0.10, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: +0.10,
    poison: 0.0, rot: 0.0,
    arcane: -0.20, astral: -0.10,
    holy: 0.0, dark: +0.10,
    void: +0.10, cosmic: +0.20, abyssal: +0.20
  },

  astral: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: +0.10, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: +0.10, astral: -0.20,
    holy: 0.0, dark: +0.10,
    void: +0.10, cosmic: -0.20, abyssal: +0.20
  },

  // ============================================================
  // TIER 5 — LIGHT / DARK
  // ============================================================
  holy: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: 0.0,
    poison: +0.20, rot: +0.20,
    arcane: 0.0, astral: 0.0,
    holy: -0.20, dark: +0.20,
    void: -0.10, cosmic: 0.0, abyssal: -0.25
  },

  dark: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: +0.10, astral: +0.10,
    holy: +0.20, dark: -0.20,
    void: +0.10, cosmic: 0.0, abyssal: -0.10
  },

  // ============================================================
  // TIER 6 — HIGH METAPHYSICAL
  // ============================================================
  void: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: +0.10, astral: +0.10,
    holy: +0.10, dark: +0.10,
    void: -0.20, cosmic: -0.10, abyssal: -0.20
  },

  cosmic: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: 0.0,
    poison: 0.0, rot: 0.0,
    arcane: +0.20, astral: +0.20,
    holy: 0.0, dark: 0.0,
    void: +0.20, cosmic: -0.20, abyssal: -0.10
  },

  // ============================================================
  // TIER 7 — ELDRITCH
  // ============================================================
  abyssal: {
    physical: 0.0, neutral: 0.0,
    fire: 0.0, water: 0.0, earth: 0.0, wind: 0.0, lightning: 0.0,
    ice: 0.0, nature: 0.0,
    poison: +0.10, rot: +0.20,
    arcane: +0.20, astral: +0.20,
    holy: +0.25, dark: +0.10,
    void: +0.20, cosmic: +0.10, abyssal: -0.20
  }
};

export function applyElementalDamage(baseDamage, attackerElement, defenderElement) {
  if (!attackerElement || !defenderElement) return baseDamage;

  const row = ELEMENT_MATRIX[attackerElement];
  if (!row) return baseDamage;

  const mult = row[defenderElement] != null ? row[defenderElement] : 1;
  return Math.floor(baseDamage * mult);
}

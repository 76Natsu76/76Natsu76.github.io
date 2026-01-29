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
  physical: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: 0.0, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: 0.0, poison: 0.0, arcane: 0.0},
  fire: { physical: 0.0, fire: -0.20, ice: +0.20, lightning: 0.0, nature: +0.10, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: 0.0, poison: 0.0, arcane: 0.0},
  ice: { physical: 0.0, fire: +0.20, ice: -0.20, lightning: 0.0, nature: 0.0, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: 0.0, poison: 0.0, arcane: 0.0},
  lightning: { physical: 0.0, fire: 0.0, ice: +0.10, lightning: -0.20, nature: +0.20, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: 0.0, poison: 0.0, arcane: 0.0},
  nature: { physical: 0.0, fire: -0.20, ice: 0.0, lightning: -0.10, nature: -0.20, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: +0.10, poison: +0.10, arcane: 0.0},
  holy: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: 0.0, holy: -0.20, shadow: +0.25, void: +0.20, dark: +0.20, rot: 0.0, poison: 0.0, arcane: 0.0},
  shadow: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: 0.0, holy: +0.25, shadow: -0.20, void: +0.10, dark: +0.10, rot: 0.0, poison: 0.0, arcane: 0.0},
  void: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: 0.0, holy: +0.20, shadow: +0.10, void: -0.20, dark: +0.10, rot: 0.0, poison: 0.0, arcane: +0.10},
  dark: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: 0.0, holy: +0.20, shadow: +0.10, void: +0.10, dark: -0.20, rot: 0.0, poison: 0.0, arcane: 0.0},
  rot: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: +0.10, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: -0.20, poison: +0.10, arcane: 0.0},
  poison: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: +0.10, holy: 0.0, shadow: 0.0, void: 0.0, dark: 0.0, rot: +0.10, poison: -0.20, arcane: 0.0},
  arcane: { physical: 0.0, fire: 0.0, ice: 0.0, lightning: 0.0, nature: 0.0, holy: 0.0, shadow: 0.0, void: +0.10, dark: 0.0, rot: 0.0, poison: 0.0, arcane: -0.20}
};

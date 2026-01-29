export const ELEMENT_MATRIX = {
  fire:     { ice: 1.5, water: 0.5, earth: 1.2, fire: 1.0, lightning: 1.0, poison: 1.0, arcane: 1.0, void: 1.0 },
  ice:      { fire: 0.5, water: 1.0, earth: 1.2, lightning: 1.0, ice: 1.0, poison: 1.0, arcane: 1.0, void: 1.0 },
  water:    { fire: 1.5, lightning: 0.5, earth: 1.0, ice: 1.0, water: 1.0, poison: 1.0, arcane: 1.0, void: 1.0 },
  lightning:{ water: 1.5, earth: 0.5, fire: 1.0, ice: 1.0, lightning: 1.0, poison: 1.0, arcane: 1.0, void: 1.0 },
  earth:    { lightning: 1.5, fire: 0.8, ice: 0.8, water: 1.0, earth: 1.0, poison: 1.0, arcane: 1.0, void: 1.0 },
  poison:   { nature: 1.5, fire: 1.0, water: 1.0, lightning: 1.0, poison: 1.0, arcane: 1.0, void: 1.0 },
  arcane:   { void: 1.5, fire: 1.0, water: 1.0, lightning: 1.0, arcane: 1.0, poison: 1.0, earth: 1.0 },
  void:     { arcane: 1.5, fire: 1.0, water: 1.0, lightning: 1.0, void: 1.0, poison: 1.0, earth: 1.0 }
};
